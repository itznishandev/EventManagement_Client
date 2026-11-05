import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getCollections } from "@/app/lib/mongodb";
import { signJwtToken } from "@/app/lib/jwt";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const { usersCollection } = await getCollections();

    const userDoc = await usersCollection.findOne({ email: normalizedEmail });

    if (!userDoc || !userDoc.passwordHash) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password. Please check your credentials.",
        },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, userDoc.passwordHash);
    if (!valid) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password. Please check your credentials.",
        },
        { status: 401 }
      );
    }

    const userPayload = {
      uid: userDoc._id.toString(),
      name: userDoc.displayName || userDoc.name,
      displayName: userDoc.displayName || userDoc.name,
      email: userDoc.email,
      photoURL: userDoc.photoURL || null,
    };

    const token = signJwtToken(userPayload);

    return NextResponse.json(
      {
        success: true,
        message: "Logged in successfully!",
        user: userPayload,
        token,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || "Login failed." },
      { status: 500 }
    );
  }
}
