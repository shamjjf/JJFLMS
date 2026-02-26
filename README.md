# LeaveFlow — Employee Leave Management System

A fully functional, role-based Employee Leave Management System built with React.

---

## 📁 Project Structure

```
leave-management-system/
├── public/
│   └── index.html                    # HTML entry point
├── src/
│   ├── data/
│   │   └── mockData.js               # All seed/mock data (employees, leaves, holidays, balances)
│   │
│   ├── utils/
│   │   └── helpers.js                # Utility functions (formatDate, daysBetween, getEmp, etc.)
│   │
│   ├── styles/
│   │   └── GlobalStyles.jsx          # Global CSS injected via <style> tag
│   │
│   ├── hooks/
│   │   └── useAppState.js            # Central state management hook (leaves, balances, holidays)
│   │
│   ├── components/
│   │   ├── common/                   # Reusable UI primitives
│   │   │   ├── Icon.jsx              # SVG icon component
│   │   │   ├── Modal.jsx             # Reusable modal overlay
│   │   │   ├── StatusBadge.jsx       # Colored status pill (Pending/Approved/Rejected)
│   │   │   └── index.js             # Barrel export for common components
│   │   │
│   │   ├── layout/                   # Layout / shell components
│   │   │   ├── Sidebar.jsx           # Left navigation sidebar
│   │   │   └── TopBar.jsx            # Top navigation bar with bell + user menu
│   │   │
│   │   └── modules/                  # Feature modules (one folder per module)
│   │       ├── dashboard/
│   │       │   └── Dashboard.jsx     # Dashboard with stats, recent leaves, holiday widget
│   │       ├── leaves/
│   │       │   ├── MyLeaves.jsx      # Employee's own leave list with status filter
│   │       │   └── ApplyLeave.jsx    # Leave application form with validation
│   │       ├── approvals/
│   │       │   └── Approvals.jsx     # HR/Admin approval queue with review modal
│   │       ├── balances/
│   │       │   └── Balances.jsx      # Leave balance table with progress bars
│   │       ├── calendar/
│   │       │   └── HolidayCalendar.jsx  # Monthly calendar + holiday list
│   │       ├── reports/
│   │       │   └── Reports.jsx       # Employee, department & trend reports
│   │       ├── employees/
│   │       │   └── Employees.jsx     # Employee directory cards
│   │       └── config/
│   │           └── LeaveConfig.jsx   # Leave type configuration (Admin only)
│   │
│   ├── pages/
│   │   └── Login.jsx                 # Login / demo account selection page
│   │
│   └── App.jsx                       # Root component — routing, layout, state wiring
│
├── package.json
└── README.md
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

---

## 👥 User Roles

| Role | Access |
|------|--------|
| **Admin** | Full access — all modules + Leave Configuration |
| **HR Manager** | Approvals, Balances, Reports, Calendar management |
| **Employee** | Apply Leave, My Leaves, Balance, Holiday Calendar |

---

## 📦 Module Overview

| Module | File | Description |
|--------|------|-------------|
| Dashboard | `modules/dashboard/Dashboard.jsx` | Stats, recent requests, upcoming holidays |
| My Leaves | `modules/leaves/MyLeaves.jsx` | Employee leave history with status filters |
| Apply Leave | `modules/leaves/ApplyLeave.jsx` | Leave form with balance & overlap validation |
| Approvals | `modules/approvals/Approvals.jsx` | HR/Admin review queue — approve or reject |
| Balances | `modules/balances/Balances.jsx` | Real-time leave balance per employee |
| Holiday Calendar | `modules/calendar/HolidayCalendar.jsx` | Add/view public & company holidays |
| Reports | `modules/reports/Reports.jsx` | Employee-wise, dept-wise, monthly trend |
| Employees | `modules/employees/Employees.jsx` | Employee directory |
| Leave Config | `modules/config/LeaveConfig.jsx` | Configure leave types & policies |

---

## 🛠 Tech Stack

- **React 18** — UI framework
- **React Hooks** — state management (useState, custom hooks)
- **Inline CSS + Global Styles** — no CSS-in-JS library dependency
- **Google Fonts** — Plus Jakarta Sans + Syne

---

## 📋 Features

- ✅ Role-based access control (Admin / HR / Employee)
- ✅ Leave application with balance validation & overlap detection
- ✅ Approval workflow with comments
- ✅ Auto balance deduction on approval
- ✅ Real-time leave balance tracking
- ✅ Holiday calendar with add/delete
- ✅ Employee-wise, dept-wise & monthly reports
- ✅ Responsive sidebar with collapsible toggle
- ✅ Pending approval notifications
