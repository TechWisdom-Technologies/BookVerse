import { Resend } from "resend";
import type { ReactElement } from "react";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.RESEND_FROM_EMAIL;

export const resend = apiKey ? new Resend(apiKey) : null;

export async function sendEmail(to: string, subject: string, content: ReactElement | string) {
  if (!resend || !from) return;
  if (typeof content === "string") {
    await resend.emails.send({ from, to, subject, text: content });
    return;
  }

  await resend.emails.send({ from, to, subject, react: content });
}
