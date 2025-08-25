import db from "@/db/database";
import { usersTable } from "@/db/schema";
import { sendEmail } from "@/lib/send-mail";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { StandardResponse } from "@/lib/types";

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email) {
    const response: StandardResponse = {
      success: false,
      message: "Email is required",
      error: "Email is missing",
      data: null,
    };

    return NextResponse.json(response, {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const rawVerifToken = crypto.randomBytes(32).toString("hex");

    await db
      .update(usersTable)
      .set({
        resetKey: crypto
          .createHash("sha256")
          .update(rawVerifToken)
          .digest("hex"),
        resetKeyExpires: new Date(Date.now() + 60 * 60 * 1000),
      })
      .where(eq(usersTable.email, email));

    await sendEmail({
      to: email,
      text: "",
      subject: "Reset your password",
      replyTo: "no-reply@test.com",
      html: `<h1>Reset your password</h1><p>Please reset your password by clicking this link: <a href="${process.env.EMAIL_VERIF_URL}/reset-password?email=${encodeURIComponent(email)}&token=${rawVerifToken}">Reset Password</a></p><p>Note that this link will expire in 1 hour.</p>`,
    });

    const response: StandardResponse = {
      success: true,
      message:
        "If an account with that email exists, a password reset link has been sent.",
      error: null,
      data: null,
    };

    return NextResponse.json(response, {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error requesting a password reset:", error);

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
