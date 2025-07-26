// src/app/api/contact/route.ts
import { NextRequest } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    // Validate input
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Input validation and length checks
    if (
      typeof name !== "string" &&
      typeof email !== "string" &&
      typeof message !== "string" &&
      (name.length > 100 || email.length > 254 || message.length > 2000)
    ) {
      return new Response(JSON.stringify({ message: "Input too long" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ message: "Invalid email format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Sanitize inputs (basic)
    const sanitize = (str: string) =>
      str.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_PORT === "465",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send mail with sanitized inputs
    await transporter.sendMail({
      from: "webdev@re-envision.org",
      to: "contact@re-envision.org",
      subject: `Contact Form Submission from ${sanitize(name)}`,
      text: `
        Name: ${sanitize(name)}
        Email: ${sanitize(email)}
        Message: ${sanitize(message)}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${sanitize(name)}</p>
        <p><strong>Email:</strong> ${sanitize(email)}</p>
        <p><strong>Message:</strong></p>
        <p>${sanitize(message).replace(/\n/g, "<br>")}</p>
      `,
      replyTo: sanitize(email),
    });

    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error: unknown) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ message: "Failed to send email" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
