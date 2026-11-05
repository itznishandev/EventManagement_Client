"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  FiUser,
  FiMail,
  FiImage,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";
import { useAuth } from "@/app/context/AuthContext";

function RegisterFormContent() {
  const { registerUser, loginWithGoogle, loginWithGithub } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || name.trim().length < 2) {
      toast.error("Please enter your full name (at least 2 characters).");
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (
      photoURL.trim() &&
      !/^https?:\/\/.+/i.test(photoURL.trim())
    ) {
      toast.error("Photo URL must be a valid HTTP or HTTPS image link.");
      return;
    }

    // Strict Password Validation (Main Requirement)
    if (!hasUppercase) {
      toast.error("Password must contain at least one uppercase letter.");
      return;
    }
    if (!hasLowercase) {
      toast.error("Password must contain at least one lowercase letter.");
      return;
    }
    if (!hasMinLength) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setSubmitting(true);
    try {
      const createdUser = await registerUser({
        name: name.trim(),
        email: email.trim(),
        photoURL: photoURL.trim(),
        password,
      });

      toast.success("Account registered! Welcome to Uddog.");
      await Swal.fire({
        icon: "success",
        title: "Registration Complete!",
        text: `Welcome to Uddog, ${createdUser.displayName}!`,
        timer: 1700,
        showConfirmButton: false,
        background: "var(--bg-surface)",
        color: "var(--text-primary)",
      });
      router.push(callbackUrl);
    } catch (err) {
      toast.error(err.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-uddog py-12 sm:py-16">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Editorial Info Column */}
        <div
          className="lg:col-span-5 rounded-3xl p-8 sm:p-10 flex flex-col justify-between text-white"
          style={{
            background:
              "linear-gradient(155deg, #0a3c28 0%, #0f5338 55%, #1b7350 100%)",
          }}
        >
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/15 text-emerald-100">
              Join the Movement
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              Start or join local drives across your city.
            </h1>
            <p className="text-sm text-emerald-100/90 leading-relaxed">
              Every registered citizen on Uddog can organize verified community
              cleanups, tree plantations, or relief distributions and track
              every event they participate in.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/20 border border-white/15 space-y-2 mt-8">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              Password Security Standard
            </p>
            <ul className="space-y-1.5 text-xs">
              <li className="flex items-center gap-2">
                {hasUppercase ? (
                  <FiCheck className="w-4 h-4 text-emerald-300" />
                ) : (
                  <FiX className="w-4 h-4 text-white/50" />
                )}
                <span>At least 1 uppercase letter (A–Z)</span>
              </li>
              <li className="flex items-center gap-2">
                {hasLowercase ? (
                  <FiCheck className="w-4 h-4 text-emerald-300" />
                ) : (
                  <FiX className="w-4 h-4 text-white/50" />
                )}
                <span>At least 1 lowercase letter (a–z)</span>
              </li>
              <li className="flex items-center gap-2">
                {hasMinLength ? (
                  <FiCheck className="w-4 h-4 text-emerald-300" />
                ) : (
                  <FiX className="w-4 h-4 text-white/50" />
                )}
                <span>Minimum 6 characters in length</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Registration Form Card */}
        <div className="lg:col-span-7 uddog-card p-7 sm:p-10">
          <div className="mb-6">
            <h2
              className="text-2xl font-extrabold"
              style={{ color: "var(--text-primary)" }}
            >
              Create Your Volunteer Account
            </h2>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--text-secondary)" }}
            >
              Complete the fields below to register on Uddog.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="reg-name"
                className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                style={{ color: "var(--text-secondary)" }}
              >
                Full Name
              </label>
              <div className="relative">
                <FiUser
                  className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-muted)" }}
                />
                <input
                  id="reg-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Nusrat Jahan"
                  className="uddog-input !pl-11"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="reg-email"
                className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                style={{ color: "var(--text-secondary)" }}
              >
                Email Address
              </label>
              <div className="relative">
                <FiMail
                  className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-muted)" }}
                />
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nusrat@example.com"
                  className="uddog-input !pl-11"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="reg-photo"
                className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                style={{ color: "var(--text-secondary)" }}
              >
                Profile Photo URL
              </label>
              <div className="relative">
                <FiImage
                  className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-muted)" }}
                />
                <input
                  id="reg-photo"
                  type="url"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="uddog-input !pl-11"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="reg-password"
                className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                style={{ color: "var(--text-secondary)" }}
              >
                Password
              </label>
              <div className="relative">
                <FiLock
                  className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-muted)" }}
                />
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 chars with uppercase & lowercase"
                  className="uddog-input !pl-11 !pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label="Toggle password visibility"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 cursor-pointer"
                  style={{ color: "var(--text-muted)" }}
                >
                  {showPassword ? (
                    <FiEyeOff className="w-4 h-4" />
                  ) : (
                    <FiEye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-uddog-primary w-full justify-center mt-2"
            >
              <span>
                {submitting ? "Creating Account..." : "Register Account"}
              </span>
              <FiArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Social Registration Options */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div
                className="w-full border-t"
                style={{ borderColor: "var(--border-subtle)" }}
              />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span
                className="px-3 font-bold tracking-wider"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-muted)",
                }}
              >
                Or sign up with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() =>
                loginWithGoogle(callbackUrl).catch((err) =>
                  toast.error(err.message || "Google sign-up could not be started.")
                )
              }
              className="btn-uddog-outline w-full justify-center text-sm"
            >
              <FcGoogle className="w-5 h-5" />
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() =>
                loginWithGithub(callbackUrl).catch((err) =>
                  toast.error(err.message || "GitHub sign-up could not be started.")
                )
              }
              className="btn-uddog-outline w-full justify-center text-sm"
            >
              <FaGithub className="w-5 h-5" />
              <span>GitHub</span>
            </button>
          </div>

          <p
            className="text-sm text-center mt-7"
            style={{ color: "var(--text-secondary)" }}
          >
            Already have an account?{" "}
            <Link
              href={`/login${
                callbackUrl !== "/"
                  ? `?callbackUrl=${encodeURIComponent(callbackUrl)}`
                  : ""
              }`}
              className="font-bold underline"
              style={{ color: "var(--brand-primary)" }}
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="container-uddog py-16">
          <div className="max-w-4xl mx-auto h-96 rounded-3xl skeleton-shimmer" />
        </div>
      }
    >
      <RegisterFormContent />
    </Suspense>
  );
}
