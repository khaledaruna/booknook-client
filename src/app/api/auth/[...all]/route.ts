import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";
// Connect directly to MongoDB for Better Auth internal tables
const uri = process.env.MONGODB_URI || "your_mongodb_connection_string";
const client = new MongoClient(uri);
const db = client.db("booknook"); // Match your database name

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
});

export const { GET, POST } = toNextJsHandler(auth);