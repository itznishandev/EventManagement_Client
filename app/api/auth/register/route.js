import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getCollections } from "@/app/lib/mongodb";
import { signJwtToken } from "@/app/lib/jwt";

function validatePassword(password) {
  if (!password || typeof password !== "string" || password.length < 6) {
    return "Password must be at least 6 characters long.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }
  return null;
}

export async function POST(request) {
  try {
    const { name, email, photoURL, password } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: "Full name is required." },
        { status: 400 }
      );
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { success: false, message: "A valid email address is required." },
        { status: 400 }
      );
    }

    const passwordErr = validatePassword(password);
    if (passwordErr) {
      return NextResponse.json(
        { success: false, message: passwordErr },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const { usersCollection } = await getCollections();

    const existing = await usersCollection.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "An account with this email already exists.",
        },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name.trim()
    )}&background=0F5338&color=ffffff&bold=true`;

    const userDoc = {
      name: name.trim(),
      displayName: name.trim(),
      email: normalizedEmail,
      photoURL: photoURL && photoURL.trim() ? photoURL.trim() : defaultAvatar,
      passwordHash,
      provider: "credentials",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await usersCollection.insertOne(userDoc);
    const userPayload = {
      uid: result.insertedId.toString(),
      name: userDoc.name,
      displayName: userDoc.displayName,
      email: userDoc.email,
      photoURL: userDoc.photoURL,
    };

    const token = signJwtToken(userPayload);

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful!",
        user: userPayload,
        token,
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || "Registration failed." },
      { status: 500 }
    );
  }
}
