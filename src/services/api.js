// ─────────────────────────────────────────────────────────────────────────────
// src/services/api.js — with edit + delete employee
// ─────────────────────────────────────────────────────────────────────────────

import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000/api",
  headers: { Accept: "application/json", "Content-Type": "application/json" },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth ────────────────────────────────────────────────────────────────────

export async function loginWithEmail(email, password) {
  const { data } = await API.post("/login", { email, password });
  localStorage.setItem("auth_token", data.token);
  return data.user;
}

export async function logout() {
  await API.post("/logout");
  localStorage.removeItem("auth_token");
}

export async function getUser() {
  const { data } = await API.get("/user");
  return data.user || data;
}

// ── Data ────────────────────────────────────────────────────────────────────

export async function getLeaves() {
  const { data } = await API.get("/leaves");
  return data.leaves || data || [];
}

export async function getHolidays() {
  const { data } = await API.get("/holidays");
  return data.holidays || data || [];
}

export async function getEmployees() {
  const { data } = await API.get("/employees");
  return data.employees || data || [];
}

export async function getBalances() {
  const { data } = await API.get("/balances");
  return data.balances || data || {};
}

export async function getLeaveTypes() {
  const { data } = await API.get("/leave-types");
  return data.leaveTypes || data || [];
}

// ── Leave actions ───────────────────────────────────────────────────────────

export async function applyLeave(form) {
  const { data } = await API.post("/leaves", form);
  return data;
}

export async function cancelLeave(id) {
  const { data } = await API.put(`/leaves/${id}/cancel`);
  return data;
}

export async function reviewLeave(id, action, comment) {
  const { data } = await API.put(`/leaves/${id}/review`, { action, comment });
  return data;
}

// ── Holiday actions ─────────────────────────────────────────────────────────

export async function addHoliday(form) {
  const { data } = await API.post("/holidays", form);
  return data.holiday || data;
}

export async function deleteHoliday(id) {
  const { data } = await API.delete(`/holidays/${id}`);
  return data;
}

// ── Employee actions ────────────────────────────────────────────────────────

export async function addEmployee(form) {
  const { data } = await API.post("/employees", form);
  return data;
}

export async function editEmployee(id, form) {
  const { data } = await API.put(`/employees/${id}`, form);
  return data;
}

export async function deleteEmployee(id) {
  const { data } = await API.delete(`/employees/${id}`);
  return data;
}

// ── Leave Type actions ──────────────────────────────────────────────────────

export async function addLeaveType(form) {
  const { data } = await API.post("/leave-types", form);
  return data;
}

// ── Reports ─────────────────────────────────────────────────────────────────

export async function getReportByEmployee() {
  const { data } = await API.get("/reports/employee");
  return data.report || data;
}

export async function getReportByDepartment() {
  const { data } = await API.get("/reports/department");
  return data.report || data;
}

export async function getReportMonthly() {
  const { data } = await API.get("/reports/monthly");
  return data;
}
