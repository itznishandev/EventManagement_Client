import { NextResponse } from "next/server";
import { getCollections } from "@/app/lib/mongodb";
import { verifyJwtRequest } from "@/app/lib/jwt";

export async function GET(request) {
  try {
    const authCheck = verifyJwtRequest(request);
    if (!authCheck.valid) {
      return NextResponse.json(
        { success: false, message: authCheck.error },
        { status: authCheck.status }
      );
    }

    const creatorEmail = authCheck.user.email.toLowerCase().trim();
    const { eventsCollection } = await getCollections();

    const myEvents = await eventsCollection
      .find({ creatorEmail })
      .sort({ eventDate: 1 })
      .toArray();

    return NextResponse.json(
      {
        success: true,
        count: myEvents.length,
        events: myEvents,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Failed to fetch your events.",
      },
      { status: 500 }
    );
  }
}
