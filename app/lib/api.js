"use client";

const EXTERNAL_API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

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

  // Avoid calling localhost:5000 when running on a deployed production domain (e.g. *.netlify.app / *.vercel.app)
  const isRemoteHost =
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1";

  const shouldTryExternal =
    EXTERNAL_API_BASE &&
    !(isRemoteHost && EXTERNAL_API_BASE.includes("localhost"));

  if (shouldTryExternal) {
    try {
      const cleanBase = EXTERNAL_API_BASE.replace(/\/+$/, "");
      const baseWithApi = cleanBase.endsWith("/api")
        ? cleanBase
        : `${cleanBase}/api`;
      const externalUrl = `${baseWithApi}${normalizedPath}`;
      const res = await fetch(externalUrl, fetchConfig);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
      console.warn(
        `External API (${externalUrl}) returned ${res.status}. Falling back to internal Next.js API...`
      );
    } catch (extErr) {
      console.warn(
        "External API fetch error. Falling back to internal Next.js API:",
        extErr.message
      );
    }
  }

  const internalUrl = `/api${normalizedPath}`;
  const res = await fetch(internalUrl, fetchConfig);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.error || "Request failed");
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
