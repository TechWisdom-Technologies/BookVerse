import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Section,
  Link,
} from "@react-email/components";

interface CommentNotificationProps {
  authorName: string;
  commenterName: string;
  storyTitle: string;
  commentPreview: string;
  storyUrl: string;
}

export function CommentNotification({
  authorName,
  commenterName,
  storyTitle,
  commentPreview,
  storyUrl,
}: CommentNotificationProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "system-ui, sans-serif", backgroundColor: "#f9fafb" }}>
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          {/* Header */}
          <Section style={{ backgroundColor: "#4f46e5", padding: "24px", textAlign: "center" }}>
            <Heading style={{ color: "#ffffff", margin: 0, fontSize: "24px" }}>
              New Comment on Your Story
            </Heading>
          </Section>

          {/* Content */}
          <Section style={{ padding: "32px 24px" }}>
            <Text style={{ fontSize: "16px", color: "#374151", lineHeight: "1.6" }}>
              Hi {authorName},
            </Text>
            <Text style={{ fontSize: "16px", color: "#374151", lineHeight: "1.6" }}>
              <strong>@{commenterName}</strong> commented on your story{" "}
              <strong>&quot;{storyTitle}&quot;</strong>:
            </Text>

            {/* Comment Preview Box */}
            <Section
              style={{
                backgroundColor: "#f3f4f6",
                padding: "16px",
                borderRadius: "8px",
                margin: "16px 0",
                borderLeft: "4px solid #4f46e5",
              }}
            >
              <Text
                style={{
                  fontSize: "14px",
                  color: "#4b5563",
                  lineHeight: "1.5",
                  margin: 0,
                  fontStyle: "italic",
                }}
              >
                &ldquo;{commentPreview}...&rdquo;
              </Text>
            </Section>

            <Button
              href={storyUrl}
              style={{
                backgroundColor: "#4f46e5",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "6px",
                textDecoration: "none",
                display: "inline-block",
                marginTop: "16px",
                fontWeight: 600,
              }}
            >
              View Comment
            </Button>

            <Text style={{ fontSize: "14px", color: "#6b7280", marginTop: "24px" }}>
              You can reply to this comment or view all comments on your story page.
            </Text>
          </Section>

          {/* Footer */}
          <Section
            style={{
              backgroundColor: "#f9fafb",
              padding: "24px",
              textAlign: "center",
            }}
          >
            <Text style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>
              © {new Date().getFullYear()} BookVerse. All rights reserved.
            </Text>
            <Text style={{ fontSize: "12px", color: "#9ca3af", margin: "8px 0 0 0" }}>
              <Link href="https://bookverse.app" style={{ color: "#6b7280" }}>
                bookverse.app
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
