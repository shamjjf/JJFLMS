// ─────────────────────────────────────────────────────────────────────────────
// src/styles/GlobalStyles.jsx
// Injects global CSS into the document via a <style> tag.
// Includes resets, design tokens, utility classes, and component-level styles.
// ─────────────────────────────────────────────────────────────────────────────

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Syne:wght@400;500;600;700;800&display=swap');

    /* ── Reset ─────────────────────────────────────── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #f0f2f5; color: #1a1d2e; }
    input, select, textarea { font-family: 'Plus Jakarta Sans', sans-serif; }
    button { cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; }
    table { border-collapse: collapse; width: 100%; }
    th, td { text-align: left; }

    /* ── Scrollbar ──────────────────────────────────── */
    ::-webkit-scrollbar { width: 5px; height: 5px; }
    ::-webkit-scrollbar-track { background: #f0f2f5; }
    ::-webkit-scrollbar-thumb { background: #c7cdd8; border-radius: 10px; }

    /* ── Animations ─────────────────────────────────── */
    .fade-in { animation: fadeIn 0.3s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

    .slide-in { animation: slideIn 0.25s ease; }
    @keyframes slideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }

    .pulse { animation: pulse 2s infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

    /* ── Modal ──────────────────────────────────────── */
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(10, 12, 30, 0.55);
      backdrop-filter: blur(4px); display: flex; align-items: center;
      justify-content: center; z-index: 1000;
      animation: fadeOverlay 0.2s ease;
    }
    @keyframes fadeOverlay { from { opacity: 0; } to { opacity: 1; } }

    .modal-box {
      background: #fff; border-radius: 20px; padding: 32px;
      width: 520px; max-width: 95vw; max-height: 90vh; overflow-y: auto;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
      animation: modalPop 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes modalPop { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }

    /* ── Buttons ─────────────────────────────────────── */
    .btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 9px 18px; border-radius: 10px; font-size: 13.5px;
      font-weight: 600; border: none; transition: all 0.18s ease;
    }
    .btn:hover  { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12); }
    .btn:active { transform: translateY(0); }

    .btn-primary { background: #4f46e5; color: #fff; }
    .btn-primary:hover { background: #4338ca; }
    .btn-success { background: #10b981; color: #fff; }
    .btn-success:hover { background: #059669; }
    .btn-danger  { background: #ef4444; color: #fff; }
    .btn-danger:hover  { background: #dc2626; }
    .btn-ghost   { background: #f3f4f6; color: #374151; }
    .btn-ghost:hover   { background: #e5e7eb; }
    .btn-sm { padding: 6px 12px; font-size: 12px; }

    /* ── Form elements ───────────────────────────────── */
    .form-group { margin-bottom: 18px; }

    .form-label {
      display: block; font-size: 13px; font-weight: 600;
      color: #374151; margin-bottom: 6px;
    }

    .form-input {
      width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb;
      border-radius: 10px; font-size: 14px; color: #1a1d2e;
      transition: border-color 0.2s; outline: none; background: #fafafa;
    }
    .form-input:focus {
      border-color: #4f46e5; background: #fff;
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.08);
    }
    .form-input::placeholder { color: #9ca3af; }

    select.form-input {
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 14px center;
      padding-right: 36px;
    }

    /* ── Card ────────────────────────────────────────── */
    .card {
      background: #fff; border-radius: 16px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 4px 16px rgba(0, 0, 0, 0.04);
    }

    /* ── Badge ───────────────────────────────────────── */
    .badge {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 4px 10px; border-radius: 20px; font-size: 11.5px; font-weight: 600;
    }
    .badge-dot { width: 6px; height: 6px; border-radius: 50%; }

    /* ── Table ───────────────────────────────────────── */
    .table-row { transition: background 0.15s; }
    .table-row:hover { background: #f9fafb; }

    th {
      font-size: 11.5px; font-weight: 700; color: #6b7280;
      text-transform: uppercase; letter-spacing: 0.05em;
      padding: 10px 16px; border-bottom: 1.5px solid #f0f2f5;
    }
    td {
      padding: 13px 16px; font-size: 13.5px;
      border-bottom: 1px solid #f9fafb; vertical-align: middle;
    }

    /* ── Sidebar navigation ──────────────────────────── */
    .sidebar-link {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 16px; border-radius: 12px; font-size: 13.5px;
      font-weight: 500; color: #6b7280; cursor: pointer;
      transition: all 0.18s; text-decoration: none; border: none;
      background: none; width: 100%;
    }
    .sidebar-link:hover { background: #f3f4f6; color: #1a1d2e; }
    .sidebar-link.active { background: #eef2ff; color: #4f46e5; font-weight: 700; }

    /* ── Stat card ───────────────────────────────────── */
    .stat-card {
      background: #fff; border-radius: 16px; padding: 22px 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
      border-left: 4px solid transparent;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .stat-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08); }

    /* ── Avatar ──────────────────────────────────────── */
    .avatar {
      width: 36px; height: 36px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 700; color: #fff; flex-shrink: 0;
    }

    /* ── Tag ─────────────────────────────────────────── */
    .tag {
      display: inline-flex; align-items: center; padding: 3px 10px;
      border-radius: 6px; font-size: 12px; font-weight: 600;
    }

    /* ── Notification dot ────────────────────────────── */
    .notification-dot {
      width: 8px; height: 8px; background: #ef4444;
      border-radius: 50%; position: absolute; top: -1px; right: -1px;
    }

    /* ── Calendar ────────────────────────────────────── */
    .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }

    .cal-day {
      aspect-ratio: 1; display: flex; flex-direction: column;
      align-items: center; justify-content: center; border-radius: 8px;
      font-size: 12px; font-weight: 500; cursor: pointer;
      transition: all 0.15s; position: relative;
    }
    .cal-day:hover   { background: #f3f4f6; }
    .cal-day.today   { background: #4f46e5; color: #fff; font-weight: 700; }
    .cal-day.holiday { background: #fef3c7; color: #92400e; }
    .cal-day.other-month { color: #d1d5db; }
    .cal-day.has-leave   { background: #ede9fe; color: #4f46e5; }

    /* ── Progress bar ────────────────────────────────── */
    .progress-bar { background: #f0f2f5; border-radius: 20px; overflow: hidden; height: 8px; }
    .progress-fill { height: 100%; border-radius: 20px; transition: width 0.6s ease; }

    /* ── Responsive ──────────────────────────────────── */
    @media (max-width: 768px) {
      .sidebar { transform: translateX(-100%); }
      .sidebar.open { transform: translateX(0); }
    }
  `}</style>
);

export default GlobalStyles;
