import * as React from "react";

interface SupportRequestNotificationProps {
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
}

export function SupportRequestNotification({
  name,
  email,
  category,
  subject,
  message,
}: SupportRequestNotificationProps) {
  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        backgroundColor: "#ffffff",
        color: "#18181b",
        padding: "40px 20px",
        maxWidth: "600px",
        margin: "0 auto",
        border: "1px solid #e4e4e7",
        borderRadius: "8px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <img
          src="https://pub-666ffca9921d4b79b6738f62abc3af39.r2.dev/bookverse.png"
          alt="BookVerse Logo"
          style={{ width: "48px", height: "48px", objectFit: "contain", borderRadius: "10px" }}
        />
        <h2 style={{ fontSize: "18px", fontWeight: "bold", margin: "12px 0 4px", textTransform: "uppercase" }}>
          Support Desk
        </h2>
        <p style={{ fontSize: "9px", color: "#a1a1aa", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.15em", margin: 0 }}>
          BookVerse By TechWisdom
        </p>
      </div>

      <div style={{ marginBottom: "32px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: "bold", margin: "0 0 16px", borderBottom: "1px solid #f4f4f5", paddingBottom: "8px" }}>
          New Support Ticket Submitted
        </h3>

        <table style={{ width: "100%", fontSize: "12px", borderCollapse: "collapse", marginBottom: "20px" }}>
          <tbody>
            <tr>
              <td style={{ padding: "8px 0", fontWeight: "bold", color: "#71717a", width: "120px" }}>Reporter Name:</td>
              <td style={{ padding: "8px 0", color: "#18181b" }}>{name}</td>
            </tr>
            <tr>
              <td style={{ padding: "8px 0", fontWeight: "bold", color: "#71717a" }}>Reporter Email:</td>
              <td style={{ padding: "8px 0", color: "#18181b" }}>
                <a href={`mailto:${email}`} style={{ color: "#18181b", textDecoration: "underline" }}>{email}</a>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "8px 0", fontWeight: "bold", color: "#71717a" }}>Category:</td>
              <td style={{ padding: "8px 0", color: "#18181b", textTransform: "uppercase", fontWeight: "bold", fontSize: "10px", letterSpacing: "0.05em" }}>
                {category}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "8px 0", fontWeight: "bold", color: "#71717a" }}>Subject:</td>
              <td style={{ padding: "8px 0", color: "#18181b", fontWeight: "medium" }}>{subject}</td>
            </tr>
          </tbody>
        </table>

        <div style={{ backgroundColor: "#f9f9fb", border: "1px solid #f4f4f5", borderRadius: "6px", padding: "16px", marginTop: "12px" }}>
          <h4 style={{ fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", color: "#71717a", margin: "0 0 8px" }}>
            Message Body:
          </h4>
          <p style={{ fontSize: "13px", color: "#18181b", lineHeight: "1.6", margin: 0, whiteSpace: "pre-wrap" }}>
            {message}
          </p>
        </div>
      </div>

      <div style={{ borderTop: "1px solid #f4f4f5", paddingTop: "20px", textAlign: "center" }}>
        <p style={{ fontSize: "9px", color: "#a1a1aa", margin: 0 }}>
          This is an automated notification from the BookVerse Support Portal. Please reply to this email to contact the user directly.
        </p>
      </div>
    </div>
  );
}
