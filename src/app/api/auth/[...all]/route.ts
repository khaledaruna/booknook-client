
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { toNextJsHandler } from "better-auth/next-js";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db("booknook");

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [
    jwt({
      // Ensures JWT tokens contain necessary claims (sub, email, name)
      jwt: {
        definePayload: ({ user }) => ({
          sub: user.id,
          email: user.email,
          name: user.name,
        }),
      },
    }),
  ],
});

export const { GET, POST } = toNextJsHandler(auth);





