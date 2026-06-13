/* Elara Healthcare — appointment state and persistence (ES module).
 * Phase 1: backed by localStorage. Phase 2 will swap this file
 * for a real API client; consumers should only import the
 * functions exported below. */

const STORAGE_KEY = "elara:appointments:v1";
const PROBE_KEY = "elara:probe";

export function isPersistenceAvailable() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return false;
    window.localStorage.setItem(PROBE_KEY, "1");
    window.localStorage.removeItem(PROBE_KEY);
    return true;
  } catch (_err) {
    return false;
  }
}

export function loadAppointments() {
  if (!isPersistenceAvailable()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (_err) {
    return [];
  }
}

export function saveAppointments(list) {
  if (!isPersistenceAvailable()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (_err) {
    /* quota or serialization failure — fail silently in Phase 1 */
  }
}

function generateId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  const rand = Math.random().toString(36).slice(2, 10);
  return `appt-${Date.now().toString(36)}-${rand}`;
}

export function addAppointment(data) {
  const list = loadAppointments();
  const appointment = {
    ...structuredClone(data),
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  const next = [appointment, ...list];
  saveAppointments(next);
  return next;
}

export function updateAppointment(id, data) {
  const list = loadAppointments();
  const next = list.map((item) => {
    if (item.id !== id) return item;
    return {
      ...item,
      ...structuredClone(data),
      id: item.id,
      createdAt: item.createdAt,
      updatedAt: new Date().toISOString(),
    };
  });
  saveAppointments(next);
  return next;
}

export function deleteAppointment(id) {
  const list = loadAppointments();
  const next = list.filter((item) => item.id !== id);
  saveAppointments(next);
  return next;
}

export function getAppointment(id) {
  return loadAppointments().find((item) => item.id === id);
}
