// ─────────────────────────────────────────────────────────────────────────────
// src/components/modules/employees/Employees.jsx
// Employee directory with Add + Edit + Delete (Admin/HR)
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { Icon, Modal } from "../../common";
import { DEPARTMENTS } from "../../../data/mockData";
import { avatarColor } from "../../../utils/helpers";

const EMPTY_FORM = { name: "", email: "", department: "Engineering", role: "employee", managerId: "" };

const Employees = ({ user, employees, addEmployee, editEmployee, deleteEmployee }) => {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [success, setSuccess] = useState("");

  // Add modal
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState(EMPTY_FORM);
  const [addErrors, setAddErrors] = useState({});

  // Edit modal
  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const canManage = user?.role === "admin" || user?.role === "hr";
  const isAdmin = user?.role === "admin";

  const empList = Array.isArray(employees) ? employees : [];
  const filtered = empList.filter(
    (e) =>
      (deptFilter === "All" || e.dept === deptFilter) &&
      e.name.toLowerCase().includes(search.toLowerCase())
  );

  // ── Flash message ─────────────────────────────────────────────────────────
  const flash = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  };

  // ── ADD ────────────────────────────────────────────────────────────────────
  const setA = (k, v) => setAddForm((f) => ({ ...f, [k]: v }));

  const validateAdd = () => {
    const e = {};
    if (!addForm.name.trim()) e.name = "Name is required";
    if (!addForm.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(addForm.email)) e.email = "Invalid email";
    else if (empList.find((emp) => emp.email === addForm.email)) e.email = "Email already exists";
    setAddErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = async () => {
    if (!validateAdd()) return;
    try {
      await addEmployee(addForm);
      flash("Employee added successfully!");
      setShowAdd(false);
      setAddForm(EMPTY_FORM);
      setAddErrors({});
    } catch (err) {
      setAddErrors({ submit: err.message });
    }
  };

  // ── EDIT ───────────────────────────────────────────────────────────────────
  const openEdit = (emp) => {
    setEditTarget(emp);
    setEditForm({
      name: emp.name,
      email: emp.email,
      department: emp.dept,
      role: emp.role,
      managerId: emp.managerId || "",
      password: "",
    });
    setEditErrors({});
  };

  const setE = (k, v) => setEditForm((f) => ({ ...f, [k]: v }));

  const validateEdit = () => {
    const e = {};
    if (!editForm.name.trim()) e.name = "Name is required";
    if (!editForm.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(editForm.email)) e.email = "Invalid email";
    else if (empList.find((emp) => emp.email === editForm.email && emp.id !== editTarget.id)) e.email = "Email already taken";
    if (editForm.password && editForm.password.length < 6) e.password = "Min 6 characters";
    setEditErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleEdit = async () => {
    if (!validateEdit()) return;
    setSaving(true);
    try {
      const payload = { ...editForm };
      if (!payload.password) delete payload.password; // don't send empty password
      await editEmployee(editTarget.id, payload);
      flash(`${editForm.name} updated successfully!`);
      setEditTarget(null);
    } catch (err) {
      setEditErrors({ submit: err.message });
    }
    setSaving(false);
  };

  // ── DELETE ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteEmployee(deleteTarget.id);
      flash(`${deleteTarget.name} has been deleted.`);
      setDeleteTarget(null);
    } catch (err) {
      alert(err.message || "Failed to delete employee");
    }
    setDeleting(false);
  };

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 800 }}>Employees</h1>
          <p style={{ color: "#6b7280", fontSize: 13, marginTop: 3 }}>
            {empList.length} employee{empList.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <Icon name="search" size={14} color="#9ca3af" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
            <input className="form-input" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 32, width: 200 }} />
          </div>
          <select className="form-input" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} style={{ width: 160 }}>
            <option value="All">All Departments</option>
            {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
          </select>
          {canManage && (
            <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
              <Icon name="plus" size={15} color="#fff" /> Add Employee
            </button>
          )}
        </div>
      </div>

      {/* Success banner */}
      {success && (
        <div style={{ background: "#d1fae5", border: "1px solid #6ee7b7", borderRadius: 12, padding: "14px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10, color: "#065f46", fontSize: 14, fontWeight: 600 }}>
          <Icon name="check" size={18} color="#10b981" /> {success}
        </div>
      )}

      {/* Card grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {filtered.map((emp) => {
          const isSelf = emp.id === user?.id;
          return (
            <div key={emp.id} className="card" style={{ padding: 20, position: "relative" }}>
              {/* Action buttons */}
              {canManage && (
                <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 6 }}>
                  {/* Edit button */}
                  <button
                    onClick={() => openEdit(emp)}
                    title="Edit employee"
                    style={{
                      width: 30, height: 30, borderRadius: 8,
                      border: "1px solid #e0e7ff", background: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#eef2ff"; e.currentTarget.style.borderColor = "#a5b4fc"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e0e7ff"; }}
                  >
                    <Icon name="edit" size={14} color="#4f46e5" />
                  </button>
                  {/* Delete button — Admin only, not self */}
                  {isAdmin && !isSelf && (
                    <button
                      onClick={() => setDeleteTarget(emp)}
                      title="Delete employee"
                      style={{
                        width: 30, height: 30, borderRadius: 8,
                        border: "1px solid #fee2e2", background: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.borderColor = "#fca5a5"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#fee2e2"; }}
                    >
                      <Icon name="delete" size={14} color="#ef4444" />
                    </button>
                  )}
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div className="avatar" style={{ background: avatarColor(emp.id), width: 48, height: 48, fontSize: 16 }}>
                  {emp.avatar}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", gap: 6 }}>
                    {emp.name}
                    {isSelf && <span style={{ fontSize: 10, background: "#eef2ff", color: "#4f46e5", padding: "1px 6px", borderRadius: 6, fontWeight: 600 }}>You</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{emp.email}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span className="tag" style={{ background: "#eef2ff", color: "#4f46e5" }}>{emp.dept}</span>
                <span className="tag" style={{
                  background: emp.role === "admin" ? "#fef3c7" : emp.role === "hr" ? "#d1fae5" : "#f3f4f6",
                  color: emp.role === "admin" ? "#92400e" : emp.role === "hr" ? "#065f46" : "#374151",
                  textTransform: "capitalize",
                }}>{emp.role}</span>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}>
          <Icon name="search" size={40} color="#d1d5db" />
          <p style={{ marginTop: 12, fontSize: 15, fontWeight: 600 }}>No employees found</p>
        </div>
      )}

      {/* ── ADD MODAL ──────────────────────────────────────────────────────── */}
      {showAdd && (
        <Modal title="Add New Employee" onClose={() => { setShowAdd(false); setAddErrors({}); }}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input className="form-input" placeholder="e.g. Rahul Verma" value={addForm.name} onChange={(e) => setA("name", e.target.value)} />
            {addErrors.name && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{addErrors.name}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input className="form-input" type="email" placeholder="e.g. rahul@company.com" value={addForm.email} onChange={(e) => setA("email", e.target.value)} />
            {addErrors.email && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{addErrors.email}</div>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Department *</label>
              <select className="form-input" value={addForm.department} onChange={(e) => setA("department", e.target.value)}>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Role *</label>
              <select className="form-input" value={addForm.role} onChange={(e) => setA("role", e.target.value)}>
                <option value="employee">Employee</option>
                <option value="hr">HR</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Manager (optional)</label>
            <select className="form-input" value={addForm.managerId} onChange={(e) => setA("managerId", e.target.value)}>
              <option value="">No Manager</option>
              {empList.filter((e) => e.role === "hr" || e.role === "admin").map((e) => (
                <option key={e.id} value={e.id}>{e.name} ({e.role})</option>
              ))}
            </select>
          </div>
          {addErrors.submit && <div style={{ color: "#ef4444", fontSize: 13, marginBottom: 10 }}>{addErrors.submit}</div>}
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button className="btn btn-primary" onClick={handleAdd}><Icon name="check" size={15} color="#fff" /> Add Employee</button>
            <button className="btn btn-ghost" onClick={() => { setShowAdd(false); setAddErrors({}); }}>Cancel</button>
          </div>
        </Modal>
      )}

      {/* ── EDIT MODAL ─────────────────────────────────────────────────────── */}
      {editTarget && (
        <Modal title={`Edit — ${editTarget.name}`} onClose={() => setEditTarget(null)}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input className="form-input" value={editForm.name} onChange={(e) => setE("name", e.target.value)} />
            {editErrors.name && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{editErrors.name}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input className="form-input" type="email" value={editForm.email} onChange={(e) => setE("email", e.target.value)} />
            {editErrors.email && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{editErrors.email}</div>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Department *</label>
              <select className="form-input" value={editForm.department} onChange={(e) => setE("department", e.target.value)}>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Role *</label>
              <select className="form-input" value={editForm.role} onChange={(e) => setE("role", e.target.value)}>
                <option value="employee">Employee</option>
                <option value="hr">HR</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Manager</label>
            <select className="form-input" value={editForm.managerId} onChange={(e) => setE("managerId", e.target.value)}>
              <option value="">No Manager</option>
              {empList.filter((e) => (e.role === "hr" || e.role === "admin") && e.id !== editTarget.id).map((e) => (
                <option key={e.id} value={e.id}>{e.name} ({e.role})</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">New Password <span style={{ color: "#9ca3af", fontWeight: 400 }}>(leave blank to keep current)</span></label>
            <input className="form-input" type="password" placeholder="••••••••" value={editForm.password} onChange={(e) => setE("password", e.target.value)} />
            {editErrors.password && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{editErrors.password}</div>}
          </div>
          {editErrors.submit && <div style={{ color: "#ef4444", fontSize: 13, marginBottom: 10 }}>{editErrors.submit}</div>}
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button className="btn btn-primary" onClick={handleEdit} disabled={saving} style={{ opacity: saving ? 0.6 : 1 }}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button className="btn btn-ghost" onClick={() => setEditTarget(null)}>Cancel</button>
          </div>
        </Modal>
      )}

      {/* ── DELETE MODAL ───────────────────────────────────────────────────── */}
      {deleteTarget && (
        <Modal title="Delete Employee" onClose={() => setDeleteTarget(null)}>
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <div style={{
              width: 60, height: 60, borderRadius: "50%", background: "#fef2f2",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <Icon name="delete" size={28} color="#ef4444" />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>Are you sure?</h3>
            <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 6 }}>
              You are about to delete <strong>{deleteTarget.name}</strong> ({deleteTarget.email}).
            </p>
            <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 20, fontWeight: 600 }}>
              This will permanently remove their account, leave balances, and leave history.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button className="btn" onClick={handleDelete} disabled={deleting}
                style={{ background: "#ef4444", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 10, fontWeight: 700, cursor: deleting ? "not-allowed" : "pointer", opacity: deleting ? 0.6 : 1 }}>
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
              <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Employees;
