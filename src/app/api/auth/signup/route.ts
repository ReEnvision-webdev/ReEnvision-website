import db from "@/db/database";
import { usersTable } from "@/db/schema";
import { sendEmail } from "@/lib/send-mail";
import { NextRequest } from "next/server";
import cuid from "cuid";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { StandardResponse } from "@/lib/types";

export async function POST(request: NextRequest) {
  const { email, name, password } = await request.json();

  if (!email || !name || !password) {
    return new Response("Missing fields", { status: 400 });
  }

  try {
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (users.length > 0) {
      const response: StandardResponse = {
        success: false,
        message: "User already exists",
        error: "User with this email already exists",
        data: null,
      };

      return new Response(JSON.stringify(response), { status: 409 });
    }
  } catch (error) {
    console.error("Error checking for existing user:", error);
    return new Response("Internal server error", { status: 500 });
  }

  const rawVerifToken = crypto.randomBytes(32).toString("hex");

  try {
    await db.insert(usersTable).values({
      id: cuid(),
      email: email,
      name: name,
      password: await bcrypt.hash(password, 10),
      emailVerificationKey: crypto
        .createHash("sha256")
        .update(rawVerifToken)
        .digest("hex"),
      emailVerificationKeyExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await sendEmail({
      to: email,
      text: "",
      subject: "Verify your email",
      replyTo: "no-reply@test.com",
      html: `<h1>Re-envision account verification</h1><p>Please verify your email by clicking this link: <a href="${process.env.BASE_URL}/verify?email=${encodeURIComponent(email)}&token=${rawVerifToken}">Verify Email</a></p><p>Note that this link will expire in 24 hours.</p>`,
    });

    return new Response("User created", { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
