import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { CONTACT_SITE_EMAIL } from "@/lib/contact-email";
import { isValidContactInquiry } from "@/lib/consultancy-services";

const MAX_NAME = 200;
const MAX_COMPANY = 200;
const MAX_MESSAGE = 10000;

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const o = body as Record<string, unknown>;
  const name = typeof o.name === "string" ? o.name.trim() : "";
  const email = typeof o.email === "string" ? o.email.trim() : "";
  const inquiry = typeof o.inquiry === "string" ? o.inquiry.trim() : "";
  const company =
    typeof o.company === "string" ? o.company.trim() : "";
  const message = typeof o.message === "string" ? o.message.trim() : "";

  if (!name || name.length > MAX_NAME) {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }
  if (!email || !isValidEmail(email) || email.length > 254) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (!inquiry || !isValidContactInquiry(inquiry)) {
    return NextResponse.json({ error: "Invalid inquiry selection" }, { status: 400 });
  }
  if (company.length > MAX_COMPANY) {
    return NextResponse.json({ error: "Invalid company" }, { status: 400 });
  }
  if (!message || message.length > MAX_MESSAGE) {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD ?? process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim() ?? CONTACT_SITE_EMAIL;

  if (!host || !user || !pass || !from) {
    console.error("Contact form: SMTP env not configured");
    return NextResponse.json(
      { error: "Email is not configured on the server." },
      { status: 500 }
    );
  }

  const port = Number(process.env.SMTP_PORT ?? "587");
  const secure =
    process.env.SMTP_SECURE === "true" ||
    process.env.SMTP_SECURE === "1" ||
    port === 465;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  const subject = `[Site contact] ${inquiry} — ${name}`;
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Looking for: ${inquiry}`,
    company ? `Company: ${company}` : "Company: (not provided)",
    "",
    "Message:",
    message,
  ].join("\n");

  const html = `
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Looking for:</strong> ${escapeHtml(inquiry)}</p>
    <p><strong>Company:</strong> ${company ? escapeHtml(company) : "(not provided)"}</p>
    <p><strong>Message:</strong></p>
    <pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(message)}</pre>
  `;

  try {
    await transporter.sendMail({
      from,
      to,
      replyTo: email,
      subject,
      text,
      html,
    });
  } catch (e) {
    console.error("SMTP send failed:", e);
    return NextResponse.json(
      { error: "Could not send message. Try again later." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
