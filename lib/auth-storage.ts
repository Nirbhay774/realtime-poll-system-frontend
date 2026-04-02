"use client";

import type { AuthSession } from "@/lib/types";

const AUTH_SESSION_STORAGE_KEY = "poll-app-auth-session";

function canUseLocalStorage() {
  return typeof window !== "undefined";
}

export function readStoredAuthSession(): AuthSession | null {
  if (!canUseLocalStorage()) {
    return null;
  }

  const rawValue = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as AuthSession;
  } catch {
    return null;
  }
}

export function writeStoredAuthSession(session: AuthSession) {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredAuthSession() {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
}
