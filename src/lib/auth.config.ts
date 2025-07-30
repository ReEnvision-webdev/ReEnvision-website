import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/db/database";
import { usersTable } from "@/db/schema";
import bcrypt from "bcryptjs";
import { and, eq } from "drizzle-orm";

class CredentialError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CredentialError";
  }
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const { email, password } = credentials || {};

        if (!email || !password) {
          throw new CredentialError("Email and password are required");
        }

        try {
          const users = await db
            .selectDistinct({
              id: usersTable.id,
              email: usersTable.email,
              name: usersTable.name,
              password: usersTable.password,
            })
            .from(usersTable)
            .where(
              and(
                eq(usersTable.email, email),
                eq(usersTable.emailVerified, true),
                eq(usersTable.isBanned, false)
              ),
            )
            .limit(1);

          const user = users[0];

          if (!user) {
            throw new CredentialError("User not found");
          }

          if (await bcrypt.compare(password, user.password)) {
            return user;
          } else {
            throw new CredentialError("Invalid password");
          }
        } catch (error) {
          if (error instanceof CredentialError) {
            throw error;
          }

          console.error("Error during authorization:", error);
          throw new Error("Internal server error");
        }
      },
    }),
  ],
};
