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

  // Try external Express server first if configured on localhost or production URL, then fallback to built-in Next.js API route
  const normalizedPath = endpointPath.startsWith("/")
    ? endpointPath
    : `/${endpointPath}`;

  if (EXTERNAL_API_BASE) {
    try {
      const externalUrl = `${EXTERNAL_API_BASE.replace(/\/$/, "")}${normalizedPath}`;
      const res = await fetch(externalUrl, fetchConfig);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || "Request failed");
      }
      return data;
    } catch (extErr) {
      // If network error (e.g. standalone frontend deployment without local port 5000 running), fall back seamlessly to internal Next.js MongoDB+JWT API route
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
