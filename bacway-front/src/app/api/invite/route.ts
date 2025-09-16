// src/app/api/send-email/route.ts
import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { to, subject, html } = await req.json();
    await sendMail(to, subject, html);

    return NextResponse.json({ success: true, message: "Email sent!" });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send email" },
      { status: 500 }
    );
  }
}
