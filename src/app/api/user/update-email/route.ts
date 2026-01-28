import db from "@/db/database";
import { usersTable } from "@/db/schema";
import { authOptions } from "@/lib/auth.config";
import { sendEmail } from "@/lib/send-mail";
import { and, eq, not } from "drizzle-orm";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const POST = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { email } = await req.json();

    if (!email) {
      return new NextResponse("Email is required", { status: 400 });
    }

    const [existingUser] = await db
      .select()
      .from(usersTable)
      .where(
        and(
          eq(usersTable.email, email),
          not(eq(usersTable.id, session.user.id)),
        ),
      );

    if (existingUser) {
      return new NextResponse("Email already in use", { status: 409 });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const newEmailVerificationKeyExpires = new Date();
    newEmailVerificationKeyExpires.setHours(
      newEmailVerificationKeyExpires.getHours() + 1,
    );

    await db
      .update(usersTable)
      .set({
        newEmail: email,
        newEmailVerificationKey: hashedToken,
        newEmailVerificationKeyExpires,
      })
      .where(eq(usersTable.id, session.user.id));

    const url = `${process.env.NEXTAUTH_URL}/verify-update-email?token=${rawToken}`;

    await sendEmail({
      to: email,
      subject: "Verify your new email address",
      text: `Email Update Verification. You have requested to update your email address. Please verify this new email by visiting the following link: ${url}`,
      replyTo: "contact@re-envision.org",
      html: `<h1>Email Update Verification</h1><p>You have requested to update your email address. Please verify this new email by clicking the link below:</p><p><a href="${url}">Verify New Email</a></p><p>If you didn't request this change, you can safely ignore this email.</p><p>Note that this link will expire in 1 hour.</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[user/email]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
