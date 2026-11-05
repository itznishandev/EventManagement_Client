import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);

const effectiveBaseURL =
  process.env.BETTER_AUTH_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
  (process.env.NEXT_PUBLIC_APP_URL || "https://uddog-event.vercel.app");

export const auth = betterAuth({
  database: mongodbAdapter(client.db(process.env.MONGODB_DB || "uddog_events")),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      prompt: "select_account",
    },
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          },
        }
      : {}),
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: effectiveBaseURL,
  trustedOrigins: [
    "https://uddog-event.vercel.app",
    "https://uddog-event.netlify.app",
    "http://localhost:3000",
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
  ],
});
