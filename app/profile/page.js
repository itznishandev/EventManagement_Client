"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  FiUser,
  FiMail,
  FiImage,
  FiCheck,
  FiCalendar,
  FiCheckCircle,
  FiSliders,
} from "react-icons/fi";
import Link from "next/link";
import PrivateRoute from "@/app/components/PrivateRoute";
import { useAuth } from "@/app/context/AuthContext";
import { apiRequest } from "@/app/lib/api";

export default function ProfilePage() {
  const { user, updateUserProfile } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ created: 0, joined: 0 });

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || user.name || "");
      setPhotoURL(user.photoURL || "");
    }
  }, [user]);

  useEffect(() => {
    if (!user?.email) return;
    let isMounted = true;
    async function loadUserStats() {
      try {
        const [myRes, joinedRes] = await Promise.all([
          apiRequest("/my-events").catch(() => ({ count: 0 })),
          apiRequest("/joined-events").catch(() => ({ count: 0 })),
        ]);
        if (isMounted) {
          setStats({
            created: myRes?.count ?? (myRes?.events?.length || 0),
            joined: joinedRes?.count ?? (joinedRes?.joinedEvents?.length || 0),
          });
        }
      } catch (e) {
        // ignore
      }
    }
    loadUserStats();
    return () => {
      isMounted = false;
    };
  }, [user?.email]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!displayName.trim() || displayName.trim().length < 2) {
      toast.error("Display name must be at least 2 characters.");
      return;
    }
    if (photoURL.trim() && !/^https?:\/\/.+/i.test(photoURL.trim())) {
      toast.error("Profile picture must be a valid HTTP or HTTPS image URL.");
      return;
    }

    setSaving(true);
    try {
      await updateUserProfile({
        displayName: displayName.trim(),
        photoURL: photoURL.trim(),
      });

      toast.success("Profile updated successfully!");
      await Swal.fire({
        icon: "success",
        title: "Profile Saved!",
        text: "Your display name and profile picture have been updated across Uddog.",
        timer: 1600,
        showConfirmButton: false,
        background: "var(--bg-surface)",
        color: "var(--text-primary)",
      });
    } catch (err) {
      toast.error(err.message || "Could not update profile.");
    } finally {
      setSaving(false);
    }
  };

  const avatarPreview =
    photoURL && /^https?:\/\/.+/i.test(photoURL)
      ? photoURL
      : user?.photoURL ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          displayName || "Volunteer"
        )}&background=0F5338&color=ffffff&bold=true`;

  return (
    <PrivateRoute>
      <section className="py-12 sm:py-16">
        <div className="container-uddog">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-3">
              <span className="section-eyebrow">
                <FiUser className="w-3.5 h-3.5" />
                <span>Volunteer Identity</span>
              </span>
              <h1 className="section-heading">My Profile & Impact Summary</h1>
              <p className="section-subtitle">
                View your community service record and update your public
                organizer name and profile photo.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Profile Overview Card */}
              <div className="lg:col-span-5 uddog-card p-7 text-center space-y-5">
                <div className="relative inline-block">
                  <img
                    src={avatarPreview}
                    alt={displayName || "Profile"}
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        displayName || "Volunteer"
                      )}&background=0F5338&color=ffffff&bold=true`;
                    }}
                    className="w-28 h-28 rounded-full object-cover mx-auto border-4"
                    style={{ borderColor: "var(--brand-primary)" }}
                  />
                </div>

                <div>
                  <h2
                    className="text-xl font-extrabold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {user?.displayName || user?.name}
                  </h2>
                  <p
                    className="text-xs font-medium mt-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {user?.email}
                  </p>
                </div>

                <div
                  className="grid grid-cols-2 gap-3 pt-4 border-t"
                  style={{ borderColor: "var(--border-subtle)" }}
                >
                  <Link
                    href="/manage-events"
                    className="p-3.5 rounded-2xl border text-center transition-colors hover:border-[#0f5338]"
                    style={{
                      backgroundColor: "var(--bg-elevated)",
                      borderColor: "var(--border-subtle)",
                    }}
                  >
                    <p
                      className="text-2xl font-extrabold"
                      style={{ color: "var(--brand-primary)" }}
                    >
                      {stats.created}
                    </p>
                    <p
                      className="text-xs font-semibold mt-0.5 flex items-center justify-center gap-1"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <FiSliders className="w-3 h-3" />
                      <span>Events Created</span>
                    </p>
                  </Link>

                  <Link
                    href="/joined-events"
                    className="p-3.5 rounded-2xl border text-center transition-colors hover:border-[#0f5338]"
                    style={{
                      backgroundColor: "var(--bg-elevated)",
                      borderColor: "var(--border-subtle)",
                    }}
                  >
                    <p
                      className="text-2xl font-extrabold"
                      style={{ color: "var(--brand-primary)" }}
                    >
                      {stats.joined}
                    </p>
                    <p
                      className="text-xs font-semibold mt-0.5 flex items-center justify-center gap-1"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <FiCheckCircle className="w-3 h-3" />
                      <span>Events Joined</span>
                    </p>
                  </Link>
                </div>
              </div>

              {/* Right Update Profile Form */}
              <div className="lg:col-span-7 uddog-card p-7 sm:p-9">
                <h2
                  className="text-xl font-extrabold mb-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  Update Profile Information
                </h2>
                <p
                  className="text-xs mb-6"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Changes to your name or profile picture are synchronized with
                  MongoDB and reflected across all your events.
                </p>

                <form
                  onSubmit={handleProfileSubmit}
                  className="space-y-4"
                  noValidate
                >
                  <div>
                    <label
                      htmlFor="profile-email"
                      className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Registered Email (Read Only)
                    </label>
                    <div className="relative">
                      <FiMail
                        className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2"
                        style={{ color: "var(--text-muted)" }}
                      />
                      <input
                        id="profile-email"
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="uddog-input !pl-11 opacity-70 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="profile-name"
                      className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Display Name *
                    </label>
                    <div className="relative">
                      <FiUser
                        className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2"
                        style={{ color: "var(--text-muted)" }}
                      />
                      <input
                        id="profile-name"
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Your full name"
                        className="uddog-input !pl-11"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="profile-photo"
                      className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Profile Picture URL
                    </label>
                    <div className="relative">
                      <FiImage
                        className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2"
                        style={{ color: "var(--text-muted)" }}
                      />
                      <input
                        id="profile-photo"
                        type="url"
                        value={photoURL}
                        onChange={(e) => setPhotoURL(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="uddog-input !pl-11"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-uddog-primary w-full justify-center mt-2"
                  >
                    <FiCheck className="w-4 h-4" />
                    <span>
                      {saving ? "Updating Profile..." : "Save Profile Changes"}
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PrivateRoute>
  );
}
