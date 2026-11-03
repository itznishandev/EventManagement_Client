"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      const target = pathname ? `?callbackUrl=${encodeURIComponent(pathname)}` : "";
      router.replace(`/login${target}`);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="container-uddog py-16 min-h-[65vh]">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-9 w-64 rounded-xl skeleton-shimmer" />
          <div className="h-5 w-96 max-w-full rounded-lg skeleton-shimmer" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="h-64 rounded-2xl skeleton-shimmer" />
            <div className="h-64 rounded-2xl skeleton-shimmer" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return children;
}
