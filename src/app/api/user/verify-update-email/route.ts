import db from "@/db/database";
import { usersTable, hoursTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const GET = async (req: NextRequest) => {
  try {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Token is required" },
        { status: 400 },
      );
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // First, try to find a user with the pending verification token
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.newEmailVerificationKey, hashedToken));

    if (user) {
      // Token exists, check if it's expired
      if (user.newEmailVerificationKeyExpires! < new Date()) {
        return NextResponse.json(
          { success: false, error: "Token expired" },
          { status: 400 },
        );
      }

      // Token is valid, update the user's email
      // Use a transaction to ensure both updates happen atomically
      const result = await db.transaction(async (tx) => {
        // Temporarily update the hours table to use the new email
        // This should work because we're in a transaction and the old email
        // in users table still exists at this point
        await tx
          .update(hoursTable)
          .set({
            userEmail: user.newEmail!,
          })
          .where(eq(hoursTable.userEmail, user.email));

        // Then update the user's email
        const [updatedUser] = await tx
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

        return updatedUser;
      });

      const updatedUser = result;

      return NextResponse.json({
        success: true,
        data: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          isAdmin: updatedUser.isAdmin,
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          isAdmin: updatedUser.isAdmin,
        },
      });
    } else {
      // Token doesn't exist in pending verifications
      // This could mean the token was already used or is invalid
      // To distinguish, we could potentially verify based on the raw token
      // But that would be a security risk, so instead we'll just return a message
      // indicating that verification may already be completed

      // Let's try to find if there's any user who might have had this token before
      // by checking if the token was recently used for verification.
      // Since we can't identify this directly, we'll return a generic message
      return NextResponse.json(
        {
          success: true,
          message: "Email verification already completed or token is invalid",
          alreadyVerified: true,
        },
        { status: 200 },
      );
    }
  } catch (error) {
    console.error("[user/email/verify]", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
