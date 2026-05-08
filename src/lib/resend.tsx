import { Resend } from "resend";
import type { ReactElement } from "react";
import { WelcomeEmail } from "@/emails/WelcomeEmail";
import { CommentNotification } from "@/emails/CommentNotification";
import { FollowNotification } from "@/emails/FollowNotification";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.RESEND_FROM_EMAIL;
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
