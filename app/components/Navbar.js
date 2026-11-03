"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  FiCalendar,
  FiPlusCircle,
  FiSliders,
  FiCheckCircle,
  FiUser,
  FiLogOut,
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
  FiCompass,
} from "react-icons/fi";
import { useAuth } from "@/app/context/AuthContext";
import { useTheme } from "@/app/context/ThemeContext";

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    await logoutUser();
    toast.success("Signed out of your Uddog account.");
    if (
      pathname.startsWith("/create-event") ||
      pathname.startsWith("/manage-events") ||
      pathname.startsWith("/joined-events") ||
      pathname.startsWith("/profile")
    ) {
      router.push("/login");
    }
  };

  const displayName =
    user?.displayName || user?.name || user?.email?.split("@")[0] || "Volunteer";
  const avatarUrl =
    user?.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      displayName
    )}&background=0F5338&color=ffffff&bold=true`;

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-md transition-colors"
      style={{
        backgroundColor:
          theme === "dark"
            ? "rgba(12, 20, 17, 0.88)"
            : "rgba(246, 245, 240, 0.90)",
        borderColor: "var(--border-subtle)",
      }}
    >
      <div className="container-uddog h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Name — Same Heading Style as Home Page */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105"
            style={{ backgroundColor: "#0f5338", color: "#ffffff" }}
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9z" />
              <path d="M12 22c-4.97 0-9-4.03-9-9 4.97 0 9 4.03 9 9z" />
              <path d="M12 13V3" />
              <path d="M16 7l-4-4-4 4" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span
              className="text-xl sm:text-2xl font-extrabold tracking-tight leading-none"
              style={{ color: "var(--text-primary)" }}
            >
              Uddog
            </span>
            <span
              className="text-[11px] font-semibold tracking-widest uppercase mt-1"
              style={{ color: "var(--brand-primary)" }}
            >
              Civic Action Network
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-2">
          <Link
            href="/"
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              isActive("/")
                ? "bg-[#0f5338] text-white shadow-sm"
                : "hover:opacity-80"
            }`}
            style={
              !isActive("/") ? { color: "var(--text-secondary)" } : undefined
            }
          >
            Home
          </Link>

          <Link
            href="/upcoming-events"
            className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
              isActive("/upcoming-events")
                ? "bg-[#0f5338] text-white shadow-sm"
                : "hover:opacity-80"
            }`}
            style={
              !isActive("/upcoming-events")
                ? { color: "var(--text-secondary)" }
                : undefined
            }
          >
            <FiCompass className="w-4 h-4" />
            <span>Upcoming Events</span>
          </Link>

          {user && (
            <>
              <Link
                href="/create-event"
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive("/create-event")
                    ? "bg-[#0f5338] text-white shadow-sm"
                    : "hover:opacity-80"
                }`}
                style={
                  !isActive("/create-event")
                    ? { color: "var(--text-secondary)" }
                    : undefined
                }
              >
                Create Event
              </Link>
              <Link
                href="/joined-events"
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive("/joined-events")
                    ? "bg-[#0f5338] text-white shadow-sm"
                    : "hover:opacity-80"
                }`}
                style={
                  !isActive("/joined-events")
                    ? { color: "var(--text-secondary)" }
                    : undefined
                }
              >
                Joined Events
              </Link>
            </>
          )}
        </nav>

        {/* Right Actions: Theme Toggle + Conditional Auth Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Theme Toggle Button (Challenge Requirement) */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            title={
              theme === "light"
                ? "Switch to Dark Theme"
                : "Switch to Light Theme"
            }
            className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all cursor-pointer hover:scale-105"
            style={{
              backgroundColor: "var(--bg-surface)",
              borderColor: "var(--border-subtle)",
              color: "var(--text-primary)",
            }}
          >
            {theme === "light" ? (
              <FiMoon className="w-4 h-4 text-[#0f5338]" />
            ) : (
              <FiSun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Conditional Login / Logged-in Profile Picture + Logout */}
          {!user ? (
            <Link href="/login" className="btn-uddog-primary text-sm">
              Login
            </Link>
          ) : (
            <div className="flex items-center gap-2.5">
              {/* Profile Picture with Hover Display Name & Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  title={displayName}
                  aria-label={`Profile menu for ${displayName}`}
                  className="group relative flex items-center gap-2 p-1 rounded-full border-2 transition-all cursor-pointer focus:outline-none"
                  style={{
                    borderColor: dropdownOpen
                      ? "var(--brand-primary)"
                      : "var(--border-strong)",
                    backgroundColor: "var(--bg-surface)",
                  }}
                >
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        displayName
                      )}&background=0F5338&color=ffffff&bold=true`;
                    }}
                    className="w-9 h-9 rounded-full object-cover"
                  />

                  {/* Hover Tooltip showing User's Display Name */}
                  <span
                    className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-lg text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-50"
                    style={{
                      backgroundColor: "#0f5338",
                      color: "#ffffff",
                    }}
                  >
                    {displayName}
                  </span>
                </button>

                {/* Dropdown Menu: Create Event, Manage Events, Joined Events, Profile */}
                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-3 w-64 rounded-2xl border p-2 shadow-xl z-50"
                    style={{
                      backgroundColor: "var(--bg-surface)",
                      borderColor: "var(--border-subtle)",
                    }}
                  >
                    <div
                      className="px-3.5 py-3 mb-1.5 rounded-xl border-b"
                      style={{
                        backgroundColor: "var(--bg-subtle)",
                        borderColor: "var(--border-subtle)",
                      }}
                    >
                      <p
                        className="text-sm font-bold truncate"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {displayName}
                      </p>
                      <p
                        className="text-xs truncate mt-0.5"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {user.email}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <Link
                        href="/create-event"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors hover:bg-[#0f5338]/10"
                        style={{ color: "var(--text-primary)" }}
                      >
                        <FiPlusCircle className="w-4 h-4 text-[#0f5338]" />
                        <span>Create Event</span>
                      </Link>

                      <Link
                        href="/manage-events"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors hover:bg-[#0f5338]/10"
                        style={{ color: "var(--text-primary)" }}
                      >
                        <FiSliders className="w-4 h-4 text-[#0f5338]" />
                        <span>Manage Events</span>
                      </Link>

                      <Link
                        href="/joined-events"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors hover:bg-[#0f5338]/10"
                        style={{ color: "var(--text-primary)" }}
                      >
                        <FiCheckCircle className="w-4 h-4 text-[#0f5338]" />
                        <span>Joined Events</span>
                      </Link>

                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors hover:bg-[#0f5338]/10"
                        style={{ color: "var(--text-primary)" }}
                      >
                        <FiUser className="w-4 h-4 text-[#0f5338]" />
                        <span>My Profile</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Explicit Logout Button in Navbar */}
              <button
                type="button"
                onClick={handleLogout}
                className="hidden sm:inline-flex btn-uddog-outline !py-2 !px-3.5 text-xs sm:text-sm"
              >
                <FiLogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center border"
            style={{
              backgroundColor: "var(--bg-surface)",
              borderColor: "var(--border-subtle)",
              color: "var(--text-primary)",
            }}
          >
            {mobileMenuOpen ? (
              <FiX className="w-5 h-5" />
            ) : (
              <FiMenu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-t px-4 pt-3 pb-5 space-y-2"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-subtle)",
          }}
        >
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Home
          </Link>
          <Link
            href="/upcoming-events"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Upcoming Events
          </Link>

          {user ? (
            <>
              <Link
                href="/create-event"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Create Event
              </Link>
              <Link
                href="/manage-events"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Manage Events
              </Link>
              <Link
                href="/joined-events"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Joined Events
              </Link>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                My Profile
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full mt-2 btn-uddog-outline text-sm justify-center"
              >
                <FiLogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full btn-uddog-primary text-sm justify-center"
            >
              Login to Uddog
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
