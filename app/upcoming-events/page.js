"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FiSearch,
  FiFilter,
  FiCalendar,
  FiPlusCircle,
  FiX,
} from "react-icons/fi";
import { apiRequest, EVENT_TYPES } from "@/app/lib/api";
import EventCard from "@/app/components/EventCard";
import EventSkeleton from "@/app/components/EventSkeleton";

function UpcomingEventsContent() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get("eventType") || "All";

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState(initialType);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchTerm.trim()) params.set("search", searchTerm.trim());
        if (selectedType && selectedType !== "All") {
          params.set("eventType", selectedType);
        }
        params.set("sort", sortOrder);

        const data = await apiRequest(`/events?${params.toString()}`);
        if (isMounted) {
          setEvents(data?.events || []);
        }
      } catch (err) {
        console.error("Failed to load upcoming events:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }, 180);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchTerm, selectedType, sortOrder]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedType("All");
    setSortOrder("asc");
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="container-uddog">
        {/* Page Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-3">
            <span className="section-eyebrow">
              <FiCalendar className="w-3.5 h-3.5" />
              <span>Public Event Directory</span>
            </span>
            <h1 className="section-heading">Upcoming Social Service Events</h1>
            <p className="section-subtitle">
              Browse verified future community drives across Bangladesh. Filter
              by category or search by neighbourhood to join an upcoming
              initiative.
            </p>
          </div>

          <Link href="/create-event" className="btn-uddog-primary shrink-0">
            <FiPlusCircle className="w-4 h-4" />
            <span>Host New Event</span>
          </Link>
        </div>

        {/* Search, Category Filter & Sort Toolbar */}
        <div className="uddog-card p-5 sm:p-6 mb-10 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <FiSearch
                className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-muted)" }}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by event title or location (e.g. Mirpur, Dhanmondi)..."
                aria-label="Search upcoming events"
                className="uddog-input !pl-11 !pr-10"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 cursor-pointer"
                  style={{ color: "var(--text-muted)" }}
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Event Type Dropdown */}
            <div className="md:col-span-3 relative">
              <FiFilter
                className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-muted)" }}
              />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                aria-label="Filter by event type"
                className="uddog-input !pl-11"
              >
                <option value="All">All Event Types</option>
                {EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Sort Order */}
            <div className="md:col-span-3">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                aria-label="Sort events by date"
                className="uddog-input"
              >
                <option value="asc">Date: Soonest Upcoming</option>
                <option value="desc">Date: Furthest Upcoming</option>
              </select>
            </div>
          </div>

          {/* Quick Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t" style={{ borderColor: "var(--border-subtle)" }}>
            <div className="flex flex-wrap items-center gap-2">
              {["All", ...EVENT_TYPES].map((type) => {
                const active = selectedType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      active
                        ? "bg-[#0f5338] text-white shadow-sm"
                        : "hover:opacity-80"
                    }`}
                    style={
                      !active
                        ? {
                            backgroundColor: "var(--bg-subtle)",
                            color: "var(--text-secondary)",
                          }
                        : undefined
                    }
                  >
                    {type}
                  </button>
                );
              })}
            </div>

            <span
              className="text-xs font-bold"
              style={{ color: "var(--text-muted)" }}
            >
              {loading
                ? "Loading upcoming events..."
                : `${events.length} upcoming event${
                    events.length === 1 ? "" : "s"
                  } available`}
            </span>
          </div>
        </div>

        {/* Events Grid or Skeleton Loader */}
        {loading ? (
          <EventSkeleton count={6} />
        ) : events.length === 0 ? (
          <div className="uddog-card p-12 text-center max-w-xl mx-auto space-y-4">
            <h2
              className="text-xl font-extrabold"
              style={{ color: "var(--text-primary)" }}
            >
              No matching upcoming events found
            </h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              We couldn&apos;t find any future events matching your current
              search or category filter. Try clearing the filters or launch a
              new event in your area.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={resetFilters}
                className="btn-uddog-outline"
              >
                Reset All Filters
              </button>
              <Link href="/create-event" className="btn-uddog-primary">
                Create an Event
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function UpcomingEventsPage() {
  return (
    <Suspense
      fallback={
        <div className="container-uddog py-16">
          <EventSkeleton count={6} />
        </div>
      }
    >
      <UpcomingEventsContent />
    </Suspense>
  );
}
