// ─────────────────────────────────────────────────────────────────────────────
// src/data/mockData.js
// All seed / mock data for the Leave Management System
// ─────────────────────────────────────────────────────────────────────────────

export const LEAVE_TYPES = [
  { id: "CL", name: "Casual Leave",    color: "#6366f1", annual: 12,  carryForward: 0  },
  { id: "SL", name: "Sick Leave",      color: "#f59e0b", annual: 10,  carryForward: 5  },
  { id: "EL", name: "Earned Leave",    color: "#10b981", annual: 15,  carryForward: 10 },
  { id: "ML", name: "Maternity Leave", color: "#ec4899", annual: 180, carryForward: 0  },
  { id: "PL", name: "Paternity Leave", color: "#8b5cf6", annual: 15,  carryForward: 0  },
];

export const DEPARTMENTS = [
  "Engineering",
  "HR",
  "Finance",
  "Marketing",
  "Operations",
];

export const EMPLOYEES_DATA = [
  { id: 1, name: "Arjun Sharma",  email: "arjun@company.com",  dept: "Engineering", role: "employee", avatar: "AS", managerId: 2    },
  { id: 2, name: "Priya Mehta",   email: "priya@company.com",  dept: "Engineering", role: "hr",       avatar: "PM", managerId: null  },
  { id: 3, name: "Ravi Kumar",    email: "ravi@company.com",   dept: "HR",          role: "employee", avatar: "RK", managerId: 2    },
  { id: 4, name: "Sneha Patel",   email: "sneha@company.com",  dept: "Finance",     role: "employee", avatar: "SP", managerId: 2    },
  { id: 5, name: "Admin User",    email: "admin@company.com",  dept: "Operations",  role: "admin",    avatar: "AU", managerId: null  },
  { id: 6, name: "Deepak Nair",   email: "deepak@company.com", dept: "Marketing",   role: "employee", avatar: "DN", managerId: 2    },
];

export const HOLIDAYS_DATA = [
  { id: 1,  name: "Republic Day",           date: "2025-01-26", type: "public"  },
  { id: 2,  name: "Holi",                   date: "2025-03-14", type: "public"  },
  { id: 3,  name: "Good Friday",            date: "2025-04-18", type: "public"  },
  { id: 4,  name: "Company Foundation Day", date: "2025-04-22", type: "company" },
  { id: 5,  name: "Independence Day",       date: "2025-08-15", type: "public"  },
  { id: 6,  name: "Gandhi Jayanti",         date: "2025-10-02", type: "public"  },
  { id: 7,  name: "Diwali",                 date: "2025-10-20", type: "public"  },
  { id: 8,  name: "Diwali Holiday",         date: "2025-10-21", type: "company" },
  { id: 9,  name: "Christmas",              date: "2025-12-25", type: "public"  },
  { id: 10, name: "New Year",               date: "2025-12-31", type: "company" },
];

export const LEAVE_REQUESTS_DATA = [
  { id: 1, empId: 1, leaveType: "CL", startDate: "2025-03-10", endDate: "2025-03-11", days: 2, reason: "Family function attendance", status: "approved",  appliedOn: "2025-03-05", approvedBy: 2, comments: "Approved. Enjoy!"          },
  { id: 2, empId: 3, leaveType: "SL", startDate: "2025-03-18", endDate: "2025-03-18", days: 1, reason: "Medical appointment",         status: "approved",  appliedOn: "2025-03-17", approvedBy: 2, comments: "Approved. Get well soon." },
  { id: 3, empId: 4, leaveType: "EL", startDate: "2025-04-01", endDate: "2025-04-05", days: 5, reason: "Family vacation",             status: "pending",   appliedOn: "2025-03-20", approvedBy: null, comments: ""                    },
  { id: 4, empId: 6, leaveType: "CL", startDate: "2025-03-25", endDate: "2025-03-25", days: 1, reason: "Personal work",               status: "pending",   appliedOn: "2025-03-22", approvedBy: null, comments: ""                    },
  { id: 5, empId: 1, leaveType: "EL", startDate: "2025-05-12", endDate: "2025-05-16", days: 5, reason: "Annual vacation",             status: "pending",   appliedOn: "2025-03-28", approvedBy: null, comments: ""                    },
  { id: 6, empId: 3, leaveType: "CL", startDate: "2025-02-14", endDate: "2025-02-14", days: 1, reason: "Personal",                    status: "rejected",  appliedOn: "2025-02-10", approvedBy: 2, comments: "Critical deadline period." },
];

export const LEAVE_BALANCES_DATA = {
  1: { CL: 10, SL: 9,  EL: 13, ML: 0,   PL: 15 },
  2: { CL: 12, SL: 10, EL: 15, ML: 180, PL: 0  },
  3: { CL: 11, SL: 9,  EL: 15, ML: 0,   PL: 15 },
  4: { CL: 12, SL: 10, EL: 10, ML: 180, PL: 0  },
  5: { CL: 12, SL: 10, EL: 15, ML: 0,   PL: 15 },
  6: { CL: 11, SL: 10, EL: 15, ML: 0,   PL: 15 },
};

// Status badge styling lookup
export const STATUS_STYLE = {
  pending:   { bg: "#fef3c7", color: "#92400e", dot: "#f59e0b" },
  approved:  { bg: "#d1fae5", color: "#065f46", dot: "#10b981" },
  rejected:  { bg: "#fee2e2", color: "#991b1b", dot: "#ef4444" },
  cancelled: { bg: "#f3f4f6", color: "#374151", dot: "#9ca3af" },
};

// Avatar color palette — cycles by employee ID
export const AVATAR_COLORS = [
  "#4f46e5", "#ec4899", "#10b981", "#f59e0b",
  "#8b5cf6", "#06b6d4", "#ef4444", "#14b8a6",
];
