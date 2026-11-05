"use client";

// Strictly target the separate Express Backend Server
const DEFAULT_SERVER_URL = "https://event-management-server-xi.vercel.app/api";

function resolveServerApiUrl() {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && envUrl.trim().length > 0) {
    const clean = envUrl.trim().replace(/\/+$/, "");
    return clean.endsWith("/api") ? clean : `${clean}/api`;
  }
  return DEFAULT_SERVER_URL;
}

export function getStoredToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("uddog_jwt_token");
}

export function setStoredToken(token) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem("uddog_jwt_token", token);
  } else {
    localStorage.removeItem("uddog_jwt_token");
  }
}

/**
 * apiRequest strictly dispatches all CRUD & business requests directly to
 * the standalone Express backend server (EventManagement_Server).
 * No internal Next.js client-side backup handler or mock route is used.
 */
export async function apiRequest(endpointPath, options = {}) {
  const token = getStoredToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const fetchConfig = {
    ...options,
    headers,
  };

  const normalizedPath = endpointPath.startsWith("/")
    ? endpointPath
    : `/${endpointPath}`;

  const serverBase = resolveServerApiUrl();
  const targetUrl = `${serverBase}${normalizedPath}`;

  const res = await fetch(targetUrl, fetchConfig);
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const errorMsg =
      data?.message ||
      data?.error ||
      `Server Error (${res.status}): ${res.statusText || "Request failed"}`;
    throw new Error(errorMsg);
  }

  return data;
}

export function formatEventDate(dateStr, includeTime = false) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;

  const options = {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(includeTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  };

  return d.toLocaleDateString("en-US", options);
}

export function getDaysRemaining(dateStr) {
  if (!dateStr) return null;
  const target = new Date(dateStr).getTime();
  const now = Date.now();
  const diffDays = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "Completed";
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  return `In ${diffDays} days`;
}

export const EVENT_TYPES = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Medical Camp",
  "Education",
  "Flood Relief",
  "Blood Donation",
];
