// ─────────────────────────────────────────────────────────────────────────────
// src/components/modules/calendar/HolidayCalendar.jsx
// Monthly calendar view with holiday highlighting + sidebar list.
// HR/Admin can add and delete holiday entries.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { Icon, Modal } from "../../common";
import { formatDate, toDateStr } from "../../../utils/helpers";

const TODAY = "2025-03-26";
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const HolidayCalendar = ({ user, holidays, addHoliday, deleteHoliday }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 2));
  const [showAdd,      setShowAdd]      = useState(false);
  const [form,         setForm]         = useState({ name: "", date: "", type: "public" });

  const year       = currentMonth.getFullYear();
  const month      = currentMonth.getMonth();
  const firstDay   = new Date(year, month, 1).getDay();
  const totalDays  = new Date(year, month + 1, 0).getDate();

  // Build calendar cells (null = empty leading cells)
  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  const monthHolidays = holidays.filter((h) => {
    const d = new Date(h.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleAdd = () => {
    if (!form.name || !form.date) return;
    addHoliday(form);
    setShowAdd(false);
    setForm({ name: "", date: "", type: "public" });
  };

  const canManage = user.role === "admin" || user.role === "hr";

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 800 }}>Holiday Calendar</h1>
          <p style={{ color: "#6b7280", fontSize: 13, marginTop: 3 }}>Company and public holiday schedule</p>
        </div>
        {canManage && (
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
            <Icon name="plus" size={15} color="#fff" /> Add Holiday
          </button>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
        {/* Calendar card */}
        <div className="card" style={{ padding: 24 }}>
          {/* Month navigator */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setCurrentMonth(new Date(year, month - 1))}>
              <Icon name="chevron_left" size={16} />
            </button>
            <h2 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 17 }}>
              {currentMonth.toLocaleString("en", { month: "long", year: "numeric" })}
            </h2>
            <button className="btn btn-ghost btn-sm" onClick={() => setCurrentMonth(new Date(year, month + 1))}>
              <Icon name="chevron_right" size={16} />
            </button>
          </div>

          {/* Day headers */}
          <div className="calendar-grid" style={{ marginBottom: 8 }}>
            {DAY_LABELS.map((d) => (
              <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: "#9ca3af", padding: "4px 0" }}>
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="calendar-grid">
            {cells.map((d, i) => {
              if (!d) return <div key={i} />;
              const dateStr = toDateStr(year, month, d);
              const holiday = holidays.find((h) => h.date === dateStr);
              const isToday = dateStr === TODAY;

              return (
                <div
                  key={i}
                  className={`cal-day ${isToday ? "today" : holiday ? "holiday" : ""}`}
                  title={holiday?.name}
                  style={{ padding: 4 }}
                >
                  <span style={{ fontSize: 13, fontWeight: isToday ? 800 : 500 }}>{d}</span>
                  {holiday && !isToday && (
                    <div style={{ width: 4, height: 4, background: "#f59e0b", borderRadius: "50%", marginTop: 2 }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ marginTop: 16, display: "flex", gap: 16 }}>
            {[["#fef3c7", "Holiday"], ["#4f46e5", "Today"]].map(([bg, label]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 12, height: 12, background: bg, borderRadius: 3 }} />
                <span style={{ fontSize: 11, color: "#6b7280" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar list */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 15, marginBottom: 16 }}>
            Holidays — {currentMonth.toLocaleString("en", { month: "long" })}
          </h3>

          {monthHolidays.length === 0 ? (
            <div style={{ textAlign: "center", color: "#9ca3af", fontSize: 13, padding: "20px 0" }}>
              No holidays this month
            </div>
          ) : (
            monthHolidays.map((h) => (
              <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, padding: "10px 12px", background: "#f9fafb", borderRadius: 10 }}>
                <div style={{ width: 38, textAlign: "center", background: h.type === "public" ? "#fef3c7" : "#ede9fe", borderRadius: 7, padding: "4px 0" }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: h.type === "public" ? "#92400e" : "#5b21b6" }}>
                    {new Date(h.date).getDate()}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{h.name}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>
                    {h.type === "public" ? "🌐 Public" : "🏢 Company"}
                  </div>
                </div>
                {canManage && (
                  <button className="btn btn-ghost btn-sm" style={{ padding: 4 }} onClick={() => deleteHoliday(h.id)}>
                    <Icon name="trash" size={13} color="#ef4444" />
                  </button>
                )}
              </div>
            ))
          )}

          {/* Full list */}
          <div style={{ marginTop: 16, borderTop: "1px solid #f0f2f5", paddingTop: 14 }}>
            <h4 style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 10 }}>
              ALL HOLIDAYS ({holidays.length})
            </h4>
            <div style={{ maxHeight: 200, overflowY: "auto" }}>
              {holidays.map((h) => (
                <div key={h.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, padding: "5px 0", borderBottom: "1px solid #f9fafb" }}>
                  <span style={{ fontWeight: 600 }}>{h.name}</span>
                  <span style={{ color: "#9ca3af" }}>{formatDate(h.date)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Holiday modal */}
      {showAdd && (
        <Modal title="Add Holiday" onClose={() => setShowAdd(false)}>
          <div className="form-group">
            <label className="form-label">Holiday Name</label>
            <input className="form-input" placeholder="e.g. Dussehra" value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input type="date" className="form-input" value={form.date} onChange={(e) => set("date", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Type</label>
            <select className="form-input" value={form.type} onChange={(e) => set("type", e.target.value)}>
              <option value="public">Public Holiday</option>
              <option value="company">Company Holiday</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-primary" onClick={handleAdd}>Add Holiday</button>
            <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default HolidayCalendar;
