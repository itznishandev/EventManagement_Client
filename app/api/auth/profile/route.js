import { NextResponse } from "next/server";
import { getCollections } from "@/app/lib/mongodb";
import { verifyJwtRequest, signJwtToken } from "@/app/lib/jwt";

export async function PUT(request) {
  try {
    const authCheck = verifyJwtRequest(request);
    if (!authCheck.valid) {
      return NextResponse.json(
        { success: false, message: authCheck.error },
        { status: authCheck.status }
      );
    }

    const email = authCheck.user.email.toLowerCase().trim();
    const { name, displayName, photoURL } = await request.json();
    const finalName = (displayName || name || "").trim();

    if (!finalName || finalName.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Display name must be at least 2 characters long.",
        },
        { status: 400 }
      );
    }

    const { usersCollection, eventsCollection, joinedEventsCollection } =
      await getCollections();

    const updateFields = {
      name: finalName,
      displayName: finalName,
      updatedAt: new Date().toISOString(),
    };
    if (typeof photoURL === "string" && photoURL.trim()) {
      updateFields.photoURL = photoURL.trim();
    }

    await usersCollection.updateOne(
      { email },
      { $set: updateFields },
      { upsert: true }
    );

    const creatorUpdate = { creatorName: finalName };
    if (updateFields.photoURL) {
      creatorUpdate.creatorPhoto = updateFields.photoURL;
    }
    await eventsCollection.updateMany(
      { creatorEmail: email },
      { $set: creatorUpdate }
    );

    const participantUpdate = { userName: finalName };
    if (updateFields.photoURL) {
      participantUpdate.userPhoto = updateFields.photoURL;
    }
    await joinedEventsCollection.updateMany(
      { userEmail: email },
      { $set: participantUpdate }
    );

    const updatedUser = await usersCollection.findOne({ email });
    const userPayload = {
      uid: updatedUser?._id?.toString() || authCheck.user.uid || "",
      name: finalName,
      displayName: finalName,
      email,
      photoURL: updateFields.photoURL || updatedUser?.photoURL || null,
    };

    const token = signJwtToken(userPayload);

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully!",
        user: userPayload,
        token,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || "Profile update failed." },
      { status: 500 }
    );
  }
}
