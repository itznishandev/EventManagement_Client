import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getCollections } from "@/app/lib/mongodb";
import { verifyJwtRequest } from "@/app/lib/jwt";

export async function POST(request, context) {
  try {
    const authCheck = verifyJwtRequest(request);
    if (!authCheck.valid) {
      return NextResponse.json(
        { success: false, message: authCheck.error },
        { status: authCheck.status }
      );
    }

    const params = await context.params;
    const id = params.id;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid event ID." },
        { status: 400 }
      );
    }

    const userEmail = authCheck.user.email.toLowerCase().trim();
    const body = await request.json().catch(() => ({}));
    const { userName, userPhoto, note } = body || {};

    const { eventsCollection, joinedEventsCollection } = await getCollections();
    const event = await eventsCollection.findOne({ _id: new ObjectId(id) });

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found." },
        { status: 404 }
      );
    }

    const existingJoin = await joinedEventsCollection.findOne({
      eventId: id,
      userEmail,
    });

    if (existingJoin) {
      return NextResponse.json(
        {
          success: false,
          message: "You have already joined this event.",
        },
        { status: 409 }
      );
    }

    const joinRecord = {
      eventId: id,
      title: event.title,
      description: event.description,
      eventType: event.eventType,
      thumbnail: event.thumbnail,
      location: event.location,
      eventDate: event.eventDate,
      creatorEmail: event.creatorEmail,
      creatorName: event.creatorName,
      userEmail,
      userName: (
        userName ||
        authCheck.user.name ||
        userEmail.split("@")[0]
      ).trim(),
      userPhoto: userPhoto || null,
      note: note ? note.trim() : "",
      joinedAt: new Date().toISOString(),
    };

    await joinedEventsCollection.insertOne(joinRecord);
    await eventsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { participantsCount: 1 } }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Successfully joined the event!",
        joinedEvent: joinRecord,
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to join event." },
      { status: 500 }
    );
  }
}
