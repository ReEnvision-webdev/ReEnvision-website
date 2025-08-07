import db from "@/db/database";
import { usersTable } from "@/db/schema";
import { StandardResponse } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  const { email, password, token } = await request.json();

  if (!email || !password || !token) {
    const response: StandardResponse = {
      success: false,
      message: "Email, new password, or verification token is required",
      error: "Email, new password, or verification token is missing",
      data: null,
    };

    return NextResponse.json(response, {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (users.length === 0) {
      const response: StandardResponse = {
        success: false,
        message: "No user found with the provided email",
        error: "No user found with the provided email",
        data: null,
      };

      return NextResponse.json(response, {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user = users[0];

    if (user.resetKey && user.resetKeyExpires!.getTime() < Date.now()) {
      const response: StandardResponse = {
        success: false,
        message: "Reset token has expired",
        error: "Reset token has expired",
        data: null,
      };

      return NextResponse.json(response, {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (
      crypto.createHash("sha256").update(token).digest("hex") !== user.resetKey
    ) {
      const response: StandardResponse = {
        success: false,
        message: "Invalid reset token",
        error: "Invalid reset token",
        data: null,
      };

      return NextResponse.json(response, {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await db
      .update(usersTable)
      .set({
        password: await bcrypt.hash(password, 10),
        resetKey: null,
        resetKeyExpires: null,
        lastReset: new Date(),
      })
      .where(eq(usersTable.email, email));

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error checking for existing user:", error);

    const response: StandardResponse = {
      success: false,
      message: "Internal server error",
      error: "Internal server error",
      data: null,
    };

    return NextResponse.json(response, {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
