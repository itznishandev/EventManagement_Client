import { NextResponse } from "next/server";
import { getCollections } from "@/app/lib/mongodb";
import { signJwtToken } from "@/app/lib/jwt";

export async function POST(request) {
  try {
    const { email, name, photoURL, provider = "google" } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const cleanName = name?.trim() || normalizedEmail.split("@")[0];
    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      cleanName
    )}&background=0F5338&color=ffffff&bold=true`;

    const { usersCollection } = await getCollections();
    const existing = await usersCollection.findOne({ email: normalizedEmail });

    let userPayload;
    if (existing) {
      const updatedName = existing.displayName || existing.name || cleanName;
      const updatedPhoto = existing.photoURL || photoURL || defaultAvatar;
      await usersCollection.updateOne(
        { _id: existing._id },
        {
          $set: {
            name: updatedName,
            displayName: updatedName,
            photoURL: updatedPhoto,
            updatedAt: new Date().toISOString(),
          },
        }
      );
      userPayload = {
        uid: existing._id.toString(),
        name: updatedName,
        displayName: updatedName,
        email: normalizedEmail,
        photoURL: updatedPhoto,
      };
    } else {
      const newDoc = {
        name: cleanName,
        displayName: cleanName,
        email: normalizedEmail,
        photoURL: photoURL || defaultAvatar,
        provider,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const result = await usersCollection.insertOne(newDoc);
      userPayload = {
        uid: result.insertedId.toString(),
        name: newDoc.name,
        displayName: newDoc.displayName,
        email: newDoc.email,
        photoURL: newDoc.photoURL,
      };
    }

    const token = signJwtToken(userPayload);
    return NextResponse.json(
      { success: true, user: userPayload, token },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || "Social login sync failed." },
      { status: 500 }
    );
  }
}
