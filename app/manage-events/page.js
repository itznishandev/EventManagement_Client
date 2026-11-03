"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DatePicker from "react-datepicker";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  FiSliders,
  FiEdit3,
  FiTrash2,
  FiPlusCircle,
  FiMapPin,
  FiCalendar,
  FiUsers,
  FiX,
  FiCheck,
  FiEye,
} from "react-icons/fi";
import PrivateRoute from "@/app/components/PrivateRoute";
import EventSkeleton from "@/app/components/EventSkeleton";
import { useAuth } from "@/app/context/AuthContext";
import {
  apiRequest,
  EVENT_TYPES,
  formatEventDate,
} from "@/app/lib/api";

export default function ManageEventsPage() {
  const { user } = useAuth();
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Update Modal State
  const [editingEvent, setEditingEvent] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState("Donation");
  const [thumbnail, setThumbnail] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState(null);
  const [impactMetric, setImpactMetric] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [updating, setUpdating] = useState(false);

  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  tomorrow.setHours(9, 0, 0, 0);

  const fetchMyCreatedEvents = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const data = await apiRequest("/my-events");
      setMyEvents(data?.events || []);
    } catch (err) {
      toast.error(err.message || "Failed to load your created events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCreatedEvents();
  }, [user?.email]);

  const openEditModal = (ev) => {
    setEditingEvent(ev);
    setTitle(ev.title || "");
    setDescription(ev.description || "");
    setEventType(ev.eventType || "Donation");
    setThumbnail(ev.thumbnail || "");
    setLocation(ev.location || "");
    const parsed = ev.eventDate ? new Date(ev.eventDate) : tomorrow;
    setEventDate(parsed > new Date() ? parsed : tomorrow);
    setImpactMetric(ev.impactMetric || "");
    setFormErrors({});
  };

  const closeEditModal = () => {
    setEditingEvent(null);
    setFormErrors({});
  };

  const validateUpdateForm = () => {
    const errs = {};
    if (!title.trim() || title.trim().length < 5) {
      errs.title = "Event title must be at least 5 characters.";
    }
    if (!description.trim() || description.trim().length < 20) {
      errs.description = "Description must be at least 20 characters.";
    }
    if (!eventType) {
      errs.eventType = "Event type is required.";
    }
    if (!thumbnail.trim() || !/^https?:\/\/.+/i.test(thumbnail.trim())) {
      errs.thumbnail = "A valid HTTP/HTTPS thumbnail URL is required.";
    }
    if (!location.trim() || location.trim().length < 3) {
      errs.location = "Event location is required.";
    }
    if (!eventDate || !(eventDate instanceof Date) || Number.isNaN(eventDate.getTime())) {
      errs.eventDate = "Valid event date is required.";
    } else if (eventDate <= new Date()) {
      errs.eventDate = "Updated event date must be in the future.";
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingEvent) return;

    if (!validateUpdateForm()) {
      toast.error("Please fix the validation errors in the update form.");
      return;
    }

    setUpdating(true);
    try {
      const res = await apiRequest(`/events/${editingEvent._id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          eventType,
          thumbnail: thumbnail.trim(),
          location: location.trim(),
          eventDate: eventDate.toISOString(),
          impactMetric: impactMetric.trim(),
        }),
      });

      const updatedItem = res?.event || {
        ...editingEvent,
        title: title.trim(),
        description: description.trim(),
        eventType,
        thumbnail: thumbnail.trim(),
        location: location.trim(),
        eventDate: eventDate.toISOString(),
        impactMetric: impactMetric.trim(),
      };

      setMyEvents((prev) =>
        prev.map((item) =>
          item._id === editingEvent._id ? updatedItem : item
        )
      );

      closeEditModal();
      toast.success("Event details updated successfully!");
      await Swal.fire({
        icon: "success",
        title: "Event Updated!",
        text: "Your changes have been saved to the database.",
        timer: 1600,
        showConfirmButton: false,
        background: "var(--bg-surface)",
        color: "var(--text-primary)",
      });
    } catch (err) {
      toast.error(err.message || "Failed to update event.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteEvent = async (ev) => {
    const confirmResult = await Swal.fire({
      title: "Delete this event?",
      text: `"${ev.title}" and its volunteer registrations will be permanently removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#0f5338",
      confirmButtonText: "Yes, Delete Event",
      cancelButtonText: "Cancel",
      background: "var(--bg-surface)",
      color: "var(--text-primary)",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      await apiRequest(`/events/${ev._id}`, {
        method: "DELETE",
      });

      setMyEvents((prev) => prev.filter((item) => item._id !== ev._id));
      toast.success("Event deleted from your organizer listings.");
    } catch (err) {
      toast.error(err.message || "Could not delete event.");
    }
  };

  return (
    <PrivateRoute>
      <section className="py-12 sm:py-16">
        <div className="container-uddog">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="space-y-3">
              <span className="section-eyebrow">
                <FiSliders className="w-3.5 h-3.5" />
                <span>Organizer Control Center</span>
              </span>
              <h1 className="section-heading">Manage My Created Events</h1>
              <p className="section-subtitle">
                Review, update, or remove social service events that you have
                organized under <strong>{user?.email}</strong>.
              </p>
            </div>

            <Link href="/create-event" className="btn-uddog-primary shrink-0">
              <FiPlusCircle className="w-4 h-4" />
              <span>Create New Event</span>
            </Link>
          </div>

          {loading ? (
            <EventSkeleton count={3} />
          ) : myEvents.length === 0 ? (
            <div className="uddog-card p-12 text-center max-w-xl mx-auto space-y-4">
              <h2
                className="text-xl font-extrabold"
                style={{ color: "var(--text-primary)" }}
              >
                You haven&apos;t created any events yet
              </h2>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Organize your first community cleanup, tree plantation, or
                winter clothes drive to mobilize local volunteers.
              </p>
              <Link href="/create-event" className="btn-uddog-primary">
                <FiPlusCircle className="w-4 h-4" />
                <span>Create Your First Event</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myEvents.map((ev) => (
                <article
                  key={ev._id}
                  className="uddog-card h-full flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    <div className="relative h-52 w-full overflow-hidden">
                      <img
                        src={
                          ev.thumbnail ||
                          "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=80"
                        }
                        alt={ev.title}
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=80";
                        }}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3.5 left-3.5">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0f5338] text-white">
                          {ev.eventType}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <h2
                        className="text-lg font-extrabold leading-snug line-clamp-2 min-h-[3.1rem]"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {ev.title}
                      </h2>

                      <div
                        className="space-y-1.5 text-xs sm:text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <p className="flex items-center gap-2 font-medium">
                          <FiMapPin className="w-4 h-4 text-[#0f5338] shrink-0" />
                          <span className="truncate">{ev.location}</span>
                        </p>
                        <p className="flex items-center gap-2 font-medium">
                          <FiCalendar className="w-4 h-4 text-[#0f5338] shrink-0" />
                          <span>{formatEventDate(ev.eventDate)}</span>
                        </p>
                        <p className="flex items-center gap-2 font-medium">
                          <FiUsers className="w-4 h-4 text-[#0f5338] shrink-0" />
                          <span>
                            {ev.participantsCount || 0} volunteers registered
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Organizer Action Buttons */}
                  <div
                    className="px-6 pb-6 pt-3 border-t grid grid-cols-3 gap-2"
                    style={{ borderColor: "var(--border-subtle)" }}
                  >
                    <Link
                      href={`/events/${ev._id}`}
                      className="btn-uddog-outline !px-3 !py-2.5 text-xs justify-center"
                    >
                      <FiEye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => openEditModal(ev)}
                      className="btn-uddog-primary !px-3 !py-2.5 text-xs justify-center"
                    >
                      <FiEdit3 className="w-3.5 h-3.5" />
                      <span>Update</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteEvent(ev)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Update Event Modal */}
        {editingEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm overflow-y-auto">
            <div
              className="w-full max-w-2xl rounded-3xl border p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
              style={{
                backgroundColor: "var(--bg-surface)",
                borderColor: "var(--border-subtle)",
              }}
            >
              <div className="flex items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: "var(--border-subtle)" }}>
                <div>
                  <h2
                    className="text-xl font-extrabold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Update Event Information
                  </h2>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Modify details for &ldquo;{editingEvent.title}&rdquo;
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeEditModal}
                  aria-label="Close modal"
                  className="w-9 h-9 rounded-xl flex items-center justify-center border cursor-pointer"
                  style={{
                    borderColor: "var(--border-subtle)",
                    color: "var(--text-primary)",
                  }}
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={handleUpdateSubmit}
                noValidate
                className="space-y-4 pt-5"
              >
                <div>
                  <label
                    className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="uddog-input"
                  />
                  {formErrors.title && (
                    <p className="text-xs text-red-500 font-semibold mt-1">
                      {formErrors.title}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Event Type *
                    </label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="uddog-input"
                    >
                      {EVENT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Location *
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="uddog-input"
                    />
                    {formErrors.location && (
                      <p className="text-xs text-red-500 font-semibold mt-1">
                        {formErrors.location}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Future Event Date *
                    </label>
                    <DatePicker
                      selected={eventDate}
                      onChange={(date) => setEventDate(date)}
                      minDate={tomorrow}
                      dateFormat="MMMM d, yyyy"
                      className="uddog-input"
                    />
                    {formErrors.eventDate && (
                      <p className="text-xs text-red-500 font-semibold mt-1">
                        {formErrors.eventDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Impact Target
                    </label>
                    <input
                      type="text"
                      value={impactMetric}
                      onChange={(e) => setImpactMetric(e.target.value)}
                      className="uddog-input"
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Thumbnail Image URL *
                  </label>
                  <input
                    type="url"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    className="uddog-input"
                  />
                  {formErrors.thumbnail && (
                    <p className="text-xs text-red-500 font-semibold mt-1">
                      {formErrors.thumbnail}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Description *
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="uddog-input"
                  />
                  {formErrors.description && (
                    <p className="text-xs text-red-500 font-semibold mt-1">
                      {formErrors.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="btn-uddog-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="btn-uddog-primary"
                  >
                    <FiCheck className="w-4 h-4" />
                    <span>{updating ? "Saving Changes..." : "Save Update"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </PrivateRoute>
  );
}
