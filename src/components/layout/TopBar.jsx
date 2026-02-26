// ─────────────────────────────────────────────────────────────────────────────
// src/components/layout/TopBar.jsx
// Sticky top navigation bar — sidebar toggle, notifications bell, user menu.
// ─────────────────────────────────────────────────────────────────────────────

import { Icon } from "../common";
import { avatarColor } from "../../utils/helpers";

const TopBar = ({ user, pendingCount, onToggleSidebar, onNavigate, onLogout }) => (
  <div
    style={{
      background: "#fff",
      borderBottom: "1px solid #f0f2f5",
      padding: "0 24px",
      height: 60,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}
  >
    {/* Sidebar toggle */}
    <button className="btn btn-ghost btn-sm" style={{ padding: 8 }} onClick={onToggleSidebar}>
      <Icon name="menu" size={18} />
    </button>

    {/* Right controls */}
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {/* Pending approvals bell (HR / Admin only) */}
      {(user.role === "admin" || user.role === "hr") && pendingCount > 0 && (
        <button
          className="btn btn-ghost btn-sm"
          style={{ position: "relative", padding: 8 }}
          onClick={() => onNavigate("approvals")}
        >
          <Icon name="bell" size={18} />
          <span className="notification-dot" />
        </button>
      )}

      {/* User chip — click to logout */}
      <div
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "6px 12px", background: "#f9fafb",
          borderRadius: 10, cursor: "pointer",
        }}
        onClick={onLogout}
      >
        <div
          className="avatar"
          style={{ background: avatarColor(user.id), width: 28, height: 28, fontSize: 10 }}
        >
          {user.avatar}
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
          {user.name.split(" ")[0]}
        </span>
        <Icon name="logout" size={14} color="#9ca3af" />
      </div>
    </div>
  </div>
);

export default TopBar;
