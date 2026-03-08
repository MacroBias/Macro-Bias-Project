export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const SESSION_KEY = "macro_bias_session";
const DEFAULT_SESSION_DAYS = 7;
const SESSION_EVENT = "macro-bias-session-change";

type SessionData = {
  email: string;
  expiresAt: number;
};

function readSession(): SessionData | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionData;
  } catch {
    return null;
  }
}

export function setSession(email: string, days = DEFAULT_SESSION_DAYS): void {
  if (typeof window === "undefined") return;
  const expiresAt = Date.now() + days * 24 * 60 * 60 * 1000;
  const session: SessionData = { email, expiresAt };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function getSessionEmail(): string | null {
  const session = readSession();
  if (!session) return null;
  return session.email;
}

export function getEmail(): string | null {
  return getSessionEmail();
}

export function isSessionValid(): boolean {
  const session = readSession();
  if (!session) return false;
  if (!session.email) return false;
  if (Date.now() > session.expiresAt) {
    clearSession();
    return false;
  }
  return true;
}

export function logout(): void {
  clearSession();
}

export function getInitials(email: string): string {
  const parts = email.split("@")[0].split(/[._-]/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

export function getSessionEventName(): string {
  return SESSION_EVENT;
}
