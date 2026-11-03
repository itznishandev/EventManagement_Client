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
      const externalUrl = `${EXTERNAL_API_BASE.replace(/\/$/, "")}${normalizedPath}`;
      const res = await fetch(externalUrl, fetchConfig);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || "Request failed");
      }
      return data;
    } catch (extErr) {
      if (
        extErr.name !== "TypeError" &&
        !String(extErr.message).includes("Failed to fetch") &&
        !String(extErr.message).includes("NetworkError")
      ) {
        throw extErr;
      }
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
