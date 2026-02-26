// ─────────────────────────────────────────────────────────────────────────────
// src/hooks/useAppState.js — email login + edit/delete employee
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import * as api from "../services/api";

export function useAppState() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  const [leaves, setLeaves] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [balances, setBalances] = useState({});
  const [leaveTypes, setLeaveTypes] = useState([]);

  const fetchAllData = useCallback(async () => {
    try {
      const [leavesData, holidaysData, employeesData, balancesData, leaveTypesData] =
        await Promise.all([
          api.getLeaves(), api.getHolidays(), api.getEmployees(),
          api.getBalances(), api.getLeaveTypes(),
        ]);
      setLeaves(leavesData);
      setHolidays(holidaysData);
      setEmployees(employeesData);
      setBalances(balancesData);
      setLeaveTypes(leaveTypesData);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      api.getUser()
        .then((userData) => { setUser(userData); return fetchAllData(); })
        .catch(() => localStorage.removeItem("auth_token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [fetchAllData]);

  // ── Auth ───────────────────────────────────────────────────────────────────
  const loginWithEmail = async (email, password) => {
    try {
      const userData = await api.loginWithEmail(email, password);
      setUser(userData);
      setActiveTab("dashboard");
      await fetchAllData();
    } catch (err) {
      throw new Error(err.response?.data?.message || "Invalid email or password.");
    }
  };

  const logout = async () => {
    try { await api.logout(); } catch {}
    setUser(null);
    setActiveTab("dashboard");
    setLeaves([]); setHolidays([]); setEmployees([]);
    setBalances({}); setLeaveTypes([]);
  };

  // ── Leave actions ─────────────────────────────────────────────────────────
  const submitLeave = async (form) => {
    try {
      const result = await api.applyLeave({
        leaveType: form.leaveType, startDate: form.startDate,
        endDate: form.endDate, reason: form.reason,
      });
      if (result.success) {
        const [l, b] = await Promise.all([api.getLeaves(), api.getBalances()]);
        setLeaves(l); setBalances(b);
      }
      return result;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to submit leave.";
      alert(message);
      return { success: false, message };
    }
  };

  const cancelLeave = async (id) => {
    try {
      await api.cancelLeave(id);
      setLeaves((prev) => prev.map((l) => (l.id === id ? { ...l, status: "cancelled" } : l)));
    } catch (err) { alert(err.response?.data?.message || "Failed to cancel leave."); }
  };

  const reviewLeave = async (leaveId, action, comment) => {
    try {
      await api.reviewLeave(leaveId, action, comment);
      const [l, b] = await Promise.all([api.getLeaves(), api.getBalances()]);
      setLeaves(l); setBalances(b);
    } catch (err) { alert(err.response?.data?.message || "Failed to review leave."); }
  };

  // ── Holiday actions ───────────────────────────────────────────────────────
  const addHoliday = async (holidayData) => {
    try {
      const newH = await api.addHoliday(holidayData);
      setHolidays((prev) => [...prev, newH]);
    } catch (err) { alert(err.response?.data?.message || "Failed to add holiday."); }
  };

  const deleteHoliday = async (id) => {
    try {
      await api.deleteHoliday(id);
      setHolidays((prev) => prev.filter((h) => h.id !== id));
    } catch (err) { alert(err.response?.data?.message || "Failed to delete holiday."); }
  };

  // ── Employee actions ──────────────────────────────────────────────────────
  const addEmployee = async (form) => {
    try {
      const result = await api.addEmployee(form);
      if (result.success) {
        const [e, b] = await Promise.all([api.getEmployees(), api.getBalances()]);
        setEmployees(e); setBalances(b);
      }
      return result;
    } catch (err) { throw new Error(err.response?.data?.message || "Failed to add employee."); }
  };

  const editEmployee = async (id, form) => {
    try {
      const result = await api.editEmployee(id, form);
      if (result.success) {
        const empData = await api.getEmployees();
        setEmployees(empData);
        // If editing self, refresh user too
        if (id === user?.id) {
          const userData = await api.getUser();
          setUser(userData);
        }
      }
      return result;
    } catch (err) { throw new Error(err.response?.data?.message || "Failed to update employee."); }
  };

  const deleteEmployee = async (id) => {
    try {
      const result = await api.deleteEmployee(id);
      if (result.success) {
        setEmployees((prev) => prev.filter((e) => e.id !== id));
        const [b, l] = await Promise.all([api.getBalances(), api.getLeaves()]);
        setBalances(b); setLeaves(l);
      }
      return result;
    } catch (err) { throw new Error(err.response?.data?.message || "Failed to delete employee."); }
  };

  // ── Leave Type actions ────────────────────────────────────────────────────
  const addLeaveType = async (form) => {
    try {
      const result = await api.addLeaveType(form);
      if (result.success) {
        const [lt, b] = await Promise.all([api.getLeaveTypes(), api.getBalances()]);
        setLeaveTypes(lt); setBalances(b);
      }
      return result;
    } catch (err) { throw new Error(err.response?.data?.message || "Failed to add leave type."); }
  };

  const pendingCount = Array.isArray(leaves) ? leaves.filter((l) => l.status === "pending").length : 0;

  return {
    user, activeTab, sidebarOpen,
    leaves, holidays, employees, balances, leaveTypes, pendingCount, loading,
    setActiveTab, setSidebarOpen,
    loginWithEmail, logout,
    submitLeave, cancelLeave, reviewLeave,
    addHoliday, deleteHoliday,
    addEmployee, editEmployee, deleteEmployee,
    addLeaveType,
  };
}
