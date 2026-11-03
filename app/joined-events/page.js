"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiCheckCircle,
  FiCalendar,
  FiMapPin,
  FiArrowRight,
  FiCompass,
} from "react-icons/fi";
import PrivateRoute from "@/app/components/PrivateRoute";
import EventSkeleton from "@/app/components/EventSkeleton";
import { useAuth } from "@/app/context/AuthContext";
import {
  apiRequest,
  formatEventDate,
  getDaysRemaining,
} from "@/app/lib/api";

export default function JoinedEventsPage() {
  const { user } = useAuth();
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    let isMounted = true;

    async function fetchJoined() {
      setLoading(true);
      try {
        const data = await apiRequest("/joined-events");
        const list = (data?.joinedEvents || []).slice().sort((a, b) => {
          return (
            new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
          );
        });
        if (isMounted) {
          setJoinedEvents(list);
        }
      } catch (err) {
        console.error("Failed to load joined events:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchJoined();
    return () => {
      isMounted = false;
    };
  }, [user?.email]);

  return (
    <PrivateRoute>
      <section className="py-12 sm:py-16">
        <div className="container-uddog">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="space-y-3">
              <span className="section-eyebrow">
                <FiCheckCircle className="w-3.5 h-3.5" />
                <span>Volunteer Participation Ledger</span>
              </span>
              <h1 className="section-heading">My Joined Events</h1>
              <p className="section-subtitle">
                All social service initiatives you have registered to attend,
                sorted chronologically by upcoming event date.
              </p>
            </div>

            <Link href="/upcoming-events" className="btn-uddog-primary shrink-0">
              <FiCompass className="w-4 h-4" />
              <span>Browse More Events</span>
            </Link>
          </div>

          {loading ? (
            <EventSkeleton count={3} />
          ) : joinedEvents.length === 0 ? (
            <div className="uddog-card p-12 text-center max-w-xl mx-auto space-y-4">
              <h2
                className="text-xl font-extrabold"
                style={{ color: "var(--text-primary)" }}
              >
                You haven&apos;t joined any events yet
              </h2>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Explore upcoming community drives in your area and click
                &ldquo;Join Event&rdquo; to build your volunteer schedule.
              </p>
              <Link href="/upcoming-events" className="btn-uddog-primary">
                Explore Upcoming Events
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {joinedEvents.map((item, idx) => {
                const eventId = item.eventId || item._id;
                const daysLeft = getDaysRemaining(item.eventDate);

                return (
                  <article
                    key={item._id || `${eventId}-${idx}`}
                    className="uddog-card h-full flex flex-col justify-between overflow-hidden group"
                  >
                    <div>
                      <div className="relative h-52 w-full overflow-hidden">
                        <img
                          src={
                            item.thumbnail ||
                            "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=80"
                          }
                          alt={item.title}
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=80";
                          }}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0f5338] text-white">
                            {item.eventType || "Community Drive"}
                          </span>
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900">
                            Joined ✓
                          </span>
                        </div>
                        {daysLeft && (
                          <div className="absolute top-3.5 right-3.5">
                            <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-black/75 text-white">
                              {daysLeft}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-6 space-y-3">
                        <div
                          className="inline-flex items-center gap-1.5 text-xs font-bold"
                          style={{ color: "var(--brand-primary)" }}
                        >
                          <FiCalendar className="w-3.5 h-3.5" />
                          <span>
                            Event Date: {formatEventDate(item.eventDate)}
                          </span>
                        </div>

                        <h2
                          className="text-lg font-extrabold leading-snug line-clamp-2 min-h-[3.1rem]"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {item.title}
                        </h2>

                        <p
                          className="text-xs sm:text-sm flex items-center gap-2 font-medium"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          <FiMapPin className="w-4 h-4 text-[#0f5338] shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </p>

                        {item.joinedAt && (
                          <p
                            className="text-xs"
                            style={{ color: "var(--text-muted)" }}
                          >
                            Registered on {formatEventDate(item.joinedAt)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div
                      className="px-6 pb-6 pt-3 border-t"
                      style={{ borderColor: "var(--border-subtle)" }}
                    >
                      <Link
                        href={`/events/${eventId}`}
                        className="btn-uddog-primary w-full justify-center text-sm"
                      >
                        <span>View Event Details</span>
                        <FiArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </PrivateRoute>
  );
}
