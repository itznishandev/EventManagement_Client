import { NextResponse } from "next/server";
import { getCollections } from "@/app/lib/mongodb";
import { ensureUpcomingSeedEvents } from "@/app/lib/seedData";
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

export async function GET(request) {
  try {
    await ensureUpcomingSeedEvents();
    const { eventsCollection } = await getCollections();
    const nowISO = new Date().toISOString();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const eventType = searchParams.get("eventType") || "";
    const sort = searchParams.get("sort") || "asc";

    const query = {
      eventDate: { $gte: nowISO },
    };

    if (eventType && eventType !== "All" && eventType.trim() !== "") {
      query.eventType = eventType.trim();
    }

    if (search && search.trim() !== "") {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { title: { $regex: escaped, $options: "i" } },
        { location: { $regex: escaped, $options: "i" } },
        { description: { $regex: escaped, $options: "i" } },
      ];
    }

    const sortOrder = sort === "desc" ? -1 : 1;

    const events = await eventsCollection
      .find(query)
      .sort({ eventDate: sortOrder })
      .toArray();

    return NextResponse.json(
      {
        success: true,
        count: events.length,
        events,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Failed to fetch upcoming events.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const authCheck = verifyJwtRequest(request);
    if (!authCheck.valid) {
      return NextResponse.json(
        { success: false, message: authCheck.error },
        { status: authCheck.status }
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
      creatorName,
      creatorPhoto,
      targetVolunteers,
      impactMetric,
    } = body;

    const { eventsCollection } = await getCollections();

    const newEvent = {
      title: title.trim(),
      description: description.trim(),
      eventType: eventType.trim(),
      thumbnail: thumbnail.trim(),
      location: location.trim(),
      eventDate: new Date(eventDate).toISOString(),
      creatorEmail: authCheck.user.email.toLowerCase().trim(),
      creatorName: (
        creatorName ||
        authCheck.user.name ||
        authCheck.user.email.split("@")[0]
      ).trim(),
      creatorPhoto: creatorPhoto || null,
      participantsCount: 0,
      targetVolunteers:
        Number(targetVolunteers) > 0 ? Number(targetVolunteers) : 50,
      impactMetric: impactMetric?.trim() || "Community Action Drive",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await eventsCollection.insertOne(newEvent);

    return NextResponse.json(
      {
        success: true,
        message: "Event created successfully!",
        event: {
          ...newEvent,
          _id: result.insertedId,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Failed to create event.",
      },
      { status: 500 }
    );
  }
}
