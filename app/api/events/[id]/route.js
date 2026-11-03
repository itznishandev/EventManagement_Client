import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getCollections } from "@/app/lib/mongodb";
import { verifyJwtRequest } from "@/app/lib/jwt";

function validateEventPayload(body) {
  const { title, description, eventType, thumbnail, location, eventDate } =
    body || {};

  if (!title || typeof title !== "string" || title.trim().length < 5) {
    return "Event title must be at least 5 characters long.";
  }
  if (
    !description ||
    typeof description !== "string" ||
    description.trim().length < 20
  ) {
    return "Event description must be at least 20 characters long.";
  }
  if (!eventType || typeof eventType !== "string" || !eventType.trim()) {
    return "Event type is required.";
  }
  if (
    !thumbnail ||
    typeof thumbnail !== "string" ||
    !/^https?:\/\/.+/i.test(thumbnail.trim())
  ) {
    return "A valid HTTP/HTTPS thumbnail image URL is required.";
  }
  if (!location || typeof location !== "string" || location.trim().length < 3) {
    return "Event location is required.";
  }
  if (!eventDate) {
    return "Event date is required.";
  }

  const parsedDate = new Date(eventDate);
  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid event date format.";
  }

  if (parsedDate <= new Date()) {
    return "Event date must be in the future. Past dates are not allowed.";
  }

  return null;
}

export async function GET(request, context) {
  try {
    const params = await context.params;
    const id = params.id;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid event ID format." },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get("userEmail");

    const { eventsCollection, joinedEventsCollection } = await getCollections();
    const event = await eventsCollection.findOne({ _id: new ObjectId(id) });

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found." },
        { status: 404 }
      );
    }

    const joinedVolunteers = await joinedEventsCollection
      .find({ eventId: id })
      .sort({ joinedAt: -1 })
      .limit(12)
      .toArray();

    let hasJoined = false;
    if (userEmail) {
      const existingJoin = await joinedEventsCollection.findOne({
        eventId: id,
        userEmail: userEmail.toLowerCase().trim(),
      });
      hasJoined = Boolean(existingJoin);
    }

    return NextResponse.json(
      {
        success: true,
        event,
        joinedVolunteers,
        hasJoined,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch event." },
      { status: 500 }
    );
  }
}

export async function PUT(request, context) {
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

    const { eventsCollection, joinedEventsCollection } = await getCollections();
    const existingEvent = await eventsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingEvent) {
      return NextResponse.json(
        { success: false, message: "Event not found." },
        { status: 404 }
      );
    }

    if (
      existingEvent.creatorEmail.toLowerCase() !==
      authCheck.user.email.toLowerCase()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden: You can only update events that you created.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validationErr = validateEventPayload(body);
    if (validationErr) {
      return NextResponse.json(
        { success: false, message: validationErr },
        { status: 400 }
      );
    }

    const {
      title,
      description,
      eventType,
      thumbnail,
      location,
      eventDate,
      targetVolunteers,
      impactMetric,
    } = body;

    const updatedFields = {
      title: title.trim(),
      description: description.trim(),
      eventType: eventType.trim(),
      thumbnail: thumbnail.trim(),
      location: location.trim(),
      eventDate: new Date(eventDate).toISOString(),
      targetVolunteers:
        Number(targetVolunteers) > 0
          ? Number(targetVolunteers)
          : existingEvent.targetVolunteers || 50,
      impactMetric:
        impactMetric?.trim() ||
        existingEvent.impactMetric ||
        "Community Action Drive",
      updatedAt: new Date().toISOString(),
    };

    await eventsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedFields }
    );

    await joinedEventsCollection.updateMany(
      { eventId: id },
      {
        $set: {
          title: updatedFields.title,
          description: updatedFields.description,
          eventType: updatedFields.eventType,
          thumbnail: updatedFields.thumbnail,
          location: updatedFields.location,
          eventDate: updatedFields.eventDate,
        },
      }
    );

    const updatedEvent = await eventsCollection.findOne({
      _id: new ObjectId(id),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Event updated successfully!",
        event: updatedEvent,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update event." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
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

    const { eventsCollection, joinedEventsCollection } = await getCollections();
    const existingEvent = await eventsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingEvent) {
      return NextResponse.json(
        { success: false, message: "Event not found." },
        { status: 404 }
      );
    }

    if (
      existingEvent.creatorEmail.toLowerCase() !==
      authCheck.user.email.toLowerCase()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden: You can only delete events that you created.",
        },
        { status: 403 }
      );
    }

    await eventsCollection.deleteOne({ _id: new ObjectId(id) });
    await joinedEventsCollection.deleteMany({ eventId: id });

    return NextResponse.json(
      {
        success: true,
        message: "Event deleted successfully.",
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to delete event." },
      { status: 500 }
    );
  }
}
