import { Resend } from "resend";
import type { ReactElement } from "react";
import { WelcomeEmail } from "@/emails/WelcomeEmail";
import { CommentNotification } from "@/emails/CommentNotification";
import { FollowNotification } from "@/emails/FollowNotification";
import { ResetPasswordEmail } from "@/emails/ResetPasswordEmail";
import { SupportRequestNotification } from "@/emails/SupportRequestNotification";
import { LoginAlertEmail } from "@/emails/LoginAlertEmail";
import { NewsletterEmail } from "@/emails/NewsletterEmail";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.RESEND_FROM_EMAIL || "BookVerse <onboarding@resend.dev>";
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const resend = apiKey ? new Resend(apiKey) : null;

export async function sendEmail(to: string, subject: string, content: ReactElement | string) {
  if (!resend || !from) return;
  if (typeof content === "string") {
    await resend.emails.send({ from, to, subject, text: content });
    return;
  }

  await resend.emails.send({ from, to, subject, react: content });
}

// Password Reset email - sent when a user requests password reset
export function sendPasswordResetEmail(to: string, resetLink: string) {
  void sendEmail(
    to,
    "Reset your BookVerse password",
    <ResetPasswordEmail resetLink={resetLink} />
  );
}

// Login Alert email - sent when a login occurs from a new IP/Device
export function sendLoginAlertEmail(to: string, data: { ipAddress: string; browser: string; os: string }) {
  void sendEmail(
    to,
    "Security Alert: New Sign-In to BookVerse",
    <LoginAlertEmail 
      email={to} 
      ipAddress={data.ipAddress} 
      browser={data.browser} 
      os={data.os} 
      time={new Date().toLocaleString()} 
    />
  );
}

// Support Request email - sent to official@techwisdom.site when user submits support form
export function sendSupportRequestEmail(data: {
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
}) {
  const adminEmail = "twtech.contact@gmail.com";
  void sendEmail(
    adminEmail,
    `[Support Desk] ${data.category.toUpperCase()}: ${data.subject}`,
    <SupportRequestNotification
      name={data.name}
      email={data.email}
      category={data.category}
      subject={data.subject}
      message={data.message}
    />
  );
}

// Welcome email - sent when new user signs up
export function sendWelcomeEmail(to: string, username: string) {
  const loginUrl = `${appUrl}/login`;
  void sendEmail(
    to,
    "Welcome to BookVerse!",
    <WelcomeEmail username={username} loginUrl={loginUrl} />
  );
}

// Comment notification - sent when someone comments on a story
export function sendCommentNotification(
  to: string,
  data: {
    authorName: string;
    commenterName: string;
    storyTitle: string;
    commentPreview: string;
    storyId: string;
  }
) {
  const storyUrl = `${appUrl}/stories/${data.storyId}`;
  void sendEmail(
    to,
    `New comment on "${data.storyTitle}"`,
    <CommentNotification
      authorName={data.authorName}
      commenterName={data.commenterName}
      storyTitle={data.storyTitle}
      commentPreview={data.commentPreview}
      storyUrl={storyUrl}
    />
  );
}

// Follow notification - sent when someone follows a user
export function sendFollowNotification(
  to: string,
  data: {
    userName: string;
    followerName: string;
    followerAvatarUrl?: string | null;
  }
) {
  const profileUrl = `${appUrl}/profile/${data.followerName}`;
  void sendEmail(
    to,
    `${data.followerName} started following you!`,
    <FollowNotification
      userName={data.userName}
      followerName={data.followerName}
      followerAvatarUrl={data.followerAvatarUrl}
      profileUrl={profileUrl}
    />
  );
}

// Bulk Newsletter - sent to all active subscribers
export async function sendBulkNewsletter(emails: string[], subject: string, content: string) {
  if (!resend || !from || emails.length === 0) return { success: 0, failed: 0 };

  // Resend batch API has a limit of 100 emails per batch request
  const BATCH_SIZE = 100;
  let successCount = 0;
  let failedCount = 0;

  for (let i = 0; i < emails.length; i += BATCH_SIZE) {
    const batch = emails.slice(i, i + BATCH_SIZE);
    
    try {
      const { data, error } = await resend.batch.send(
        batch.map((email) => ({
          from,
          to: email,
          subject,
          react: <NewsletterEmail subject={subject} content={content} />,
        }))
      );

      if (error) {
        console.error("Error sending newsletter batch:", error);
        failedCount += batch.length;
      } else {
        successCount += batch.length; // Approximate, as batch data might not have detailed per-email success
      }
    } catch (err) {
      console.error("Failed to send newsletter batch:", err);
      failedCount += batch.length;
    }
  }

  return { success: successCount, failed: failedCount };
}
