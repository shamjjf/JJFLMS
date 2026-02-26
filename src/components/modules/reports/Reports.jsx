// ─────────────────────────────────────────────────────────────────────────────
// src/components/modules/reports/Reports.jsx
// Three report views: Employee-wise, Department-wise, Monthly Trend chart.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { Icon } from "../../common";
import { DEPARTMENTS } from "../../../data/mockData";
import { avatarColor } from "../../../utils/helpers";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May"];

const Reports = ({ leaves, employees, balances }) => {
  const [reportType, setReportType] = useState("employee");
  const [deptFilter, setDeptFilter] = useState("All");

  // ── Employee report data ─────────────────────────────────────────────────────
  const empReport = employees
    .map((emp) => {
      const empLeaves = leaves.filter((l) => l.empId === emp.id);
      const bal = balances[emp.id] || {};
      return {
        ...emp,
        total:     empLeaves.length,
        approved:  empLeaves.filter((l) => l.status === "approved").length,
        pending:   empLeaves.filter((l) => l.status === "pending").length,
        rejected:  empLeaves.filter((l) => l.status === "rejected").length,
        totalDays: empLeaves.filter((l) => l.status === "approved").reduce((s, l) => s + l.days, 0),
        balanceCL: bal.CL || 0,
        balanceSL: bal.SL || 0,
        balanceEL: bal.EL || 0,
      };
    })
    .filter((e) => deptFilter === "All" || e.dept === deptFilter);

  // ── Department report data ───────────────────────────────────────────────────
  const deptReport = DEPARTMENTS.map((dept) => {
    const emps       = employees.filter((e) => e.dept === dept);
    const deptLeaves = leaves.filter((l) => emps.find((e) => e.id === l.empId));
    return {
      dept,
      headcount: emps.length,
      total:     deptLeaves.length,
      approved:  deptLeaves.filter((l) => l.status === "approved").length,
      pending:   deptLeaves.filter((l) => l.status === "pending").length,
      totalDays: deptLeaves.filter((l) => l.status === "approved").reduce((s, l) => s + l.days, 0),
    };
  });

  // ── Monthly trend data ───────────────────────────────────────────────────────
  const monthlyData = MONTHS.map((m, i) => ({
    month: m,
    count: leaves.filter((l) => new Date(l.appliedOn).getMonth() === i).length,
  }));
  const maxCount = Math.max(...monthlyData.map((m) => m.count), 1);

  const totalApproved = leaves.filter((l) => l.status === "approved").length;
  const approvalRate  = Math.round((totalApproved / leaves.length) * 100);
  const avgDays       = (leaves.reduce((s, l) => s + l.days, 0) / leaves.length).toFixed(1);

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 800 }}>Reports</h1>
          <p style={{ color: "#6b7280", fontSize: 13, marginTop: 3 }}>Analytics and leave summaries</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[["employee", "Employee Report"], ["department", "Department Summary"], ["trend", "Monthly Trend"]].map(([id, label]) => (
            <button key={id} className={`btn btn-sm ${reportType === id ? "btn-primary" : "btn-ghost"}`} onClick={() => setReportType(id)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Employee Report ── */}
      {reportType === "employee" && (
        <div>
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <select className="form-input" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} style={{ width: 180 }}>
              <option value="All">All Departments</option>
              {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>
            <button className="btn btn-ghost btn-sm">
              <Icon name="download" size={14} /> Export CSV
            </button>
          </div>
          <div className="card">
            <table>
              <thead>
                <tr>
                  <th>Employee</th><th>Dept</th><th>Total</th>
                  <th>Approved</th><th>Pending</th><th>Rejected</th>
                  <th>Days Taken</th><th>CL Bal</th><th>SL Bal</th><th>EL Bal</th>
                </tr>
              </thead>
              <tbody>
                {empReport.map((e) => (
                  <tr key={e.id} className="table-row">
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div className="avatar" style={{ background: avatarColor(e.id), width: 28, height: 28, fontSize: 10 }}>{e.avatar}</div>
                        <span style={{ fontWeight: 600, fontSize: 13 }}>{e.name}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: 12, color: "#6b7280" }}>{e.dept}</td>
                    <td style={{ fontWeight: 600 }}>{e.total}</td>
                    <td><span style={{ color: "#10b981", fontWeight: 700 }}>{e.approved}</span></td>
                    <td><span style={{ color: "#f59e0b", fontWeight: 700 }}>{e.pending}</span></td>
                    <td><span style={{ color: "#ef4444", fontWeight: 700 }}>{e.rejected}</span></td>
                    <td style={{ fontWeight: 700, color: "#4f46e5" }}>{e.totalDays}d</td>
                    <td>{e.balanceCL}</td>
                    <td>{e.balanceSL}</td>
                    <td>{e.balanceEL}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Department Report ── */}
      {reportType === "department" && (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Department</th><th>Headcount</th><th>Total Requests</th>
                <th>Approved</th><th>Pending</th><th>Total Days</th><th>Avg Days/Person</th>
              </tr>
            </thead>
            <tbody>
              {deptReport.map((d) => (
                <tr key={d.dept} className="table-row">
                  <td style={{ fontWeight: 600 }}>{d.dept}</td>
                  <td>{d.headcount}</td>
                  <td style={{ fontWeight: 600 }}>{d.total}</td>
                  <td><span style={{ color: "#10b981", fontWeight: 700 }}>{d.approved}</span></td>
                  <td><span style={{ color: "#f59e0b", fontWeight: 700 }}>{d.pending}</span></td>
                  <td style={{ fontWeight: 700, color: "#4f46e5" }}>{d.totalDays}d</td>
                  <td style={{ color: "#6b7280" }}>{d.headcount ? (d.totalDays / d.headcount).toFixed(1) : 0}d</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Monthly Trend ── */}
      {reportType === "trend" && (
        <div className="card" style={{ padding: 28 }}>
          <h3 style={{ fontFamily: "Syne", fontWeight: 700, marginBottom: 24 }}>Monthly Leave Trend (2025)</h3>

          {/* Bar chart */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 200 }}>
            {monthlyData.map((m, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#4f46e5" }}>{m.count}</span>
                <div style={{ width: "100%", background: "linear-gradient(180deg,#4f46e5,#7c3aed)", borderRadius: "6px 6px 0 0", height: `${(m.count / maxCount) * 160}px`, minHeight: 4, transition: "height 0.6s ease" }} />
                <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>{m.month}</span>
              </div>
            ))}
          </div>

          {/* Summary stats */}
          <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            {[
              { label: "Total Requests",   value: leaves.length, color: "#4f46e5" },
              { label: "Approval Rate",    value: `${approvalRate}%`, color: "#10b981" },
              { label: "Avg Days/Request", value: avgDays,        color: "#f59e0b" },
            ].map((s, i) => (
              <div key={i} style={{ background: "#f9fafb", borderRadius: 12, padding: "14px 18px" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: "Syne" }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
