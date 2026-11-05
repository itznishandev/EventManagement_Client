"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { FiMail, FiSend, FiCheckCircle } from "react-icons/fi";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [district, setDistrict] = useState("Dhaka North & South");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Please enter a valid email address to subscribe.");
      return;
    }
    toast.success(
      `Subscribed to weekly civic dispatches for ${district}!`
    );
    setEmail("");
  };

  return (
    <section className="pt-14 pb-16 sm:pt-18 sm:pb-24">
      <div className="container-uddog">
        <div
          className="rounded-3xl border p-8 sm:p-12 lg:p-14 relative overflow-hidden"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-subtle)",
            boxShadow: "var(--card-shadow)",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="section-eyebrow">
                <FiMail className="w-3.5 h-3.5" />
                <span>Weekly Civic Dispatch</span>
              </span>

              <h2 className="section-heading">
                Never Miss a Local Drive in Your Area
              </h2>

              <p className="section-subtitle">
                Get a curated Thursday morning briefing of upcoming weekend
                cleanups, tree plantations, and winter distribution drives near
                your ward. Zero spam, only actionable community schedules.
              </p>

              <div
                className="flex flex-wrap items-center gap-4 pt-1 text-xs font-semibold"
                style={{ color: "var(--text-secondary)" }}
              >
                <span className="inline-flex items-center gap-1.5">
                  <FiCheckCircle className="w-4 h-4 text-brand" />
                  <span>Verified Ward Organizers</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <FiCheckCircle className="w-4 h-4 text-brand" />
                  <span>Thursday Morning Digest</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <FiCheckCircle className="w-4 h-4 text-brand" />
                  <span>One-Click Unsubscribe</span>
                </span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <form
                onSubmit={handleSubscribe}
                className="p-6 rounded-2xl border space-y-4"
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  borderColor: "var(--border-subtle)",
                }}
              >
                <div>
                  <label
                    htmlFor="newsletter-district"
                    className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Preferred Action Zone
                  </label>
                  <select
                    id="newsletter-district"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="uddog-input text-sm"
                  >
                    <option value="Dhaka North & South">
                      Dhaka (Mirpur, Mohammadpur, Dhanmondi, Uttara)
                    </option>
                    <option value="Chattogram Metro">
                      Chattogram Metropolitan & Coastal Belt
                    </option>
                    <option value="Sylhet & Haor Basin">
                      Sylhet & Sunamganj Flood Response Zone
                    </option>
                    <option value="Khulna & Sundarbans">
                      Khulna & Coastal Mangrove Belt
                    </option>
                    <option value="Rajshahi & Rangpur">
                      Rajshahi & Northern Winter Relief Zone
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="newsletter-email"
                    className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Your Email Address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="volunteer@example.com"
                    className="uddog-input text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-uddog-primary w-full justify-center"
                >
                  <FiSend className="w-4 h-4" />
                  <span>Subscribe to Weekly Dispatch</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
