// ─────────────────────────────────────────────────────────────────────────────
// src/components/layout/Sidebar.jsx
// Left navigation sidebar with logo, role-filtered nav items, and user card.
// ─────────────────────────────────────────────────────────────────────────────

import { Icon } from "../common";
import { avatarColor } from "../../utils/helpers";

const NAV_ITEMS = [
  { id: "dashboard",   label: "Dashboard",       icon: "dashboard", roles: ["admin", "hr", "employee"] },
  { id: "my-leaves",   label: "My Leaves",        icon: "leave",     roles: ["employee", "hr"]          },
  { id: "apply-leave", label: "Apply Leave",      icon: "plus",      roles: ["employee", "hr"]          },
  { id: "approvals",   label: "Approvals",        icon: "approval",  roles: ["admin", "hr"]             },
  { id: "balances",    label: "Leave Balances",   icon: "balance",   roles: ["admin", "hr", "employee"] },
  { id: "calendar",    label: "Holiday Calendar", icon: "calendar",  roles: ["admin", "hr", "employee"] },
  { id: "reports",     label: "Reports",          icon: "report",    roles: ["admin", "hr"]             },
  { id: "employees",   label: "Employees",        icon: "users",     roles: ["admin", "hr"]             },
  { id: "leave-config",label: "Leave Config",     icon: "settings",  roles: ["admin"]                   },
];

const Sidebar = ({ user, activeTab, setActiveTab, sidebarOpen }) => {
  const visibleItems = NAV_ITEMS.filter((n) => n.roles.includes(user.role));

  return (
    <div
      style={{
        width: 240,
        background: "#fff",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        display: "flex",
        flexDirection: "column",
        boxShadow: "2px 0 20px rgba(0,0,0,0.06)",
        zIndex: 100,
        transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.25s ease",
      }}
    >
      {/* ── Logo ── */}
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #f0f2f5" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36, height: 36,
              background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
              borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Icon name="leave" size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 15, color: "#1a1d2e", lineHeight: 1.1 }}>
              LeaveFlow
            </div>
            <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 500 }}>
              Management System
            </div>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav style={{ flex: 1, padding: "12px", overflowY: "auto" }}>
        <div
          style={{
            fontSize: 10, fontWeight: 700, color: "#9ca3af",
            letterSpacing: "0.08em", padding: "8px 4px 4px",
            textTransform: "uppercase",
          }}
        >
          Menu
        </div>

        {visibleItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-link ${activeTab === item.id ? "active" : ""}`}
            onClick={() => setActiveTab(item.id)}
          >
            <Icon
              name={item.icon}
              size={17}
              color={activeTab === item.id ? "#4f46e5" : "#9ca3af"}
            />
            {item.label}
          </button>
        ))}
      </nav>

      {/* ── User card ── */}
      <div style={{ padding: "16px", borderTop: "1px solid #f0f2f5" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="avatar" style={{ background: avatarColor(user.id) }}>
            {user.avatar}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 13, fontWeight: 700, color: "#1a1d2e",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}
            >
              {user.name}
            </div>
            <div style={{ fontSize: 11, color: "#9ca3af", textTransform: "capitalize" }}>
              {user.role}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
