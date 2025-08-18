import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    isAdmin?: boolean;
  }

  interface Session {
    user: {
      id?: string;
      name?: string;
      email?: string;
      image?: string;
      isAdmin?: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isAdmin?: boolean;
  }
}
