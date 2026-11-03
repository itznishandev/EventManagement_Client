"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiArrowRight, FiRefreshCw } from "react-icons/fi";
import { apiRequest } from "@/app/lib/api";
import EventCard from "@/app/components/EventCard";
import EventSkeleton from "@/app/components/EventSkeleton";

export default function RecentEventsSection() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRecentUpcoming = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest("/events/upcoming/recent");
      setEvents(data?.events || []);
    } catch (err) {
      setError(err.message || "Unable to load recent upcoming events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentUpcoming();
  }, []);

  return (
    <section
      className="py-16 sm:py-20 border-y transition-colors"
      style={{
        backgroundColor: "var(--bg-elevated)",
        borderColor: "var(--border-subtle)",
      }}
    >
      <div className="container-uddog">
        {/* Consistent Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <span className="section-eyebrow">Live Community Schedule</span>
            <h2 className="section-heading">Recent Upcoming Events</h2>
            <p className="section-subtitle">
              Showing the 6 nearest upcoming social service drives scheduled by
              community organizers across Bangladesh.
            </p>
          </div>

          <div>
            <Link href="/upcoming-events" className="btn-uddog-primary">
              <span>View All Upcoming Events</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Dynamic 3-Column Grid or Loading Skeletons */}
        {loading ? (
          <EventSkeleton count={6} />
        ) : error ? (
          <div className="uddog-card p-8 text-center space-y-4">
            <p
              className="text-base font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {error}
            </p>
            <button
              type="button"
              onClick={fetchRecentUpcoming}
              className="btn-uddog-primary"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span>Retry Loading Events</span>
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="uddog-card p-10 text-center space-y-4">
            <h3
              className="text-xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              No upcoming events found right now
            </h3>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Be the first to schedule a local community drive in your area.
            </p>
            <Link href="/create-event" className="btn-uddog-primary">
              Create First Event
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.slice(0, 6).map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
