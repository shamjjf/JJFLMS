// ─────────────────────────────────────────────────────────────────────────────
// src/components/modules/leaves/ApplyLeave.jsx
// Leave application form with:
//   - Balance selection cards
//   - Date range picker
//   - Real-time balance & day calculation
//   - Validation: balance check, overlap check, required fields
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { Icon } from "../../common";
import { LEAVE_TYPES } from "../../../data/mockData";
import { daysBetween } from "../../../utils/helpers";

const EMPTY_FORM = { leaveType: "CL", startDate: "", endDate: "", reason: "" };

const ApplyLeave = ({ user, leaves, balances, submitLeave }) => {
  const [form,    setForm]    = useState(EMPTY_FORM);
  const [errors,  setErrors]  = useState({});
  const [success, setSuccess] = useState(false);

  const myBalance      = balances[user.id] || {};
  const days           = form.startDate && form.endDate ? daysBetween(form.startDate, form.endDate) : 0;
  const currentBalance = myBalance[form.leaveType] || 0;

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  // ── Validation ────────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.startDate) e.startDate = "Start date is required";
    if (!form.endDate)   e.endDate   = "End date is required";
    if (form.startDate && form.endDate && form.endDate < form.startDate)
      e.endDate = "End date must be after start date";
    if (!form.reason.trim()) e.reason = "Reason is required";
    if (days > currentBalance)
      e.days = `Insufficient balance. Available: ${currentBalance} days`;

    const overlap = leaves.find(
      (l) =>
        l.empId === user.id &&
        l.status !== "cancelled" &&
        l.status !== "rejected" &&
        !(form.endDate < l.startDate || form.startDate > l.endDate)
    );
    if (overlap) e.overlap = "You already have a leave request for this period";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    if (!validate()) return;
    submitLeave(form);
    setSuccess(true);
    setForm(EMPTY_FORM);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="fade-in" style={{ maxWidth: 680 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 800 }}>Apply for Leave</h1>
        <p style={{ color: "#6b7280", fontSize: 13, marginTop: 3 }}>Submit a new leave application</p>
      </div>

      {/* Success banner */}
      {success && (
        <div style={{ background: "#d1fae5", border: "1px solid #6ee7b7", borderRadius: 12, padding: "14px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10, color: "#065f46", fontSize: 14, fontWeight: 600 }}>
          <Icon name="check" size={18} color="#10b981" />
          Leave application submitted successfully! It is pending approval.
        </div>
      )}

      {/* Balance selector cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 24 }}>
        {LEAVE_TYPES.map((lt) => {
          const isActive = form.leaveType === lt.id;
          return (
            <div
              key={lt.id}
              onClick={() => set("leaveType", lt.id)}
              style={{
                background: isActive ? lt.color : "#fff",
                borderRadius: 12,
                padding: "12px 10px",
                textAlign: "center",
                cursor: "pointer",
                border: `2px solid ${isActive ? lt.color : "#e5e7eb"}`,
                transition: "all 0.2s",
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 800, color: isActive ? "#fff" : lt.color }}>
                {myBalance[lt.id] ?? "-"}
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, color: isActive ? "rgba(255,255,255,0.85)" : "#6b7280", marginTop: 2, lineHeight: 1.3 }}>
                {lt.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Form card */}
      <div className="card" style={{ padding: 28 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          {/* Leave Type select */}
          <div className="form-group" style={{ gridColumn: "1/-1" }}>
            <label className="form-label">Leave Type</label>
            <select className="form-input" value={form.leaveType} onChange={(e) => set("leaveType", e.target.value)}>
              {LEAVE_TYPES.map((lt) => (
                <option key={lt.id} value={lt.id}>
                  {lt.name} (Balance: {myBalance[lt.id] || 0} days)
                </option>
              ))}
            </select>
          </div>

          {/* Start date */}
          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input type="date" className="form-input" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} />
            {errors.startDate && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.startDate}</div>}
          </div>

          {/* End date */}
          <div className="form-group">
            <label className="form-label">End Date</label>
            <input type="date" className="form-input" value={form.endDate} onChange={(e) => set("endDate", e.target.value)} />
            {errors.endDate && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.endDate}</div>}
          </div>

          {/* Day count info banner */}
          {days > 0 && (
            <div style={{ gridColumn: "1/-1", background: "#eef2ff", borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
              <Icon name="info" size={16} color="#4f46e5" />
              <span style={{ fontSize: 13, color: "#4f46e5", fontWeight: 600 }}>
                Total: <strong>{days} day{days > 1 ? "s" : ""}</strong> &nbsp;|&nbsp;
                Available Balance: <strong>{currentBalance} days</strong>
                {days > currentBalance && <span style={{ color: "#ef4444" }}> — Insufficient!</span>}
              </span>
            </div>
          )}

          {errors.days    && <div style={{ gridColumn: "1/-1", color: "#ef4444", fontSize: 12 }}>{errors.days}</div>}
          {errors.overlap && <div style={{ gridColumn: "1/-1", color: "#ef4444", fontSize: 12 }}>{errors.overlap}</div>}

          {/* Reason */}
          <div className="form-group" style={{ gridColumn: "1/-1" }}>
            <label className="form-label">Reason</label>
            <textarea
              className="form-input"
              rows={4}
              placeholder="Please describe the reason for your leave..."
              value={form.reason}
              onChange={(e) => set("reason", e.target.value)}
              style={{ resize: "vertical" }}
            />
            {errors.reason && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.reason}</div>}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button className="btn btn-primary" onClick={handleSubmit}>
            <Icon name="check" size={15} color="#fff" /> Submit Application
          </button>
          <button className="btn btn-ghost" onClick={() => { setForm(EMPTY_FORM); setErrors({}); }}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;
