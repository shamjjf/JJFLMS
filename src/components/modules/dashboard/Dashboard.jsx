// ─────────────────────────────────────────────────────────────────────────────
// src/components/modules/dashboard/Dashboard.jsx
// Main dashboard — stat cards, recent leave table, upcoming holidays widget,
// and leave balance mini-summary for employees.
// ─────────────────────────────────────────────────────────────────────────────

import { Icon, StatusBadge } from "../../common";
import { HOLIDAYS_DATA, LEAVE_TYPES } from "../../../data/mockData";
import { formatDate, getEmp, getLT, avatarColor } from "../../../utils/helpers";

const TODAY = "2025-03-26";

const Dashboard = ({ user, leaves, employees, balances }) => {
  const myLeaves    = leaves.filter((l) => l.empId === user.id);
  const pendingAll  = leaves.filter((l) => l.status === "pending");
  const onLeaveToday = leaves.filter(
    (l) => l.status === "approved" && l.startDate <= TODAY && l.endDate >= TODAY
  );
  const upcomingHolidays = HOLIDAYS_DATA.filter((h) => h.date >= TODAY).slice(0, 3);
  const myBalance  = balances[user.id] || {};
  const myPending  = myLeaves.filter((l) => l.status === "pending").length;
  const myApproved = myLeaves.filter((l) => l.status === "approved").length;

  const stats =
    user.role === "employee"
      ? [
          { label: "Total Applied",  value: myLeaves.length, icon: "leave",       color: "#4f46e5", bg: "#eef2ff" },
          { label: "Pending",        value: myPending,       icon: "clock",       color: "#f59e0b", bg: "#fef3c7" },
          { label: "Approved",       value: myApproved,      icon: "check",       color: "#10b981", bg: "#d1fae5" },
          { label: "CL Balance",     value: myBalance.CL||0, icon: "balance",     color: "#8b5cf6", bg: "#ede9fe" },
        ]
      : [
          { label: "Total Requests",    value: leaves.length,       icon: "leave",       color: "#4f46e5", bg: "#eef2ff" },
          { label: "Pending Approvals", value: pendingAll.length,   icon: "clock",       color: "#f59e0b", bg: "#fef3c7" },
          { label: "On Leave Today",    value: onLeaveToday.length, icon: "users",       color: "#ef4444", bg: "#fee2e2" },
          { label: "Total Employees",   value: employees.length,    icon: "trending_up", color: "#10b981", bg: "#d1fae5" },
        ];

  const recentLeaves = (user.role === "employee" ? myLeaves : leaves).slice(0, 5);

  return (
    <div className="fade-in">
      {/* Greeting */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "Syne", fontSize: 26, fontWeight: 800, color: "#1a1d2e" }}>
          Good morning, {user.name.split(" ")[0]} 👋
        </h1>
        <p style={{ color: "#6b7280", fontSize: 14, marginTop: 4 }}>
          Here's what's happening with leaves today.
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
        {stats.map((s, i) => (
          <div key={i} className="stat-card" style={{ borderLeftColor: s.color }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, background: s.bg, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={s.icon} size={18} color={s.color} />
              </div>
              <span style={{ fontSize: 28, fontWeight: 800, fontFamily: "Syne", color: "#1a1d2e" }}>{s.value}</span>
            </div>
            <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Content grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
        {/* Recent requests table */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, marginBottom: 18, color: "#1a1d2e" }}>
            {user.role === "employee" ? "My Recent Requests" : "Recent Leave Requests"}
          </h3>
          <table>
            <thead>
              <tr>
                {user.role !== "employee" && <th>Employee</th>}
                <th>Leave Type</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentLeaves.map((l) => {
                const emp = getEmp(l.empId, employees);
                const lt  = getLT(l.leaveType);
                return (
                  <tr key={l.id} className="table-row">
                    {user.role !== "employee" && (
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div className="avatar" style={{ background: avatarColor(l.empId), width: 30, height: 30, fontSize: 11 }}>
                            {emp?.avatar}
                          </div>
                          <span style={{ fontWeight: 600, fontSize: 13 }}>{emp?.name}</span>
                        </div>
                      </td>
                    )}
                    <td>
                      <span className="tag" style={{ background: lt?.color + "20", color: lt?.color }}>
                        {lt?.name}
                      </span>
                    </td>
                    <td style={{ color: "#6b7280", fontSize: 13 }}>
                      {formatDate(l.startDate)} — {formatDate(l.endDate)}
                    </td>
                    <td><StatusBadge status={l.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Right panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Upcoming holidays */}
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 15, marginBottom: 14 }}>
              Upcoming Holidays
            </h3>
            {upcomingHolidays.map((h) => (
              <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 40, textAlign: "center", background: "#fef3c7", borderRadius: 8, padding: "4px 0" }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#92400e" }}>{new Date(h.date).getDate()}</div>
                  <div style={{ fontSize: 9, color: "#b45309", fontWeight: 600 }}>
                    {new Date(h.date).toLocaleString("en", { month: "short" }).toUpperCase()}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1d2e" }}>{h.name}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>
                    {h.type === "public" ? "Public Holiday" : "Company Holiday"}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Leave balance mini (employee only) */}
          {user.role === "employee" && (
            <div className="card" style={{ padding: 20 }}>
              <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 15, marginBottom: 14 }}>My Leave Balance</h3>
              {LEAVE_TYPES.slice(0, 3).map((lt) => {
                const bal = myBalance[lt.id] || 0;
                const pct = Math.round((bal / lt.annual) * 100);
                return (
                  <div key={lt.id} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{lt.name}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: lt.color }}>{bal}/{lt.annual}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${pct}%`, background: lt.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
