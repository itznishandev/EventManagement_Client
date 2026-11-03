"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  FiCalendar,
  FiMapPin,
  FiUsers,
  FiUser,
  FiMail,
  FiCheckCircle,
  FiArrowLeft,
  FiHeart,
  FiShare2,
} from "react-icons/fi";
import { useAuth } from "@/app/context/AuthContext";
import {
  apiRequest,
  formatEventDate,
  getDaysRemaining,
} from "@/app/lib/api";

export default function EventDetailsPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [joinedVolunteers, setJoinedVolunteers] = useState([]);
  const [hasJoined, setHasJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    async function loadEventDetails() {
      setLoading(true);
      setError("");
      try {
        const query = user?.email
          ? `?userEmail=${encodeURIComponent(user.email)}`
          : "";
        const data = await apiRequest(`/events/${id}${query}`);
        if (isMounted) {
          setEvent(data.event);
          setJoinedVolunteers(data.joinedVolunteers || []);
          setHasJoined(Boolean(data.hasJoined));
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Event could not be found.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadEventDetails();
    return () => {
      isMounted = false;
    };
  }, [id, user?.email]);

  const handleJoinEvent = async () => {
    if (!user) {
      toast.error("Please log in first to join this social service event.");
      router.push(`/login?callbackUrl=${encodeURIComponent(`/events/${id}`)}`);
      return;
    }

    if (hasJoined) {
      toast("You have already joined this event!", { icon: "✓" });
      return;
    }

    setJoining(true);
    try {
      const res = await apiRequest(`/events/${id}/join`, {
        method: "POST",
        body: JSON.stringify({
          userName: user.displayName || user.name || user.email.split("@")[0],
          userPhoto: user.photoURL || null,
        }),
      });

      setHasJoined(true);
      setEvent((prev) =>
        prev
          ? { ...prev, participantsCount: (prev.participantsCount || 0) + 1 }
          : prev
      );
      if (res?.joinedEvent) {
        setJoinedVolunteers((prev) => [res.joinedEvent, ...prev]);
      }

      toast.success("You have joined this community event!");
      await Swal.fire({
        icon: "success",
        title: "Joined Event Successfully!",
        text: `You are now registered as a volunteer for "${event.title}".`,
        timer: 2000,
        showConfirmButton: false,
        background: "var(--bg-surface)",
        color: "var(--text-primary)",
      });
    } catch (err) {
      toast.error(err.message || "Could not join event.");
    } finally {
      setJoining(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Event link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="container-uddog py-12 sm:py-16 space-y-6">
        <div className="h-8 w-44 rounded-lg skeleton-shimmer" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="h-96 w-full rounded-3xl skeleton-shimmer" />
            <div className="h-10 w-3/4 rounded-xl skeleton-shimmer" />
            <div className="h-32 w-full rounded-2xl skeleton-shimmer" />
          </div>
          <div className="lg:col-span-4">
            <div className="h-80 w-full rounded-3xl skeleton-shimmer" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container-uddog py-16">
        <div className="uddog-card p-10 text-center max-w-xl mx-auto space-y-4">
          <h1
            className="text-2xl font-extrabold"
            style={{ color: "var(--text-primary)" }}
          >
            Event Not Found
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {error || "This event may have been removed by its organizer."}
          </p>
          <Link href="/upcoming-events" className="btn-uddog-primary">
            <FiArrowLeft className="w-4 h-4" />
            <span>Back to Upcoming Events</span>
          </Link>
        </div>
      </div>
    );
  }

  const daysLeft = getDaysRemaining(event.eventDate);
  const currentCount = event.participantsCount || 0;
  const targetCount = event.targetVolunteers || 60;
  const progressPercent = Math.min(
    100,
    Math.round((currentCount / targetCount) * 100)
  );

  return (
    <section className="py-10 sm:py-14">
      <div className="container-uddog">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/upcoming-events"
            className="inline-flex items-center gap-2 text-sm font-bold hover:underline"
            style={{ color: "var(--brand-primary)" }}
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Back to Upcoming Events</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Main Event Detail Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="uddog-card overflow-hidden">
              {/* Hero Image */}
              <div className="relative h-72 sm:h-96 w-full overflow-hidden">
                <img
                  src={
                    event.thumbnail ||
                    "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=85"
                  }
                  alt={event.title}
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=85";
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#0f5338] text-white shadow">
                    {event.eventType}
                  </span>
                  {daysLeft && (
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-black/75 text-white backdrop-blur-sm">
                      {daysLeft}
                    </span>
                  )}
                </div>
              </div>

              {/* Event Content Body */}
              <div className="p-6 sm:p-9 space-y-6">
                <h1
                  className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  {event.title}
                </h1>

                {/* Key Metadata Chips */}
                <div
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl border"
                  style={{
                    backgroundColor: "var(--bg-elevated)",
                    borderColor: "var(--border-subtle)",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <FiCalendar className="w-5 h-5 mt-0.5 text-[#0f5338] shrink-0" />
                    <div>
                      <p
                        className="text-[11px] font-bold uppercase tracking-wider"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Scheduled Date
                      </p>
                      <p
                        className="text-sm font-bold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {formatEventDate(event.eventDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FiMapPin className="w-5 h-5 mt-0.5 text-[#0f5338] shrink-0" />
                    <div>
                      <p
                        className="text-[11px] font-bold uppercase tracking-wider"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Location
                      </p>
                      <p
                        className="text-sm font-bold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {event.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FiUsers className="w-5 h-5 mt-0.5 text-[#0f5338] shrink-0" />
                    <div>
                      <p
                        className="text-[11px] font-bold uppercase tracking-wider"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Field Impact Goal
                      </p>
                      <p
                        className="text-sm font-bold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {event.impactMetric || `${currentCount} Joined`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Detailed Description */}
                <div className="space-y-3">
                  <h2
                    className="text-lg font-extrabold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    About This Social Development Initiative
                  </h2>
                  <p
                    className="text-base leading-relaxed whitespace-pre-line"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {event.description}
                  </p>
                </div>

                {/* Organizer Card */}
                <div
                  className="pt-6 border-t flex flex-wrap items-center justify-between gap-4"
                  style={{ borderColor: "var(--border-subtle)" }}
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={
                        event.creatorPhoto ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          event.creatorName || "Organizer"
                        )}&background=0F5338&color=ffffff&bold=true`
                      }
                      alt={event.creatorName || "Organizer"}
                      className="w-12 h-12 rounded-full object-cover border"
                      style={{ borderColor: "var(--border-strong)" }}
                    />
                    <div>
                      <p
                        className="text-xs font-bold uppercase tracking-wider"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Event Organizer
                      </p>
                      <p
                        className="text-sm font-extrabold flex items-center gap-1.5"
                        style={{ color: "var(--text-primary)" }}
                      >
                        <FiUser className="w-3.5 h-3.5 text-[#0f5338]" />
                        <span>{event.creatorName || "Community Coordinator"}</span>
                      </p>
                      <p
                        className="text-xs flex items-center gap-1.5 mt-0.5"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <FiMail className="w-3.5 h-3.5" />
                        <span>{event.creatorEmail}</span>
                      </p>
                    </div>
                  </div>

                  {user?.email?.toLowerCase() ===
                    event.creatorEmail?.toLowerCase() && (
                    <Link
                      href="/manage-events"
                      className="btn-uddog-outline text-xs"
                    >
                      Manage My Event
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Action & Volunteer Participation Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="uddog-card p-6 sm:p-7 space-y-6">
              <div className="space-y-2">
                <span className="section-eyebrow">Volunteer Action</span>
                <h2
                  className="text-xl font-extrabold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Join This Community Drive
                </h2>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Anyone can view this event page publicly. Sign in with your
                  Uddog account to confirm your volunteer spot.
                </p>
              </div>

              {/* Volunteer Progress Bar */}
              <div
                className="p-4 rounded-2xl border space-y-2.5"
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  borderColor: "var(--border-subtle)",
                }}
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span style={{ color: "var(--text-secondary)" }}>
                    Volunteers Mobilized
                  </span>
                  <span style={{ color: "var(--brand-primary)" }}>
                    {currentCount} / {targetCount} spots
                  </span>
                </div>
                <div
                  className="w-full h-2.5 rounded-full overflow-hidden"
                  style={{ backgroundColor: "var(--bg-subtle)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progressPercent}%`,
                      backgroundColor: "#0f5338",
                    }}
                  />
                </div>
              </div>

              {/* Join Event Button */}
              {hasJoined ? (
                <div className="space-y-3">
                  <button
                    type="button"
                    disabled
                    className="btn-uddog-primary w-full justify-center py-3.5 !opacity-90"
                  >
                    <FiCheckCircle className="w-5 h-5" />
                    <span>Joined Event ✓</span>
                  </button>
                  <Link
                    href="/joined-events"
                    className="btn-uddog-outline w-full justify-center text-xs"
                  >
                    View in My Joined Events
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleJoinEvent}
                  disabled={joining}
                  className="btn-uddog-primary w-full justify-center py-3.5 text-base"
                >
                  <FiHeart className="w-5 h-5" />
                  <span>
                    {joining
                      ? "Confirming Participation..."
                      : "Join Event"}
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={handleShare}
                className="btn-uddog-outline w-full justify-center text-xs"
              >
                <FiShare2 className="w-4 h-4" />
                <span>Copy Event Link to Share</span>
              </button>

              {/* Recent Joined Volunteers Roster */}
              {joinedVolunteers.length > 0 && (
                <div
                  className="pt-5 border-t space-y-3"
                  style={{ borderColor: "var(--border-subtle)" }}
                >
                  <h3
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Recent Registered Volunteers
                  </h3>
                  <ul className="space-y-2.5">
                    {joinedVolunteers.slice(0, 5).map((vol, i) => (
                      <li
                        key={vol._id || i}
                        className="flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <img
                            src={
                              vol.userPhoto ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                vol.userName || "Volunteer"
                              )}&background=0F5338&color=ffffff&bold=true`
                            }
                            alt={vol.userName || "Volunteer"}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <span
                            className="font-bold truncate"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {vol.userName}
                          </span>
                        </div>
                        <span
                          className="text-[11px] font-medium shrink-0"
                          style={{ color: "var(--text-muted)" }}
                        >
                          Confirmed
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
