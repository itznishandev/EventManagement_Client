"use client";

import Link from "next/link";
import {
  FaXTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa6";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiArrowUpRight,
  FiArrowUp,
  FiShield,
  FiHeart,
  FiCheckCircle,
} from "react-icons/fi";

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer
      className="relative border-t mt-16 sm:mt-24 lg:mt-28 transition-colors"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border-subtle)",
      }}
    >
      {/* Top Gradient Highlight Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#0f5338] dark:via-[#2bc485] to-transparent opacity-70" />

      {/* Floating Centered "Back to Top" Pill */}
      <div className="absolute -top-4.5 left-1/2 -translate-x-1/2 z-10">
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-strong)",
            color: "var(--text-secondary)",
          }}
        >
          <FiArrowUp className="w-3.5 h-3.5 text-brand" />
          <span>Back to Top</span>
        </button>
      </div>

      <div className="container-uddog pt-16 sm:pt-20 pb-12 sm:pb-14">
        {/* Top Civic Trust Highlights Bar */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 mb-12 border-b"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <div className="flex items-start gap-3.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: "var(--brand-primary-soft)",
                color: "var(--brand-primary)",
              }}
            >
              <FiCheckCircle className="w-5 h-5 text-brand" />
            </div>
            <div>
              <h4
                className="text-sm font-extrabold"
                style={{ color: "var(--text-primary)" }}
              >
                100% Grassroots & Civic
              </h4>
              <p
                className="text-xs leading-relaxed mt-0.5"
                style={{ color: "var(--text-secondary)" }}
              >
                Community-driven volunteer initiatives with zero commercial
                sponsorship bias.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: "var(--brand-primary-soft)",
                color: "var(--brand-primary)",
              }}
            >
              <FiShield className="w-5 h-5 text-brand" />
            </div>
            <div>
              <h4
                className="text-sm font-extrabold"
                style={{ color: "var(--text-primary)" }}
              >
                JWT-Protected Ownership
              </h4>
              <p
                className="text-xs leading-relaxed mt-0.5"
                style={{ color: "var(--text-secondary)" }}
              >
                Secure organizer authentication and verified volunteer
                attendance rosters.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: "var(--brand-primary-soft)",
                color: "var(--brand-primary)",
              }}
            >
              <FiHeart className="w-5 h-5 text-brand" />
            </div>
            <div>
              <h4
                className="text-sm font-extrabold"
                style={{ color: "var(--text-primary)" }}
              >
                Measurable Civic Impact
              </h4>
              <p
                className="text-xs leading-relaxed mt-0.5"
                style={{ color: "var(--text-secondary)" }}
              >
                Documented winter distributions, lake cleanups, and urban
                plantations across Bangladesh.
              </p>
            </div>
          </div>
        </div>

        {/* Main 4-Column Footer Navigation Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
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
                  className="text-[11px] font-semibold tracking-widest uppercase mt-1 text-brand"
                >
                  Civic Action Network
                </span>
              </div>
            </Link>

            <p
              className="text-sm leading-relaxed max-w-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              Uddog connects neighbourhood volunteers, youth collectives, and
              civic organizers across Bangladesh to launch, join, and track
              measurable community service initiatives.
            </p>

            {/* Social Media Icons with New X Logo (UI Design Requirement) */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Uddog on X"
                className="w-10 h-10 rounded-xl border flex items-center justify-center transition-all hover:bg-[#0f5338] hover:text-white hover:border-[#0f5338] hover:scale-105"
                style={{
                  borderColor: "var(--border-subtle)",
                  color: "var(--text-primary)",
                  backgroundColor: "var(--bg-elevated)",
                }}
              >
                <FaXTwitter className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Uddog on Facebook"
                className="w-10 h-10 rounded-xl border flex items-center justify-center transition-all hover:bg-[#0f5338] hover:text-white hover:border-[#0f5338] hover:scale-105"
                style={{
                  borderColor: "var(--border-subtle)",
                  color: "var(--text-primary)",
                  backgroundColor: "var(--bg-elevated)",
                }}
              >
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Uddog on LinkedIn"
                className="w-10 h-10 rounded-xl border flex items-center justify-center transition-all hover:bg-[#0f5338] hover:text-white hover:border-[#0f5338] hover:scale-105"
                style={{
                  borderColor: "var(--border-subtle)",
                  color: "var(--text-primary)",
                  backgroundColor: "var(--bg-elevated)",
                }}
              >
                <FaLinkedinIn className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Uddog on Instagram"
                className="w-10 h-10 rounded-xl border flex items-center justify-center transition-all hover:bg-[#0f5338] hover:text-white hover:border-[#0f5338] hover:scale-105"
                style={{
                  borderColor: "var(--border-subtle)",
                  color: "var(--text-primary)",
                  backgroundColor: "var(--bg-elevated)",
                }}
              >
                <FaInstagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Platform Navigation */}
          <div className="lg:col-span-2 space-y-3.5">
            <h3
              className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
              style={{ color: "var(--text-primary)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#0f5338]" />
              <span>Platform</span>
            </h3>
            <ul
              className="space-y-2.5 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              <li>
                <Link
                  href="/"
                  className="hover:underline transition-colors hover:text-brand"
                >
                  Home Overview
                </Link>
              </li>
              <li>
                <Link
                  href="/upcoming-events"
                  className="hover:underline transition-colors hover:text-brand"
                >
                  Upcoming Events
                </Link>
              </li>
              <li>
                <Link
                  href="/create-event"
                  className="hover:underline transition-colors hover:text-brand"
                >
                  Create an Event
                </Link>
              </li>
              <li>
                <Link
                  href="/manage-events"
                  className="hover:underline transition-colors hover:text-brand"
                >
                  Manage My Events
                </Link>
              </li>
              <li>
                <Link
                  href="/joined-events"
                  className="hover:underline transition-colors hover:text-brand"
                >
                  Joined Drives
                </Link>
              </li>
            </ul>
          </div>

          {/* Focus Categories */}
          <div className="lg:col-span-3 space-y-3.5">
            <h3
              className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
              style={{ color: "var(--text-primary)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#0f5338]" />
              <span>Action Sectors</span>
            </h3>
            <ul
              className="space-y-2.5 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              <li>
                <Link
                  href="/upcoming-events?eventType=Donation"
                  className="hover:underline flex items-center justify-between group"
                >
                  <span className="group-hover:text-brand transition-colors">
                    Winter Clothes & Blanket Drives
                  </span>
                  <FiArrowUpRight className="w-3.5 h-3.5 text-brand shrink-0" />
                </Link>
              </li>
              <li>
                <Link
                  href="/upcoming-events?eventType=Cleanup"
                  className="hover:underline flex items-center justify-between group"
                >
                  <span className="group-hover:text-brand transition-colors">
                    Canal & Lake Plastic Cleanup
                  </span>
                  <FiArrowUpRight className="w-3.5 h-3.5 text-brand shrink-0" />
                </Link>
              </li>
              <li>
                <Link
                  href="/upcoming-events?eventType=Plantation"
                  className="hover:underline flex items-center justify-between group"
                >
                  <span className="group-hover:text-brand transition-colors">
                    Urban & Coastal Tree Plantation
                  </span>
                  <FiArrowUpRight className="w-3.5 h-3.5 text-brand shrink-0" />
                </Link>
              </li>
              <li>
                <Link
                  href="/upcoming-events?eventType=Medical+Camp"
                  className="hover:underline flex items-center justify-between group"
                >
                  <span className="group-hover:text-brand transition-colors">
                    Community Health & Vision Camps
                  </span>
                  <FiArrowUpRight className="w-3.5 h-3.5 text-brand shrink-0" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Coordination Desk */}
          <div className="lg:col-span-3 space-y-3.5">
            <h3
              className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
              style={{ color: "var(--text-primary)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#0f5338]" />
              <span>Dhaka Field Office</span>
            </h3>
            <ul
              className="space-y-3 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              <li className="flex items-start gap-2.5">
                <FiMapPin className="w-4 h-4 mt-1 shrink-0 text-brand" />
                <span>
                  House 42, Road 27, Dhanmondi R/A, Dhaka 1209, Bangladesh
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiPhone className="w-4 h-4 shrink-0 text-brand" />
                <span>+880 1711-482910 (Volunteer Desk)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiMail className="w-4 h-4 shrink-0 text-brand" />
                <span>dispatch@uddog.org.bd</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Attribution Bar */}
        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p>
              © {new Date().getFullYear()} Uddog Civic Action Platform. All
              community drives verified for local social impact.
            </p>
          </div>
          <div className="flex items-center gap-6 font-medium">
            <Link
              href="/upcoming-events"
              className="hover:underline transition-colors hover:text-brand"
            >
              Volunteer Charter
            </Link>
            <Link
              href="/login"
              className="hover:underline transition-colors hover:text-brand"
            >
              Organizer Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
