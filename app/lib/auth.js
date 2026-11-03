import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);

const configuredUrl = process.env.BETTER_AUTH_URL;
const isProd = process.env.NODE_ENV === "production";
const effectiveBaseURL =
  isProd && configuredUrl && configuredUrl.includes("localhost")
    ? undefined
    : configuredUrl;

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
  ...(effectiveBaseURL ? { baseURL: effectiveBaseURL } : {}),
});
