import { NextResponse } from "next/server";
import { getCollections } from "@/app/lib/mongodb";
import { ensureUpcomingSeedEvents } from "@/app/lib/seedData";

export async function GET() {
  try {
    await ensureUpcomingSeedEvents();
    const { eventsCollection } = await getCollections();
    const nowISO = new Date().toISOString();

    const recentEvents = await eventsCollection
      .find({ eventDate: { $gte: nowISO } })
      .sort({ eventDate: 1 })
      .limit(6)
      .toArray();

    return NextResponse.json(
      {
        success: true,
        count: recentEvents.length,
        events: recentEvents,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Failed to fetch recent upcoming events.",
      },
      { status: 500 }
    );
  }
}
