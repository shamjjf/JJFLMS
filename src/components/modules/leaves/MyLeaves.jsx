// ─────────────────────────────────────────────────────────────────────────────
// src/components/modules/leaves/MyLeaves.jsx
// Displays the logged-in employee's leave history with status filter tabs.
// Allows cancellation of pending requests.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { StatusBadge } from "../../common";
import { formatDate, getLT, capitalize } from "../../../utils/helpers";

const STATUSES = ["all", "pending", "approved", "rejected", "cancelled"];

const MyLeaves = ({ user, leaves, cancelLeave }) => {
  const [filter, setFilter] = useState("all");

  const myLeaves = leaves.filter((l) => l.empId === user.id);
  const filtered =
    filter === "all" ? myLeaves : myLeaves.filter((l) => l.status === filter);

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 800 }}>My Leaves</h1>
          <p style={{ color: "#6b7280", fontSize: 13, marginTop: 3 }}>Track all your leave applications</p>
        </div>

        {/* Status filter tabs */}
        <div style={{ display: "flex", gap: 8 }}>
          {STATUSES.map((s) => (
            <button
              key={s}
              className={`btn btn-sm ${filter === s ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setFilter(s)}
            >
              {capitalize(s)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Leave Type</th>
              <th>From</th>
              <th>To</th>
              <th>Days</th>
              <th>Reason</th>
              <th>Applied On</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>
                  No leave requests found.
                </td>
              </tr>
            ) : (
              filtered.map((l) => {
                const lt = getLT(l.leaveType);
                return (
                  <tr key={l.id} className="table-row">
                    <td>
                      <span className="tag" style={{ background: lt?.color + "20", color: lt?.color }}>
                        {lt?.name}
                      </span>
                    </td>
                    <td style={{ fontSize: 13 }}>{formatDate(l.startDate)}</td>
                    <td style={{ fontSize: 13 }}>{formatDate(l.endDate)}</td>
                    <td style={{ fontWeight: 700, color: "#4f46e5" }}>{l.days}d</td>
                    <td style={{ fontSize: 12, color: "#6b7280", maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {l.reason}
                    </td>
                    <td style={{ fontSize: 12, color: "#9ca3af" }}>{formatDate(l.appliedOn)}</td>
                    <td><StatusBadge status={l.status} /></td>
                    <td>
                      {l.status === "pending" && (
                        <button className="btn btn-danger btn-sm" onClick={() => cancelLeave(l.id)}>
                          Cancel
                        </button>
                      )}
                      {l.status === "rejected" && l.comments && (
                        <span title={l.comments} style={{ fontSize: 12, color: "#9ca3af" }}>
                          💬 {l.comments.slice(0, 20)}…
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyLeaves;
