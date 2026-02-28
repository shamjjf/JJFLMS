// ─────────────────────────────────────────────────────────────────────────────
// src/App.jsx — with edit/delete leave types
// ─────────────────────────────────────────────────────────────────────────────

import GlobalStyles  from "./styles/GlobalStyles";
import { useAppState } from "./hooks/useAppState";

import Sidebar from "./components/layout/Sidebar";
import TopBar  from "./components/layout/TopBar";
import Login from "./pages/Login";

import Dashboard       from "./components/modules/dashboard/Dashboard";
import MyLeaves        from "./components/modules/leaves/MyLeaves";
import ApplyLeave      from "./components/modules/leaves/ApplyLeave";
import Approvals       from "./components/modules/approvals/Approvals";
import Balances        from "./components/modules/balances/Balances";
import HolidayCalendar from "./components/modules/calendar/HolidayCalendar";
import Reports         from "./components/modules/reports/Reports";
import Employees       from "./components/modules/employees/Employees";
import LeaveConfig     from "./components/modules/config/LeaveConfig";

export default function App() {
  const {
    user, activeTab, sidebarOpen,
    leaves, holidays, employees, balances, leaveTypes, pendingCount,
    setActiveTab, setSidebarOpen,
    loginWithEmail, logout,
    submitLeave, cancelLeave, reviewLeave,
    addHoliday, deleteHoliday,
    addEmployee, editEmployee, deleteEmployee,
    addLeaveType, editLeaveType, deleteLeaveType,
  } = useAppState();

  if (!user) {
    return (
      <>
        <GlobalStyles />
        <Login onLoginWithEmail={loginWithEmail} />
      </>
    );
  }

  const renderPage = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard user={user} leaves={leaves} employees={employees} balances={balances} />;
      case "my-leaves":
        return <MyLeaves user={user} leaves={leaves} cancelLeave={cancelLeave} />;
      case "apply-leave":
        return <ApplyLeave user={user} leaves={leaves} balances={balances} submitLeave={submitLeave} />;
      case "approvals":
        return <Approvals user={user} leaves={leaves} employees={employees} balances={balances} reviewLeave={reviewLeave} />;
      case "balances":
        return <Balances user={user} employees={employees} balances={balances} />;
      case "calendar":
        return <HolidayCalendar user={user} holidays={holidays} addHoliday={addHoliday} deleteHoliday={deleteHoliday} />;
      case "reports":
        return <Reports leaves={leaves} employees={employees} balances={balances} />;
      case "employees":
        return <Employees user={user} employees={employees} addEmployee={addEmployee} editEmployee={editEmployee} deleteEmployee={deleteEmployee} />;
      case "leave-config":
        return <LeaveConfig user={user} leaveTypes={leaveTypes} addLeaveType={addLeaveType} editLeaveType={editLeaveType} deleteLeaveType={deleteLeaveType} />;
      default:
        return <Dashboard user={user} leaves={leaves} employees={employees} balances={balances} />;
    }
  };

  return (
    <>
      <GlobalStyles />
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} sidebarOpen={sidebarOpen} />
        <div style={{ marginLeft: sidebarOpen ? 240 : 0, flex: 1, minHeight: "100vh", transition: "margin-left 0.25s ease" }}>
          <TopBar user={user} pendingCount={pendingCount} onToggleSidebar={() => setSidebarOpen((v) => !v)} onNavigate={setActiveTab} onLogout={logout} />
          <div style={{ padding: "28px 28px" }}>{renderPage()}</div>
        </div>
      </div>
    </>
  );
}
