
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
            .select({
              id: usersTable.id,
              email: usersTable.email,
              name: usersTable.name,
              password: usersTable.password,
              isAdmin: usersTable.isAdmin,
              isBanned: usersTable.isBanned,
              emailVerified: usersTable.emailVerified,
              isVerified: usersTable.isVerified,
              profilePicture: usersTable.profilePicture,
            })
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
            profilePicture: user.profilePicture,
            isAdmin: user.isAdmin,
            isVerified: user.isVerified,
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
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.isAdmin = user.isAdmin;
        token.isVerified = user.isVerified;
      } else if (token.id) {
        const dbUser = await db
          .select({
            id: usersTable.id,
            email: usersTable.email,
            name: usersTable.name,
            profilePicture: usersTable.profilePicture,
            isAdmin: usersTable.isAdmin,
            isVerified: usersTable.isVerified,
          })
          .from(usersTable)
          .where(eq(usersTable.id, token.id as string))
          .limit(1);
        
        if (dbUser[0]) {
          token.name = dbUser[0].name;
          token.email = dbUser[0].email;
          token.profilePicture = dbUser[0].profilePicture;
          token.isAdmin = dbUser[0].isAdmin;
          token.isVerified = dbUser[0].isVerified;
        }
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.profilePicture = token.profilePicture as string | undefined;
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.isVerified = token.isVerified as boolean;
      }
      return session;
    },
  },
};
