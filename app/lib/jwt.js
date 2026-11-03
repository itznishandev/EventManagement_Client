import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "uddog_jwt_secret_key_2026_b14a8_hermione_secure";

export function signJwtToken(payload) {
  return jwt.sign(
    {
      email: payload.email.toLowerCase().trim(),
      name: payload.name || payload.displayName || "",
      uid: payload.uid || payload._id?.toString() || "",
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyJwtRequest(request) {
  const authHeader =
    request.headers.get("authorization") || request.headers.get("Authorization");
  let token = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else {
    const cookieToken = request.cookies?.get?.("uddog_token")?.value;
    if (cookieToken) {
      token = cookieToken;
    }
  }

  if (!token) {
    return {
      valid: false,
      status: 401,
      error: "Unauthorized access: JWT token is required.",
    };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return {
      valid: true,
      user: decoded,
    };
  } catch (err) {
    return {
      valid: false,
      status: 403,
      error: "Forbidden access: Invalid or expired JWT token.",
    };
  }
}
