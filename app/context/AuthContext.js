"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "@/app/lib/auth-client";
import { apiRequest, getStoredToken, setStoredToken } from "@/app/lib/api";

const AuthContext = createContext(null);

const USER_STORAGE_KEY = "uddog_active_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function restoreAuthSession() {
      try {
        let localUser = null;
        if (typeof window !== "undefined") {
          const raw = localStorage.getItem(USER_STORAGE_KEY);
          if (raw) {
            localUser = JSON.parse(raw);
            if (isMounted) {
              setUser(localUser);
            }
          }
        }

        // Check if BetterAuth OAuth session completed (Google / GitHub redirect)
        if (authClient?.getSession) {
          try {
            const sessionRes = await authClient.getSession();
            if (sessionRes?.data?.user && isMounted) {
              const oauthUser = sessionRes.data.user;
              const syncRes = await apiRequest("/auth/social", {
                method: "POST",
                body: JSON.stringify({
                  email: oauthUser.email,
                  name: oauthUser.name || oauthUser.email.split("@")[0],
                  photoURL: oauthUser.image || null,
                  provider: "oauth",
                }),
              });

              if (syncRes?.user && isMounted) {
                setUser(syncRes.user);
                localStorage.setItem(
                  USER_STORAGE_KEY,
                  JSON.stringify(syncRes.user)
                );
                if (syncRes.token) {
                  setStoredToken(syncRes.token);
                }
                localUser = syncRes.user;
              }
            }
          } catch (oauthErr) {
            // Non-fatal if no active OAuth cookie
          }
        }

        // Ensure JWT token is present if localUser exists
        if (localUser && !getStoredToken()) {
          try {
            const jwtRes = await apiRequest("/jwt", {
              method: "POST",
              body: JSON.stringify({
                email: localUser.email,
                name: localUser.displayName || localUser.name,
                uid: localUser.uid,
              }),
            });
            if (jwtRes?.token) {
              setStoredToken(jwtRes.token);
            }
          } catch (e) {
            // ignore
          }
        }
      } catch (err) {
        console.error("Failed to restore session:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    restoreAuthSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const registerUser = async ({ name, email, photoURL, password }) => {
    const data = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, photoURL, password }),
    });

    if (data?.user) {
      setUser(data.user);
      if (typeof window !== "undefined") {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      }
    }
    if (data?.token) {
      setStoredToken(data.token);
    }
    return data.user;
  };

  const loginUser = async (email, password) => {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (data?.user) {
      setUser(data.user);
      if (typeof window !== "undefined") {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      }
    }
    if (data?.token) {
      setStoredToken(data.token);
    }
    return data.user;
  };

  const loginWithGoogle = async (callbackUrl = "/") => {
    if (authClient?.signIn?.social) {
      const res = await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      });
      if (res?.data?.url) {
        window.location.href = res.data.url;
      }
      return res;
    }
    throw new Error("Google OAuth client is unavailable.");
  };

  const loginWithGithub = async (callbackUrl = "/") => {
    if (authClient?.signIn?.social) {
      const res = await authClient.signIn.social({
        provider: "github",
        callbackURL: callbackUrl,
      });
      if (res?.data?.url) {
        window.location.href = res.data.url;
      }
      return res;
    }
    throw new Error("GitHub OAuth client is unavailable.");
  };

  const updateUserProfile = async ({ displayName, photoURL }) => {
    if (!user) throw new Error("You must be logged in to update your profile.");

    const data = await apiRequest("/auth/profile", {
      method: "PUT",
      body: JSON.stringify({
        displayName,
        name: displayName,
        photoURL,
      }),
    });

    const updatedUser = data?.user || {
      ...user,
      name: displayName,
      displayName,
      photoURL: photoURL || user.photoURL,
    };

    setUser(updatedUser);
    if (typeof window !== "undefined") {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    }
    if (data?.token) {
      setStoredToken(data.token);
    }

    return updatedUser;
  };

  const logoutUser = async () => {
    try {
      if (authClient?.signOut) {
        await authClient.signOut();
      }
    } catch (e) {
      // ignore
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
    setStoredToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        registerUser,
        loginUser,
        loginWithGoogle,
        loginWithGithub,
        updateUserProfile,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return ctx;
}
