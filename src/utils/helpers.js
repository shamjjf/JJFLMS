// ─────────────────────────────────────────────────────────────────────────────
// src/utils/helpers.js
// Pure utility functions shared across the application
// ─────────────────────────────────────────────────────────────────────────────

import { LEAVE_TYPES, AVATAR_COLORS } from "../data/mockData";

/**
 * Format a date string to a readable Indian locale format
 * e.g. "2025-03-26" → "26 Mar 2025"
 */
export function formatDate(d) {
  if (!d) return "-";
  const date = new Date(d);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Calculate the number of calendar days between two date strings (inclusive)
 */
export function daysBetween(a, b) {
  const d1 = new Date(a);
  const d2 = new Date(b);
  return Math.max(1, Math.round((d2 - d1) / 86_400_000) + 1);
}

/**
 * Find an employee object by ID from the employees array
 */
export function getEmp(id, emps) {
  return emps.find((e) => e.id === id);
}

/**
 * Find a leave type config object by its ID (e.g. "CL", "SL")
 */
export function getLT(id) {
  return LEAVE_TYPES.find((l) => l.id === id);
}

/**
 * Return a consistent avatar background color based on employee ID
 */
export function avatarColor(id) {
  return AVATAR_COLORS[(id - 1) % AVATAR_COLORS.length];
}

/**
 * Capitalise the first letter of a string
 */
export function capitalize(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert a date (year, month, day) into a "YYYY-MM-DD" string
 */
export function toDateStr(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
