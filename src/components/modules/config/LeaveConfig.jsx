// ─────────────────────────────────────────────────────────────────────────────
// src/components/modules/config/LeaveConfig.jsx
// Leave type configuration with Add Leave Type modal (Admin only)
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { Icon, Modal } from "../../common";

const POLICY_FIELDS = [
  { key: "annual",       label: "Annual Limit",  format: (v) => `${v} days` },
  { key: "carryForward", label: "Carry Forward", format: (v) => `${v} days` },
  { key: "_approval",    label: "Approval",      format: ()  => "HR Manager" },
  { key: "_status",      label: "Status",        format: ()  => "Active" },
];

const COLOR_OPTIONS = [
  { value: "#6366f1", label: "Indigo" },
  { value: "#f59e0b", label: "Amber" },
  { value: "#10b981", label: "Green" },
  { value: "#ec4899", label: "Pink" },
  { value: "#8b5cf6", label: "Purple" },
  { value: "#06b6d4", label: "Cyan" },
  { value: "#ef4444", label: "Red" },
  { value: "#14b8a6", label: "Teal" },
];

const EMPTY_FORM = { code: "", name: "", color: "#6366f1", annualLimit: "", carryForward: "0" };

const LeaveConfig = ({ user, leaveTypes, addLeaveType }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const canManage = user?.role === "admin";
  const types = leaveTypes || [];

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.code.trim()) e.code = "Code is required (e.g. CL, SL)";
    else if (form.code.length > 10) e.code = "Code must be max 10 characters";
    else if (types.find((t) => t.id === form.code.toUpperCase())) e.code = "This code already exists";
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.annualLimit || parseInt(form.annualLimit) < 1) e.annualLimit = "Annual limit must be at least 1";
    if (form.carryForward && parseInt(form.carryForward) < 0) e.carryForward = "Cannot be negative";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = async () => {
    if (!validate()) return;
    try {
      await addLeaveType({
        code: form.code.toUpperCase(),
        name: form.name,
        color: form.color,
        annualLimit: parseInt(form.annualLimit),
        carryForward: parseInt(form.carryForward) || 0,
      });
      setSuccess(true);
      setShowAdd(false);
      setForm(EMPTY_FORM);
      setErrors({});
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setErrors({ submit: err.message || "Failed to add leave type" });
    }
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 800 }}>Leave Configuration</h1>
          <p style={{ color: "#6b7280", fontSize: 13, marginTop: 3 }}>Configure leave types and policies</p>
        </div>
        {canManage && (
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
            <Icon name="plus" size={15} color="#fff" /> Add Leave Type
          </button>
        )}
      </div>

      {/* Success banner */}
      {success && (
        <div style={{ background: "#d1fae5", border: "1px solid #6ee7b7", borderRadius: 12, padding: "14px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10, color: "#065f46", fontSize: 14, fontWeight: 600 }}>
          <Icon name="check" size={18} color="#10b981" />
          Leave type added successfully! Balances created for all employees.
        </div>
      )}

      {/* Config cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: 16 }}>
        {types.map((lt) => (
          <div key={lt.id} className="card" style={{ padding: 22, borderTop: `4px solid ${lt.color}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <span className="tag" style={{ background: lt.color + "20", color: lt.color, fontSize: 13, marginBottom: 6, display: "inline-block" }}>
                  {lt.id}
                </span>
                <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16 }}>{lt.name}</h3>
              </div>
              {canManage && (
                <button className="btn btn-ghost btn-sm">
                  <Icon name="edit" size={13} />
                </button>
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {POLICY_FIELDS.map(({ key, label, format }) => (
                <div key={key} style={{ background: "#f9fafb", borderRadius: 8, padding: "8px 12px" }}>
                  <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600 }}>{label.toUpperCase()}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1d2e", marginTop: 2 }}>
                    {format(lt[key])}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Leave Type Modal */}
      {showAdd && (
        <Modal title="Add New Leave Type" onClose={() => { setShowAdd(false); setErrors({}); }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Code *</label>
              <input className="form-input" placeholder="e.g. WFH" value={form.code} onChange={(e) => set("code", e.target.value.toUpperCase())} maxLength={10} style={{ textTransform: "uppercase" }} />
              {errors.code && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.code}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Name *</label>
              <input className="form-input" placeholder="e.g. Work From Home" value={form.name} onChange={(e) => set("name", e.target.value)} />
              {errors.name && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.name}</div>}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Annual Limit (days) *</label>
              <input className="form-input" type="number" min="1" placeholder="e.g. 12" value={form.annualLimit} onChange={(e) => set("annualLimit", e.target.value)} />
              {errors.annualLimit && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.annualLimit}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Carry Forward (days)</label>
              <input className="form-input" type="number" min="0" placeholder="0" value={form.carryForward} onChange={(e) => set("carryForward", e.target.value)} />
              {errors.carryForward && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.carryForward}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Color</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
                {COLOR_OPTIONS.map((c) => (
                  <div
                    key={c.value}
                    onClick={() => set("color", c.value)}
                    title={c.label}
                    style={{
                      width: 28, height: 28,
                      background: c.value,
                      borderRadius: 8,
                      cursor: "pointer",
                      border: form.color === c.value ? "3px solid #1a1d2e" : "3px solid transparent",
                      transition: "all 0.15s",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          {form.code && form.name && (
            <div style={{ background: "#f9fafb", borderRadius: 10, padding: "12px 16px", marginBottom: 14, borderLeft: `4px solid ${form.color}` }}>
              <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, marginBottom: 4 }}>PREVIEW</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="tag" style={{ background: form.color + "20", color: form.color }}>{form.code}</span>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{form.name}</span>
                <span style={{ fontSize: 12, color: "#6b7280" }}>— {form.annualLimit || "?"} days/year</span>
              </div>
            </div>
          )}

          {errors.submit && <div style={{ color: "#ef4444", fontSize: 13, marginBottom: 10 }}>{errors.submit}</div>}

          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button className="btn btn-primary" onClick={handleAdd}>
              <Icon name="check" size={15} color="#fff" /> Add Leave Type
            </button>
            <button className="btn btn-ghost" onClick={() => { setShowAdd(false); setErrors({}); }}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default LeaveConfig;
