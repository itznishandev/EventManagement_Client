import { NextResponse } from "next/server";
import { signJwtToken } from "@/app/lib/jwt";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name, uid } = body || {};

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required to generate JWT token." },
        { status: 400 }
      );
    }

    const token = signJwtToken({ email, name, uid });
    return NextResponse.json({ success: true, token }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to generate token" },
      { status: 500 }
    );
  }
}
