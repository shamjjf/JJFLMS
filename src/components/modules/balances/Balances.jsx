// ─────────────────────────────────────────────────────────────────────────────
// src/components/modules/balances/Balances.jsx
// Displays real-time leave balances for all employees (HR/Admin)
// or only the current employee's balances (Employee role).
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { Icon } from "../../common";
import { LEAVE_TYPES, DEPARTMENTS } from "../../../data/mockData";
import { avatarColor } from "../../../utils/helpers";

const Balances = ({ user, employees, balances }) => {
  const [deptFilter, setDeptFilter] = useState("All");
  const [search,     setSearch]     = useState("");

  const empList =
    user.role === "employee"
      ? employees.filter((e) => e.id === user.id)
      : employees.filter(
          (e) =>
            (deptFilter === "All" || e.dept === deptFilter) &&
            e.name.toLowerCase().includes(search.toLowerCase())
        );

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 800 }}>Leave Balances</h1>
          <p style={{ color: "#6b7280", fontSize: 13, marginTop: 3 }}>Real-time leave balance summary</p>
        </div>

        {/* Filters (HR/Admin only) */}
        {user.role !== "employee" && (
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ position: "relative" }}>
              <Icon
                name="search"
                size={14}
                color="#9ca3af"
                style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}
              />
              <input
                className="form-input"
                placeholder="Search employee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: 32, width: 200 }}
              />
            </div>
            <select
              className="form-input"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              style={{ width: 160 }}
            >
              <option value="All">All Departments</option>
              {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Balance table */}
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              {LEAVE_TYPES.map((lt) => (
                <th key={lt.id} style={{ color: lt.color }}>{lt.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {empList.map((emp) => {
              const bal = balances[emp.id] || {};
              return (
                <tr key={emp.id} className="table-row">
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className="avatar" style={{ background: avatarColor(emp.id), width: 32, height: 32, fontSize: 11 }}>
                        {emp.avatar}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{emp.name}</div>
                        <div style={{ fontSize: 11, color: "#9ca3af", textTransform: "capitalize" }}>{emp.role}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: 13, color: "#6b7280" }}>{emp.dept}</td>

                  {LEAVE_TYPES.map((lt) => {
                    const b   = bal[lt.id] ?? 0;
                    const pct = Math.round((b / lt.annual) * 100);
                    return (
                      <td key={lt.id}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 60, flex: 1 }}>
                            <div className="progress-bar" style={{ height: 5 }}>
                              <div className="progress-fill" style={{ width: `${pct}%`, background: lt.color }} />
                            </div>
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 700, color: b < 3 ? "#ef4444" : "#374151", minWidth: 20 }}>
                            {b}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Balances;
