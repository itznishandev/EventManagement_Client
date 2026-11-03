"use client";

import Link from "next/link";
import {
  FiArrowRight,
  FiPlusCircle,
  FiMapPin,
  FiCheckCircle,
  FiUsers,
  FiHeart,
} from "react-icons/fi";

export default function HeroBanner() {
  return (
    <section
      className="relative overflow-hidden border-b py-12 sm:py-16 lg:py-20 transition-colors"
      style={{
        backgroundColor: "var(--bg-hero-tint)",
        borderColor: "var(--border-subtle)",
      }}
    >
      <div className="container-uddog">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Editorial Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="section-eyebrow">
              <span className="w-2 h-2 rounded-full bg-[#0f5338] animate-pulse" />
              <span>Grassroots Social Development Across Bangladesh</span>
            </div>

            <h1
              className="text-3xl sm:text-5xl lg:text-[3.35rem] font-extrabold tracking-tight leading-[1.12]"
              style={{ color: "var(--text-primary)" }}
            >
              Mobilize your neighbourhood for{" "}
              <span style={{ color: "var(--brand-primary)" }}>
                real civic action.
              </span>
            </h1>

            <p
              className="text-base sm:text-lg leading-relaxed max-w-2xl"
              style={{ color: "var(--text-secondary)" }}
            >
              From winter clothes distribution at Mirpur 10 and blanket drives
              in Mohammadpur to canal cleanups in Dhanmondi and coastal
              mangrove plantations in Khulna—Uddog brings local citizens
              together to organize, join, and track community service events.
            </p>

            {/* Primary CTA Buttons (Consistent Home Page Button Style) */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link href="/upcoming-events" className="btn-uddog-primary">
                <span>Explore Upcoming Events</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/create-event" className="btn-uddog-outline">
                <FiPlusCircle className="w-4 h-4" />
                <span>Create an Event</span>
              </Link>
            </div>

            {/* Verified Impact Metrics Bar */}
            <div
              className="grid grid-cols-3 gap-4 pt-6 border-t max-w-xl"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              <div>
                <p
                  className="text-2xl sm:text-3xl font-extrabold"
                  style={{ color: "var(--text-primary)" }}
                >
                  4,820+
                </p>
                <p
                  className="text-xs sm:text-sm font-medium mt-0.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  Active Volunteers
                </p>
              </div>
              <div>
                <p
                  className="text-2xl sm:text-3xl font-extrabold"
                  style={{ color: "var(--brand-primary)" }}
                >
                  190+
                </p>
                <p
                  className="text-xs sm:text-sm font-medium mt-0.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  Local Drives Completed
                </p>
              </div>
              <div>
                <p
                  className="text-2xl sm:text-3xl font-extrabold"
                  style={{ color: "var(--text-primary)" }}
                >
                  28
                </p>
                <p
                  className="text-xs sm:text-sm font-medium mt-0.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  Thanas & Districts
                </p>
              </div>
            </div>
          </div>

          {/* Right Field Dispatch Visual Card */}
          <div className="lg:col-span-5">
            <div
              className="rounded-3xl border p-4 sm:p-5 shadow-xl relative"
              style={{
                backgroundColor: "var(--bg-surface)",
                borderColor: "var(--border-subtle)",
              }}
            >
              <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=85"
                  alt="Volunteers packing winter relief clothes in Dhaka"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0f5338] text-white">
                    Featured Dhaka Drive
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-[#14221c]">
                    Registration Open
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
                    <FiMapPin className="w-3.5 h-3.5" />
                    <span>Mirpur 10 & Mohammadpur, Dhaka</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold leading-snug">
                    Winter Clothes & Thermal Blanket Distribution
                  </h2>
                </div>
              </div>

              {/* Bottom Field Briefing Strip */}
              <div className="mt-4 pt-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: "var(--brand-primary-soft)",
                      color: "var(--brand-primary)",
                    }}
                  >
                    <FiHeart className="w-5 h-5" />
                  </div>
                  <div>
                    <p
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Verified Community Impact
                    </p>
                    <p
                      className="text-sm font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      850+ Warm Kits Ready for Dispatch
                    </p>
                  </div>
                </div>
                <Link
                  href="/upcoming-events"
                  className="btn-uddog-primary !py-2 !px-4 text-xs"
                >
                  Join Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
