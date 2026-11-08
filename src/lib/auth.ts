
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGODB_URI;
const databaseName = process.env.DATABASE_NAME || "booknook";

if (!mongoUri) {
  throw new Error("MONGODB_URI is missing");
}

const client = new MongoClient(mongoUri);
const db = client.db(databaseName);

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

  plugins: [
    jwt({
      jwt: {
        issuer: process.env.BETTER_AUTH_ISSUER,
        audience: process.env.BETTER_AUTH_AUDIENCE,
        expirationTime: "1d",

        definePayload: ({ user }) => ({
          email: user.email,
          name: user.name,
        }),
      },
    }),
  ],
});
