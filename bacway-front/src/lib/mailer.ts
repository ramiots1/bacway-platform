// src/lib/mailer.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // or use "host", "port", "secure" for custom SMTP
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendMail(to: string, subject: string, html: string) {
  return await transporter.sendMail({
    from: `"Bacway" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}
