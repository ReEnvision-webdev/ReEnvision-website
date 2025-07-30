import db from "@/db/database";
import { usersTable } from "@/db/schema";
import { StandardResponse } from "@/lib/types";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  const { email, token } = await request.json();

  if (!email || !token) {
    const response: StandardResponse = {
      success: false,
      message: "Email or verification token is required",
      error: "Email or verification token is missing",
      data: null,
    };

    return NextResponse.json(response, {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const decodedEmail = decodeURIComponent(email);

  try {
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, decodedEmail));

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

    if (user.emailVerified) {
      const response: StandardResponse = {
        success: false,
        message: "Email is already verified",
        error: "Email is already verified",
        data: null,
      };

      return NextResponse.json(response, {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (
      user.emailVerificationKey &&
      user.emailVerificationKeyExpires!.getTime() < Date.now()
    ) {
      const response: StandardResponse = {
        success: false,
        message: "Verification token has expired",
        error: "Verification token has expired",
        data: null,
      };

      return NextResponse.json(response, {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (
      crypto.createHash("sha256").update(token).digest("hex") !==
      user.emailVerificationKey
    ) {
      const response: StandardResponse = {
        success: false,
        message: "Invalid verification token",
        error: "Invalid verification token",
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
        emailVerificationKey: null,
        emailVerificationKeyExpires: null,
        emailVerified: true,
      })
      .where(eq(usersTable.email, decodedEmail));

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error fetching user:", error);

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
