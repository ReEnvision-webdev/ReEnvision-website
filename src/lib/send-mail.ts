import nodemailer from "nodemailer";

const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendEmailParams {
  to: string;
  subject: string;
  text: string;
  replyTo: string;
  html?: string;
}

export async function sendEmail(
  params: SendEmailParams) {
  await emailTransporter.sendMail({
    from: process.env.SMTP_USER,
    to: params.to,
    subject: params.subject,
    text: params.text,
    html: params.html,
    replyTo: params.replyTo,
  });
}
