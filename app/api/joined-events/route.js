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

    const userEmail = authCheck.user.email.toLowerCase().trim();
    const { joinedEventsCollection } = await getCollections();

    const joinedEvents = await joinedEventsCollection
      .find({ userEmail })
      .sort({ eventDate: 1 })
      .toArray();

    return NextResponse.json(
      {
        success: true,
        count: joinedEvents.length,
        joinedEvents,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Failed to fetch joined events.",
      },
      { status: 500 }
    );
  }
}
