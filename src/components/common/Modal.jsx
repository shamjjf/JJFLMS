// ─────────────────────────────────────────────────────────────────────────────
// src/components/common/Modal.jsx
// Reusable animated modal overlay with a title bar and close button.
// Clicking the overlay backdrop also closes the modal.
// ─────────────────────────────────────────────────────────────────────────────

import Icon from "./Icon";

/**
 * @param {string}   title   - Modal heading text
 * @param {function} onClose - Called when the modal should be dismissed
 * @param {ReactNode} children
 */
const Modal = ({ title, onClose, children }) => (
  <div
    className="modal-overlay"
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div className="modal-box">
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontFamily: "Syne", fontSize: 20, fontWeight: 700 }}>
          {title}
        </h2>
        <button
          className="btn btn-ghost btn-sm"
          onClick={onClose}
          style={{ padding: 6 }}
        >
          <Icon name="x" size={16} />
        </button>
      </div>

      {/* Body */}
      {children}
    </div>
  </div>
);

export default Modal;
