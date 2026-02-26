// ─────────────────────────────────────────────────────────────────────────────
// src/components/common/StatusBadge.jsx
// Colored pill badge showing leave request status with an indicator dot.
// ─────────────────────────────────────────────────────────────────────────────

import { STATUS_STYLE } from "../../data/mockData";
import { capitalize } from "../../utils/helpers";

/**
 * @param {string} status - "pending" | "approved" | "rejected" | "cancelled"
 */
const StatusBadge = ({ status }) => {
  const s = STATUS_STYLE[status] || STATUS_STYLE.pending;

  return (
    <span className="badge" style={{ background: s.bg, color: s.color }}>
      <span className="badge-dot" style={{ background: s.dot }} />
      {capitalize(status)}
    </span>
  );
};

export default StatusBadge;
