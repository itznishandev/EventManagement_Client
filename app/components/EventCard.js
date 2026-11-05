"use client";

import Link from "next/link";
import { FiMapPin, FiCalendar, FiUsers, FiArrowRight } from "react-icons/fi";
import { formatEventDate, getDaysRemaining } from "@/app/lib/api";

const TYPE_STYLES = {
  Donation: { bg: "#dff0e7", text: "#0f5338" },
  Cleanup: { bg: "#e0f2fe", text: "#0369a1" },
  Plantation: { bg: "#dcfce7", text: "#15803d" },
  "Medical Camp": { bg: "#fae8ff", text: "#86198f" },
  Education: { bg: "#fef3c7", text: "#b45309" },
  "Flood Relief": { bg: "#ffedd5", text: "#c2410c" },
  "Blood Donation": { bg: "#fee2e2", text: "#b91c1c" },
};

export default function EventCard({ event }) {
  const id = event._id || event.eventId;
  const badgeColor = TYPE_STYLES[event.eventType] || {
    bg: "#dff0e7",
    text: "#0f5338",
  };
  const daysLeft = getDaysRemaining(event.eventDate);

  return (
    <article className="uddog-card h-full flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Uniform Aspect Ratio Thumbnail (h-56 across all grid cards) */}
        <div className="relative h-56 w-full overflow-hidden bg-emerald-950/10">
          <img
            src={
              event.thumbnail ||
              "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=80"
            }
            alt={event.title}
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=80";
            }}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Event Type Pill */}
          <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm"
              style={{
                backgroundColor: badgeColor.bg,
                color: badgeColor.text,
              }}
            >
              {event.eventType || "Social Service"}
            </span>
          </div>

          {/* Days Remaining Pill */}
          {daysLeft && (
            <div className="absolute top-3.5 right-3.5">
              <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-black/75 text-white backdrop-blur-sm">
                {daysLeft}
              </span>
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-6 space-y-3.5">
          <h3
            className="text-lg font-extrabold leading-snug line-clamp-2 min-h-[3.1rem]"
            style={{ color: "var(--text-primary)" }}
          >
            {event.title}
          </h3>

          {event.description && (
            <p
              className="text-xs sm:text-sm leading-relaxed line-clamp-2 min-h-[2.7rem]"
              style={{ color: "var(--text-secondary)" }}
            >
              {event.description}
            </p>
          )}

          <div
            className="space-y-2 pt-1 text-xs sm:text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            <div className="flex items-center gap-2">
              <FiMapPin className="w-4 h-4 shrink-0 text-brand" />
              <span className="truncate font-medium">{event.location}</span>
            </div>

            <div className="flex items-center gap-2">
              <FiCalendar className="w-4 h-4 shrink-0 text-brand" />
              <span className="font-medium">
                {formatEventDate(event.eventDate)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <FiUsers className="w-4 h-4 shrink-0 text-brand" />
              <span className="truncate">
                <strong style={{ color: "var(--text-primary)" }}>
                  {event.participantsCount || 0}
                </strong>{" "}
                volunteers joined
                {event.impactMetric ? ` • ${event.impactMetric}` : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div
        className="px-6 pb-6 pt-3 border-t flex items-center justify-between gap-3"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <Link
          href={`/events/${id}`}
          className="btn-uddog-primary w-full text-sm"
        >
          <span>View Event</span>
          <FiArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}
