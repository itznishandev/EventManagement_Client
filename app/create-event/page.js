"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  FiCalendar,
  FiMapPin,
  FiImage,
  FiType,
  FiAlignLeft,
  FiTag,
  FiPlusCircle,
  FiUserCheck,
} from "react-icons/fi";
import PrivateRoute from "@/app/components/PrivateRoute";
import { useAuth } from "@/app/context/AuthContext";
import { apiRequest, EVENT_TYPES, formatEventDate } from "@/app/lib/api";

const SAMPLE_THUMBNAILS = [
  {
    label: "Winter Clothes Drive",
    url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=85",
  },
  {
    label: "Canal & Lake Cleanup",
    url: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=1000&q=85",
  },
  {
    label: "Sapling Plantation",
    url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=85",
  },
  {
    label: "Medical Camp",
    url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1000&q=85",
  },
];

export default function CreateEventPage() {
  const { user } = useAuth();
  const router = useRouter();

  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  tomorrow.setHours(9, 0, 0, 0);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState("Donation");
  const [thumbnail, setThumbnail] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );
  const [targetVolunteers, setTargetVolunteers] = useState(50);
  const [impactMetric, setImpactMetric] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const nextErrors = {};
    if (!title.trim() || title.trim().length < 5) {
      nextErrors.title = "Event title must be at least 5 characters.";
    }
    if (!description.trim() || description.trim().length < 20) {
      nextErrors.description =
        "Please provide a meaningful description (minimum 20 characters).";
    }
    if (!eventType) {
      nextErrors.eventType = "Please select an event category.";
    }
    if (!thumbnail.trim() || !/^https?:\/\/.+/i.test(thumbnail.trim())) {
      nextErrors.thumbnail =
        "Please enter a valid HTTP/HTTPS thumbnail image URL.";
    }
    if (!location.trim() || location.trim().length < 3) {
      nextErrors.location =
        "Please enter a specific location (e.g., Mirpur 10, Dhaka).";
    }
    if (!eventDate || !(eventDate instanceof Date) || Number.isNaN(eventDate.getTime())) {
      nextErrors.eventDate = "Please choose a valid event date.";
    } else if (eventDate <= new Date()) {
      nextErrors.eventDate =
        "Event date must be in the future. Past dates cannot be added.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the validation errors before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      await apiRequest("/events", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          eventType,
          thumbnail: thumbnail.trim(),
          location: location.trim(),
          eventDate: eventDate.toISOString(),
          creatorEmail: user.email,
          creatorName: user.displayName || user.name || user.email.split("@")[0],
          creatorPhoto: user.photoURL || null,
          targetVolunteers: Number(targetVolunteers) || 50,
          impactMetric: impactMetric.trim() || `${eventType} Community Drive`,
        }),
      });

      toast.success("Social development event published!");
      await Swal.fire({
        icon: "success",
        title: "Event Created Successfully!",
        text: "Your community service event is now live on the Upcoming Events board.",
        timer: 1800,
        showConfirmButton: false,
        background: "var(--bg-surface)",
        color: "var(--text-primary)",
      });

      router.push("/upcoming-events");
    } catch (err) {
      toast.error(err.message || "Failed to create event.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PrivateRoute>
      <section className="py-12 sm:py-16">
        <div className="container-uddog">
          {/* Page Header */}
          <div className="max-w-2xl space-y-3 mb-10">
            <span className="section-eyebrow">Organizer Workspace</span>
            <h1 className="section-heading">Create a Social Service Event</h1>
            <p className="section-subtitle">
              Publish a local community initiative in your neighbourhood. All
              scheduled events require a future date and verified organizer
              account.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Form Card */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="lg:col-span-8 uddog-card p-6 sm:p-9 space-y-5"
            >
              {/* Organizer Identity Read-Only Banner */}
              <div
                className="p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3"
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  borderColor: "var(--border-subtle)",
                }}
              >
                <div className="flex items-center gap-3">
                  <FiUserCheck className="w-5 h-5 text-brand" />
                  <div>
                    <p
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Verified Event Creator
                    </p>
                    <p
                      className="text-sm font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {user?.displayName || user?.name} ({user?.email})
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-soft">
                  JWT Authenticated
                </span>
              </div>

              {/* Event Title */}
              <div>
                <label
                  htmlFor="event-title"
                  className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Event Title *
                </label>
                <div className="relative">
                  <FiType
                    className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <input
                    id="event-title"
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (errors.title) setErrors({ ...errors, title: "" });
                    }}
                    placeholder="e.g. Winter Clothes Distribution – Mirpur 10, Dhaka"
                    className="uddog-input !pl-11"
                  />
                </div>
                {errors.title && (
                  <p className="text-xs text-red-500 font-semibold mt-1">
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Event Type & Location Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="event-type"
                    className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Event Type *
                  </label>
                  <div className="relative">
                    <FiTag
                      className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2"
                      style={{ color: "var(--text-muted)" }}
                    />
                    <select
                      id="event-type"
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="uddog-input !pl-11"
                    >
                      {EVENT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="event-location"
                    className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Event Location *
                  </label>
                  <div className="relative">
                    <FiMapPin
                      className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2"
                      style={{ color: "var(--text-muted)" }}
                    />
                    <input
                      id="event-location"
                      type="text"
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        if (errors.location)
                          setErrors({ ...errors, location: "" });
                      }}
                      placeholder="e.g. Mirpur 10, Dhaka"
                      className="uddog-input !pl-11"
                    />
                  </div>
                  {errors.location && (
                    <p className="text-xs text-red-500 font-semibold mt-1">
                      {errors.location}
                    </p>
                  )}
                </div>
              </div>

              {/* Event Date (Future Dates Only via React DatePicker) & Target Goal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="event-date"
                    className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Event Date (Future Only) *
                  </label>
                  <div className="relative">
                    <DatePicker
                      id="event-date"
                      selected={eventDate}
                      onChange={(date) => {
                        setEventDate(date);
                        if (errors.eventDate)
                          setErrors({ ...errors, eventDate: "" });
                      }}
                      minDate={tomorrow}
                      dateFormat="MMMM d, yyyy"
                      placeholderText="Select a future date"
                      className="uddog-input"
                    />
                  </div>
                  {errors.eventDate && (
                    <p className="text-xs text-red-500 font-semibold mt-1">
                      {errors.eventDate}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="event-impact"
                    className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Impact Target (Optional)
                  </label>
                  <input
                    id="event-impact"
                    type="text"
                    value={impactMetric}
                    onChange={(e) => setImpactMetric(e.target.value)}
                    placeholder="e.g. 300 Warm Blankets / 200 Saplings"
                    className="uddog-input"
                  />
                </div>
              </div>

              {/* Thumbnail Image URL + Quick Presets */}
              <div>
                <label
                  htmlFor="event-thumbnail"
                  className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Thumbnail Image URL *
                </label>
                <div className="relative">
                  <FiImage
                    className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <input
                    id="event-thumbnail"
                    type="url"
                    value={thumbnail}
                    onChange={(e) => {
                      setThumbnail(e.target.value);
                      if (errors.thumbnail)
                        setErrors({ ...errors, thumbnail: "" });
                    }}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="uddog-input !pl-11"
                  />
                </div>
                {errors.thumbnail && (
                  <p className="text-xs text-red-500 font-semibold mt-1">
                    {errors.thumbnail}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-2 mt-2.5">
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Quick Presets:
                  </span>
                  {SAMPLE_THUMBNAILS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setThumbnail(preset.url);
                        setErrors({ ...errors, thumbnail: "" });
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer hover:border-[#0f5338]"
                      style={{
                        backgroundColor: "var(--bg-elevated)",
                        borderColor: "var(--border-subtle)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Event Description */}
              <div>
                <label
                  htmlFor="event-description"
                  className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Event Description & Volunteer Instructions *
                </label>
                <div className="relative">
                  <FiAlignLeft
                    className="w-4 h-4 absolute left-4 top-4"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <textarea
                    id="event-description"
                    rows={4}
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      if (errors.description)
                        setErrors({ ...errors, description: "" });
                    }}
                    placeholder="Describe the assembly point, schedule, supplies provided, and how volunteers will assist..."
                    className="uddog-input !pl-11"
                  />
                </div>
                {errors.description && (
                  <p className="text-xs text-red-500 font-semibold mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-uddog-primary w-full justify-center py-3.5 text-base"
              >
                <FiPlusCircle className="w-5 h-5" />
                <span>
                  {submitting
                    ? "Publishing Event..."
                    : "Publish Social Development Event"}
                </span>
              </button>
            </form>

            {/* Right Live Preview Card */}
            <div className="lg:col-span-4 space-y-4">
              <div className="uddog-card overflow-hidden">
                <div
                  className="px-5 py-3 border-b text-xs font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: "var(--bg-subtle)",
                    borderColor: "var(--border-subtle)",
                    color: "var(--text-secondary)",
                  }}
                >
                  Live Event Card Preview
                </div>

                <div className="h-48 w-full overflow-hidden bg-emerald-950/10">
                  <img
                    src={
                      thumbnail && /^https?:\/\/.+/i.test(thumbnail)
                        ? thumbnail
                        : "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=80"
                    }
                    alt="Event preview"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=80";
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-5 space-y-3">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-brand-soft">
                    {eventType || "Donation"}
                  </span>
                  <h3
                    className="text-lg font-extrabold leading-snug"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {title.trim() ||
                      "Winter Clothes Distribution – Mirpur 10, Dhaka"}
                  </h3>
                  <p
                    className="text-xs line-clamp-3"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {description.trim() ||
                      "Your event description and assembly guidelines will appear here for community volunteers."}
                  </p>
                  <div
                    className="pt-2 border-t space-y-1.5 text-xs"
                    style={{
                      borderColor: "var(--border-subtle)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <p className="flex items-center gap-2 font-medium">
                      <FiMapPin className="w-3.5 h-3.5 text-brand" />
                      <span>{location.trim() || "Mirpur 10, Dhaka"}</span>
                    </p>
                    <p className="flex items-center gap-2 font-medium">
                      <FiCalendar className="w-3.5 h-3.5 text-brand" />
                      <span>
                        {eventDate
                          ? formatEventDate(eventDate.toISOString())
                          : "Future Date"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PrivateRoute>
  );
}
