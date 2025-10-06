import db from "@/db/database";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const GET = async (req: NextRequest) => {
  try {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Token is required" },
        { status: 400 }
      );
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.newEmailVerificationKey, hashedToken));

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 400 }
      );
    }

    if (user.newEmailVerificationKeyExpires! < new Date()) {
      return NextResponse.json(
        { success: false, error: "Token expired" },
        { status: 400 }
      );
    }

    const [updatedUser] = await db
      .update(usersTable)
      .set({
        email: user.newEmail!,
        newEmail: null,
        newEmailVerificationKey: null,
        newEmailVerificationKeyExpires: null,
        emailVerified: true, // Also verify their email, since they clicked the link
      })
      .where(eq(usersTable.id, user.id))
      .returning();

    return NextResponse.json({
      success: true,
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      },
    });
  } catch (error) {
    console.error("[user/email/verify]", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
