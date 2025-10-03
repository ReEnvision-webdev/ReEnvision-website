import db from "@/db/database";
import { usersTable } from "@/db/schema";
import { sendEmail } from "@/lib/send-mail";
import { authOptions } from "@/lib/auth.config";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { StandardResponse } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      const response: StandardResponse = {
        success: false,
        message: "Unauthorized",
        error: "You must be logged in to update your email",
        data: null,
      };
      
      return NextResponse.json(response, {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { email } = await request.json();

    if (!email) {
      const response: StandardResponse = {
        success: false,
        message: "Email is required",
        error: "Email is required",
        data: null,
      };

      return NextResponse.json(response, {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if email is already the user's current email
    if (email === session.user.email) {
      const response: StandardResponse = {
        success: false,
        message: "This is already your current email",
        error: "This is already your current email",
        data: null,
      };

      return NextResponse.json(response, {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if email is already in use by another user
    const existingUsers = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (existingUsers.length > 0 && existingUsers[0].id !== session.user.id) {
      const response: StandardResponse = {
        success: false,
        message: "Email already in use",
        error: "Email already in use by another account",
        data: null,
      };

      return NextResponse.json(response, {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    const rawVerifToken = crypto.randomBytes(32).toString("hex");

    // Update user with new email and verification info
    await db
      .update(usersTable)
      .set({
        newEmail: email,
        newEmailVerificationKey: crypto
          .createHash("sha256")
          .update(rawVerifToken)
          .digest("hex"),
        newEmailVerificationKeyExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      })
      .where(eq(usersTable.id, session.user.id));

    // Send verification email
    await sendEmail({
      to: email,
      text: "",
      subject: "Verify your new email address",
      replyTo: "contact@re-envision.org",
      html: `<h1>Email Update Verification</h1>
             <p>You have requested to update your email address. Please verify this new email by clicking the link below:</p>
             <p><a href="${process.env.NEXTAUTH_URL}/verify-update-email?email=${encodeURIComponent(email)}&token=${rawVerifToken}&userId=${session.user.id}">Verify New Email</a></p>
             <p>If you didn't request this change, you can safely ignore this email.</p>
             <p>Note that this link will expire in 24 hours.</p>`,
    });

    const response: StandardResponse = {
      success: true,
      message: "Verification email sent. Please check your inbox.",
      error: null,
      data: null,
    };

    return NextResponse.json(response, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating email:", error);
    
    const response: StandardResponse = {
      success: false,
      message: "Internal server error",
      error: "Something went wrong while updating your email",
      data: null,
    };

    return NextResponse.json(response, {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}