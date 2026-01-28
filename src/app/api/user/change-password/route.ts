import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import db from "@/db/database";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/auth.config";
import { StandardResponse } from "@/lib/types";
import { type Session } from "next-auth";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions) as Session | null;

  if (!session || !session.user) {
    const response: StandardResponse = {
      success: false,
      message: "Unauthorized",
      error: "You must be logged in to change your password",
      data: null,
    };

    return NextResponse.json(response, {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { oldPassword, newPassword } = await request.json();

  if (!oldPassword || !newPassword) {
    const response: StandardResponse = {
      success: false,
      message: "Old password and new password are required",
      error: "Missing required fields",
      data: null,
    };

    return NextResponse.json(response, {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Get the current user from the database using session user id
    const user = await db
      .select({
        id: usersTable.id,
        password: usersTable.password,
      })
      .from(usersTable)
      .where(eq(usersTable.id, session.user.id))
      .limit(1);

    if (user.length === 0) {
      const response: StandardResponse = {
        success: false,
        message: "User not found",
        error: "User not found",
        data: null,
      };

      return NextResponse.json(response, {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if the old password matches the stored password
    const isValidPassword = await bcrypt.compare(oldPassword, user[0].password);

    if (!isValidPassword) {
      const response: StandardResponse = {
        success: false,
        message: "Old password is incorrect",
        error: "Invalid old password",
        data: null,
      };

      return NextResponse.json(response, {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    await db
      .update(usersTable)
      .set({
        password: hashedNewPassword,
      })
      .where(eq(usersTable.id, session.user.id));

    const response: StandardResponse = {
      success: true,
      message: "Password updated successfully",
      error: null,
      data: null,
    };

    return NextResponse.json(response, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating password:", error);

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
