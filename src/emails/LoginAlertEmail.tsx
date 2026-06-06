import * as React from "react";
import { Html, Head, Body, Container, Text, Link, Preview, Section, Heading } from "@react-email/components";

interface LoginAlertEmailProps {
  email: string;
  ipAddress: string;
  browser: string;
  os: string;
  time: string;
}

export const LoginAlertEmail: React.FC<LoginAlertEmailProps> = ({
  email,
  ipAddress,
  browser,
  os,
  time,
}) => (
  <Html>
    <Head />
    <Preview>New login detected on your BookVerse account</Preview>
    <Body style={{ fontFamily: "sans-serif", backgroundColor: "#f4f4f5", padding: "20px" }}>
      <Container style={{ backgroundColor: "#ffffff", padding: "40px", borderRadius: "8px", maxWidth: "600px", margin: "0 auto" }}>
        <Heading style={{ color: "#18181b", fontSize: "24px", marginBottom: "20px" }}>New Sign-In Detected</Heading>
        <Text style={{ color: "#3f3f46", fontSize: "16px", lineHeight: "24px" }}>
          We noticed a new login to your BookVerse account (<strong>{email}</strong>) from a device we haven't seen recently.
        </Text>
        
        <Section style={{ backgroundColor: "#fafafa", padding: "20px", borderRadius: "8px", marginTop: "20px", marginBottom: "20px", border: "1px solid #e4e4e7" }}>
          <Text style={{ margin: "0 0 10px 0", color: "#18181b", fontSize: "14px" }}><strong>Device:</strong> {os} - {browser}</Text>
          <Text style={{ margin: "0 0 10px 0", color: "#18181b", fontSize: "14px" }}><strong>IP Address:</strong> {ipAddress}</Text>
          <Text style={{ margin: "0", color: "#18181b", fontSize: "14px" }}><strong>Time:</strong> {time}</Text>
        </Section>

        <Text style={{ color: "#3f3f46", fontSize: "16px", lineHeight: "24px" }}>
          If this was you, you can safely ignore this email.
        </Text>
        <Text style={{ color: "#ef4444", fontSize: "16px", lineHeight: "24px", fontWeight: "bold" }}>
          If this wasn't you, please immediately log in to your account, change your password, and revoke any suspicious sessions in your Security Settings.
        </Text>
        
        <Text style={{ color: "#71717a", fontSize: "14px", marginTop: "40px" }}>
          The BookVerse Security Team
        </Text>
      </Container>
    </Body>
  </Html>
);
