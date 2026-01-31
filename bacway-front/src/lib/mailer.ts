// src/lib/mailer.ts
import nodemailer from "nodemailer";

// Validate required env
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
if (!EMAIL_USER || !EMAIL_PASS) {
  throw new Error("Missing EMAIL_USER or EMAIL_PASS env variables for SMTP authentication.");
}

// Allow overriding SMTP settings via env, default to Gmail's recommended config
const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
const SMTP_SECURE = (process.env.SMTP_SECURE ?? "true").toLowerCase() === "true"; // 465 true, 587 false

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
  // Improve reliability
  pool: true,
  maxConnections: 3,
  maxMessages: 50,
  // Ensure SNI for TLS when using custom hostnames
  tls: {
    servername: SMTP_HOST,
  },
});

export async function sendMail(to: string, subject: string, html: string) {
  try {
    return await transporter.sendMail({
      from: `"Bacway" <${EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    // Surface a clearer error to logs
    console.error("Nodemailer sendMail error", {
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      user: EMAIL_USER,
      err,
    });
    throw err;
  }
}
