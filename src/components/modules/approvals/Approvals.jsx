// ─────────────────────────────────────────────────────────────────────────────
// src/components/modules/approvals/Approvals.jsx
// HR/Admin approval queue — lists all requests, opens a review modal
// for pending ones, and calls reviewLeave() to approve or reject.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { Icon, Modal, StatusBadge } from "../../common";
import { formatDate, getEmp, getLT, avatarColor, capitalize } from "../../../utils/helpers";

const FILTER_TABS = ["pending", "all", "approved", "rejected"];

const Approvals = ({ user, leaves, employees, balances, reviewLeave }) => {
  const [selected,     setSelected]     = useState(null);
  const [comment,      setComment]      = useState("");
  const [filterStatus, setFilterStatus] = useState("pending");

  const filtered = leaves.filter((l) =>
    filterStatus === "all" ? true : l.status === filterStatus
  );

  const pendingCount = leaves.filter((l) => l.status === "pending").length;

  const handleAction = (action) => {
    if (!selected) return;
    reviewLeave(selected.id, action, comment, user.id);
    setSelected(null);
    setComment("");
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 800 }}>Leave Approvals</h1>
          <p style={{ color: "#6b7280", fontSize: 13, marginTop: 3 }}>Review and manage leave requests</p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8 }}>
          {FILTER_TABS.map((s) => (
            <button
              key={s}
              className={`btn btn-sm ${filterStatus === s ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setFilterStatus(s)}
            >
              {capitalize(s)}
              {s === "pending" && pendingCount > 0 && (
                <span style={{ background: "#ef4444", color: "#fff", borderRadius: 10, padding: "1px 6px", fontSize: 11 }}>
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Dept</th>
              <th>Leave Type</th>
              <th>Duration</th>
              <th>Days</th>
              <th>Applied</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>
                  No requests found.
                </td>
              </tr>
            ) : (
              filtered.map((l) => {
                const emp = getEmp(l.empId, employees);
                const lt  = getLT(l.leaveType);
                return (
                  <tr key={l.id} className="table-row">
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div className="avatar" style={{ background: avatarColor(l.empId), width: 32, height: 32, fontSize: 11 }}>
                          {emp?.avatar}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{emp?.name}</div>
                          <div style={{ fontSize: 11, color: "#9ca3af" }}>{emp?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 12, color: "#6b7280" }}>{emp?.dept}</td>
                    <td>
                      <span className="tag" style={{ background: lt?.color + "20", color: lt?.color }}>
                        {lt?.name}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: "#374151" }}>
                      {formatDate(l.startDate)} — {formatDate(l.endDate)}
                    </td>
                    <td style={{ fontWeight: 700, color: "#4f46e5" }}>{l.days}d</td>
                    <td style={{ fontSize: 12, color: "#9ca3af" }}>{formatDate(l.appliedOn)}</td>
                    <td><StatusBadge status={l.status} /></td>
                    <td>
                      {l.status === "pending" ? (
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => { setSelected(l); setComment(""); }}
                        >
                          <Icon name="eye" size={13} /> Review
                        </button>
                      ) : (
                        <span style={{ fontSize: 12, color: "#9ca3af" }}>
                          {l.comments ? `💬 ${l.comments.slice(0, 20)}…` : "—"}
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

      {/* Review modal */}
      {selected && (() => {
        const emp = getEmp(selected.empId, employees);
        const lt  = getLT(selected.leaveType);
        const bal = (balances[selected.empId] || {})[selected.leaveType] || 0;

        return (
          <Modal title="Review Leave Request" onClose={() => setSelected(null)}>
            {/* Employee header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, padding: "14px 16px", background: "#f9fafb", borderRadius: 12 }}>
              <div className="avatar" style={{ background: avatarColor(selected.empId), width: 44, height: 44, fontSize: 14 }}>
                {emp?.avatar}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{emp?.name}</div>
                <div style={{ fontSize: 13, color: "#6b7280" }}>{emp?.dept} · {emp?.email}</div>
              </div>
            </div>

            {/* Detail grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
              {[
                ["Leave Type",      <span className="tag" style={{ background: lt?.color + "20", color: lt?.color }}>{lt?.name}</span>],
                ["Duration",        `${formatDate(selected.startDate)} — ${formatDate(selected.endDate)}`],
                ["Days Requested",  <strong style={{ color: "#4f46e5" }}>{selected.days} days</strong>],
                ["Current Balance", <strong style={{ color: bal >= selected.days ? "#10b981" : "#ef4444" }}>{bal} days</strong>],
                ["Applied On",      formatDate(selected.appliedOn)],
                ["Status",          <StatusBadge status={selected.status} />],
              ].map(([k, v], i) => (
                <div key={i} style={{ background: "#f9fafb", borderRadius: 8, padding: "10px 14px" }}>
                  <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, marginBottom: 4 }}>{k}</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Reason */}
            <div style={{ background: "#f9fafb", borderRadius: 10, padding: "12px 14px", marginBottom: 18 }}>
              <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, marginBottom: 5 }}>REASON</div>
              <div style={{ fontSize: 13, color: "#374151" }}>{selected.reason}</div>
            </div>

            {/* Comment */}
            <div className="form-group">
              <label className="form-label">Comments (optional)</label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="Add a note..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-success" style={{ flex: 1 }} onClick={() => handleAction("approved")}>
                <Icon name="check" size={15} color="#fff" /> Approve
              </button>
              <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => handleAction("rejected")}>
                <Icon name="x" size={15} color="#fff" /> Reject
              </button>
              <button className="btn btn-ghost" onClick={() => setSelected(null)}>Cancel</button>
            </div>
          </Modal>
        );
      })()}
    </div>
  );
};

export default Approvals;
