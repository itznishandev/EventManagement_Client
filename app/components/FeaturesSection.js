"use client";

import {
  FiCalendar,
  FiShield,
  FiUsers,
  FiTrendingUp,
} from "react-icons/fi";

const FEATURES = [
  {
    icon: FiCalendar,
    tag: "01 / Organize",
    title: "Future-Verified Event Scheduling",
    description:
      "Launch neighbourhood cleanups, tree plantations, or winter donation drives with built-in future-date validation and clear ward-level location mapping.",
  },
  {
    icon: FiUsers,
    tag: "02 / Mobilize",
    title: "One-Click Volunteer Enrollment",
    description:
      "Citizens can browse public upcoming events without friction and join any local drive with a single click, syncing attendance directly to their personal roster.",
  },
  {
    icon: FiShield,
    tag: "03 / Accountability",
    title: "JWT-Protected Creator Controls",
    description:
      "Every event is tied to its organizer's verified account with strict JWT authorization, ensuring only the creator can update schedules or remove listings.",
  },
  {
    icon: FiTrendingUp,
    tag: "04 / Track Impact",
    title: "Chronological Participation Ledger",
    description:
      "Track every social service drive you have joined in a date-sorted timeline alongside real-time volunteer counts and measurable field targets.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-uddog">
        {/* Consistent Section Header */}
        <div className="max-w-2xl space-y-3 mb-12">
          <span className="section-eyebrow">How Uddog Works</span>
          <h2 className="section-heading">
            Built for grassroots organizers and local volunteers
          </h2>
          <p className="section-subtitle">
            Every tool on Uddog is designed to remove logistical friction so
            communities can focus on on-the-ground social development.
          </p>
        </div>

        {/* Equal Height 4-Column Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.title}
                className="uddog-card p-6 h-full flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{
                        backgroundColor: "var(--brand-primary-soft)",
                        color: "var(--brand-primary)",
                      }}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span
                      className="text-xs font-bold tracking-wider uppercase"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {item.tag}
                    </span>
                  </div>

                  <h3
                    className="text-lg font-extrabold leading-snug"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.title}
                  </h3>

                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {item.description}
                  </p>
                </div>

                <div
                  className="pt-4 mt-6 border-t flex items-center justify-between text-xs font-semibold"
                  style={{
                    borderColor: "var(--border-subtle)",
                    color: "var(--brand-primary)",
                  }}
                >
                  <span>Verified Civic Workflow</span>
                  <span>→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
