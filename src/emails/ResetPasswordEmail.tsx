import * as React from "react";

interface ResetPasswordEmailProps {
  resetLink: string;
}

export function ResetPasswordEmail({ resetLink }: ResetPasswordEmailProps) {
  const currentYear = new Date().getFullYear();

  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        backgroundColor: "#ffffff",
        color: "#18181b",
        padding: "40px 20px",
        maxWidth: "560px",
        margin: "0 auto",
        border: "1px solid #e4e4e7",
        borderRadius: "8px",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <img
          src="https://pub-666ffca9921d4b79b6738f62abc3af39.r2.dev/bookverse.png"
          alt="BookVerse Logo"
          style={{ width: "56px", height: "56px", objectFit: "contain", borderRadius: "12px" }}
        />
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            margin: "16px 0 4px",
            textTransform: "uppercase",
            letterSpacing: "-0.025em",
          }}
        >
          BookVerse
        </h2>
        <p
          style={{
            fontSize: "10px",
            color: "#a1a1aa",
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            margin: 0,
          }}
        >
          By TechWisdom Technologies
        </p>
      </div>

      {/* Content */}
      <div style={{ marginBottom: "36px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "bold", margin: "0 0 12px", textAlign: "center" }}>
          Password Reset Request
        </h3>
        <p
          style={{
            fontSize: "13px",
            color: "#71717a",
            lineHeight: "1.6",
            margin: "0 0 28px",
            textAlign: "center",
          }}
        >
          We received a request to reset your password for your BookVerse account. Click the button below to set a new password.
        </p>

        <div style={{ textAlign: "center" }}>
          <a
            href={resetLink}
            style={{
              display: "inline-block",
              backgroundColor: "#18181b",
              color: "#ffffff",
              fontSize: "11px",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              padding: "16px 32px",
              borderRadius: "4px",
              textDecoration: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            Reset Password
          </a>
        </div>

        <p
          style={{
            fontSize: "11px",
            color: "#a1a1aa",
            marginTop: "32px",
            lineHeight: "1.6",
            textAlign: "center",
          }}
        >
          If the button above does not work, copy and paste this URL into your browser:<br />
          <a href={resetLink} style={{ color: "#18181b", textDecoration: "underline", wordBreak: "break-all" }}>
            {resetLink}
          </a>
        </p>
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: "1px solid #f4f4f5",
          paddingTop: "24px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "10px", color: "#a1a1aa", margin: "0 0 6px" }}>
          If you did not request a password reset, you can safely ignore this email.
        </p>
        <p style={{ fontSize: "9px", color: "#d4d4d8", margin: 0 }}>
          © {currentYear} BookVerse. All rights reserved.
        </p>
      </div>
    </div>
  );
}
