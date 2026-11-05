"use client";

export default function EventSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="uddog-card overflow-hidden h-full flex flex-col justify-between"
        >
          <div>
            <div className="h-56 w-full skeleton-shimmer" />
            <div className="p-6 space-y-3.5">
              <div className="h-6 w-4/5 rounded-lg skeleton-shimmer" />
              <div className="h-5 w-3/5 rounded-lg skeleton-shimmer" />
              <div className="space-y-2 pt-2">
                <div className="h-4 w-2/3 rounded skeleton-shimmer" />
                <div className="h-4 w-1/2 rounded skeleton-shimmer" />
                <div className="h-4 w-3/4 rounded skeleton-shimmer" />
              </div>
            </div>
          </div>
          <div
            className="px-6 pb-6 pt-3 border-t"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <div className="h-11 w-full rounded-xl skeleton-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
