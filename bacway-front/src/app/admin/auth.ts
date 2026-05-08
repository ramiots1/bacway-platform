// src/app/admin/auth.ts
// Tiny client-side auth helper. The backend is open; this is just a UI gate.

const STORAGE_KEY = "bacway_admin_authed";

export function isAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(STORAGE_KEY) === "1";
}

export function login(pin: string): boolean {
  const expected = process.env.NEXT_PUBLIC_ADMIN_PIN;
  if (!expected) return false;
  if (pin !== expected) return false;
  sessionStorage.setItem(STORAGE_KEY, "1");
  return true;
}

export function logout(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}