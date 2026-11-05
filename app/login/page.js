"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiCheckCircle,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";
import { useAuth } from "@/app/context/AuthContext";

function LoginFormContent() {
  const { loginUser, loginWithGoogle, loginWithGithub } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the highlighted login fields.");
      return;
    }

    setSubmitting(true);
    try {
      const loggedUser = await loginUser(email, password);
      toast.success(`Welcome back, ${loggedUser.displayName || "Volunteer"}!`);
      await Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: `Signed in as ${loggedUser.displayName || loggedUser.email}`,
        timer: 1600,
        showConfirmButton: false,
        background: "var(--bg-surface)",
        color: "var(--text-primary)",
      });
      router.push(callbackUrl);
    } catch (err) {
      toast.error(err.message || "Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle(callbackUrl);
    } catch (err) {
      toast.error(err.message || "Google sign-in could not be started.");
    }
  };

  const handleGithubLogin = async () => {
    try {
      await loginWithGithub(callbackUrl);
    } catch (err) {
      toast.error(err.message || "GitHub sign-in could not be started.");
    }
  };

  return (
    <div className="container-uddog py-12 sm:py-16">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Civic Context Panel */}
        <div
          className="lg:col-span-5 rounded-3xl p-8 sm:p-10 flex flex-col justify-between text-white relative overflow-hidden"
          style={{
            background:
              "linear-gradient(145deg, #0a3c28 0%, #0f5338 55%, #166544 100%)",
          }}
        >
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/15 text-emerald-100">
              Volunteer Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              Coordinate local impact with your community.
            </h1>
            <p className="text-sm text-emerald-100/90 leading-relaxed">
              Sign in to launch new social development events, join upcoming
              neighbourhood drives, and manage your volunteer commitments across
              Bangladesh.
            </p>
          </div>

          <div className="space-y-3 pt-8 border-t border-white/15 mt-8 text-xs sm:text-sm text-emerald-100">
            <div className="flex items-center gap-2.5">
              <FiCheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Create & manage verified community service events</span>
            </div>
            <div className="flex items-center gap-2.5">
              <FiCheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>One-click registration for upcoming local drives</span>
            </div>
            <div className="flex items-center gap-2.5">
              <FiCheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>JWT-authenticated organizer & participant dashboard</span>
            </div>
          </div>
        </div>

        {/* Right Login Form Card */}
        <div className="lg:col-span-7 uddog-card p-7 sm:p-10">
          <div className="mb-6">
            <h2
              className="text-2xl font-extrabold"
              style={{ color: "var(--text-primary)" }}
            >
              Sign in to Uddog
            </h2>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--text-secondary)" }}
            >
              Enter your email and password or continue with a social account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="login-email"
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
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email)
                      setFieldErrors({ ...fieldErrors, email: "" });
                  }}
                  placeholder="you@example.com"
                  className="uddog-input !pl-11"
                  required
                />
              </div>
              {fieldErrors.email && (
                <p className="text-xs text-red-500 font-semibold mt-1">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="login-password"
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
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password)
                      setFieldErrors({ ...fieldErrors, password: "" });
                  }}
                  placeholder="Enter your password"
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
              {fieldErrors.password && (
                <p className="text-xs text-red-500 font-semibold mt-1">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-uddog-primary w-full justify-center mt-2"
            >
              <span>{submitting ? "Signing in..." : "Login to Account"}</span>
              <FiArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
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
                Or continue with
              </span>
            </div>
          </div>

          {/* Google & GitHub Social Login Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="btn-uddog-outline w-full justify-center text-sm"
            >
              <FcGoogle className="w-5 h-5" />
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={handleGithubLogin}
              className="btn-uddog-outline w-full justify-center text-sm"
            >
              <FaGithub className="w-5 h-5" />
              <span>Continue with GitHub</span>
            </button>
          </div>

          <p
            className="text-sm text-center mt-7"
            style={{ color: "var(--text-secondary)" }}
          >
            New to Uddog?{" "}
            <Link
              href={`/register${
                callbackUrl !== "/"
                  ? `?callbackUrl=${encodeURIComponent(callbackUrl)}`
                  : ""
              }`}
              className="font-bold underline"
              style={{ color: "var(--brand-primary)" }}
            >
              Create a Volunteer Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="container-uddog py-16">
          <div className="max-w-4xl mx-auto h-96 rounded-3xl skeleton-shimmer" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
