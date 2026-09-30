import { describe, it, expect } from 'vitest';
import { render } from '@react-email/render';

import { WelcomeEmail } from '../../src/emails/WelcomeEmail';
import { NewsletterEmail } from '../../src/emails/NewsletterEmail';
import { ResetPasswordEmail } from '../../src/emails/ResetPasswordEmail';
import { SupportRequestNotification } from '../../src/emails/SupportRequestNotification';
import { FollowNotification } from '../../src/emails/FollowNotification';
import { CommentNotification } from '../../src/emails/CommentNotification';
import { LoginAlertEmail } from '../../src/emails/LoginAlertEmail';

describe('Email Templates', () => {
  it('renders WelcomeEmail correctly', async () => {
    const html = await render(<WelcomeEmail username="testuser" loginUrl="http://localhost:3000/login" />);
    expect(html).toContain('Welcome to BookVerse!');
    expect(html).toContain('testuser'); // React-Email injects comments, so just check for the username
    expect(html).toContain('http://localhost:3000/login');
  });

  it('renders NewsletterEmail correctly', async () => {
    const html = await render(
      <NewsletterEmail 
        subject="Monthly Digest" 
        content="Here is some great content for you." 
      />
    );
    expect(html).toContain('Monthly Digest');
    expect(html).toContain('Here is some great content for you.');
  });

  it('renders ResetPasswordEmail correctly', async () => {
    const html = await render(<ResetPasswordEmail resetLink="http://localhost:3000/reset" />);
    expect(html).toContain('Password Reset Request');
    expect(html).toContain('http://localhost:3000/reset');
  });

  it('renders SupportRequestNotification correctly', async () => {
    const html = await render(
      <SupportRequestNotification 
        name="John Doe"
        email="john@example.com"
        category="Login Issue"
        subject="Issue with login" 
        message="I cannot login" 
      />
    );
    expect(html).toContain('John Doe');
    expect(html).toContain('john@example.com');
    expect(html).toContain('Issue with login');
    expect(html).toContain('I cannot login');
  });

  it('renders FollowNotification correctly', async () => {
    const html = await render(
      <FollowNotification 
        userName="my_profile"
        followerName="john_doe" 
        profileUrl="http://localhost:3000/my_profile"
      />
    );
    expect(html).toContain('john_doe');
    expect(html).toContain('http://localhost:3000/my_profile');
  });

  it('renders CommentNotification correctly', async () => {
    const html = await render(
      <CommentNotification 
        authorName="author_jane"
        commenterName="jane_smith"
        storyTitle="The Epic Tale"
        commentPreview="Great chapter!"
        storyUrl="http://localhost:3000/story/1"
      />
    );
    expect(html).toContain('jane_smith');
    expect(html).toContain('Great chapter!');
    expect(html).toContain('The Epic Tale');
  });

  it('renders LoginAlertEmail correctly', async () => {
    const html = await render(
      <LoginAlertEmail 
        email="user@test.com"
        ipAddress="192.168.1.1"
        browser="Chrome"
        os="Windows"
        time="2026-09-30 12:00 PM"
      />
    );
    expect(html).toContain('New Sign-In Detected');
    expect(html).toContain('Chrome');
    expect(html).toContain('Windows');
    expect(html).toContain('192.168.1.1');
    expect(html).toContain('2026-09-30 12:00 PM');
  });
});
