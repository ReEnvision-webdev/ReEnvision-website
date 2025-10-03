import db from "@/db/database";
import { usersTable } from "@/db/schema";
import { StandardResponse } from "@/lib/types";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  const { email, token, userId } = await request.json();

  if (!email || !token || !userId) {
    const response: StandardResponse = {
      success: false,
      message: "Email, verification token, and user ID are required",
      error: "Missing required parameters",
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
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (users.length === 0) {
      const response: StandardResponse = {
        success: false,
        message: "No user found with the provided ID",
        error: "Invalid user",
        data: null,
      };

      return NextResponse.json(response, {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user = users[0];

    // Check if user already has this email
    if (user.email === decodedEmail) {
      const response: StandardResponse = {
        success: false,
        message: "This is already your current email",
        error: "Email already verified",
        data: null,
      };

      return NextResponse.json(response, {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if there's a pending email update
    if (!user.newEmail || user.newEmail !== decodedEmail) {
      const response: StandardResponse = {
        success: false,
        message: "No pending email update found",
        error: "Invalid request",
        data: null,
      };

      return NextResponse.json(response, {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if verification token has expired
    if (
      !user.newEmailVerificationKeyExpires ||
      user.newEmailVerificationKeyExpires.getTime() < Date.now()
    ) {
      const response: StandardResponse = {
        success: false,
        message: "Verification token has expired",
        error: "Token expired",
        data: null,
      };

      return NextResponse.json(response, {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verify the token
    if (
      crypto.createHash("sha256").update(token).digest("hex") !==
      user.newEmailVerificationKey
    ) {
      const response: StandardResponse = {
        success: false,
        message: "Invalid verification token",
        error: "Invalid token",
        data: null,
      };

      return NextResponse.json(response, {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Update user's email and clear verification fields
    const updatedUsers = await db
      .update(usersTable)
      .set({
        email: decodedEmail,
        newEmail: null,
        newEmailVerificationKey: null,
        newEmailVerificationKeyExpires: null,
      })
      .where(eq(usersTable.id, userId))
      .returning({
        id: usersTable.id,
        email: usersTable.email,
        name: usersTable.name,
      });

    const updatedUser = updatedUsers[0];

    const response: StandardResponse = {
      success: true,
      message: "Email updated successfully",
      error: null,
      data: updatedUser,
    };

    return NextResponse.json(response, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error verifying email update:", error);

    const response: StandardResponse = {
      success: false,
      message: "Internal server error",
      error: "Something went wrong while verifying your email update",
      data: null,
    };

    return NextResponse.json(response, {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}