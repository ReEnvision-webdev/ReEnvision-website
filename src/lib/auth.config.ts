import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/db/database";
import { usersTable } from "@/db/schema";
import bcrypt from "bcryptjs";
import { and, eq } from "drizzle-orm";
import { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";

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
            .selectDistinct()
            .from(usersTable)
            .where(and(eq(usersTable.email, email)))
            .limit(1);

          const user = users[0];

          if (!user) {
            throw new CredentialError("User not found");
          } else if (!(await bcrypt.compare(password, user.password))) {
            throw new CredentialError("Invalid password");
          } else if (user.isBanned) {
            throw new CredentialError("User is banned");
          } else if (!user.emailVerified) {
            throw new CredentialError("Email is not verified");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin,
          };
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
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        session.user.id = token.userId as string;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
    async jwt({ token, user }: { token: JWT; user: User }) {
      if (user) {
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
  },
};
