import Link from "next/link";
import { FiArrowLeft, FiCompass } from "react-icons/fi";

export default function NotFoundPage() {
  return (
    <section className="py-20">
      <div className="container-uddog">
        <div className="uddog-card p-10 sm:p-14 text-center max-w-xl mx-auto space-y-5">
          <span className="section-eyebrow">404 — Route Not Found</span>
          <h1 className="section-heading">
            This Community Page Has Moved or Does Not Exist
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            The link you followed may be outdated or the event may have been
            removed by its organizer. Return to the home page or browse active
            upcoming social development events.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/" className="btn-uddog-primary">
              <FiArrowLeft className="w-4 h-4" />
              <span>Return to Home</span>
            </Link>
            <Link href="/upcoming-events" className="btn-uddog-outline">
              <FiCompass className="w-4 h-4" />
              <span>Explore Upcoming Events</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
