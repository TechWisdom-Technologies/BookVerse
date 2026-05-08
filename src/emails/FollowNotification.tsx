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
  Img,
} from "@react-email/components";

interface FollowNotificationProps {
  userName: string;
  followerName: string;
  followerAvatarUrl?: string | null;
  profileUrl: string;
}

export function FollowNotification({
  userName,
  followerName,
  followerAvatarUrl,
  profileUrl,
}: FollowNotificationProps) {
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
              New Follower
            </Heading>
          </Section>

          {/* Content */}
          <Section style={{ padding: "32px 24px", textAlign: "center" }}>
            {/* Avatar */}
            {followerAvatarUrl ? (
              <Img
                src={followerAvatarUrl}
                alt={followerName}
                width={64}
                height={64}
                style={{
                  borderRadius: "50%",
                  margin: "0 auto 16px",
                  border: "3px solid #4f46e5",
                }}
              />
            ) : (
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  backgroundColor: "#4f46e5",
                  margin: "0 auto 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              >
                {followerName[0]?.toUpperCase()}
              </div>
            )}

            <Text style={{ fontSize: "16px", color: "#374151", lineHeight: "1.6" }}>
              Hi {userName},
            </Text>
            <Text style={{ fontSize: "18px", color: "#374151", lineHeight: "1.6" }}>
              <strong>@{followerName}</strong> started following you!
            </Text>
            <Text style={{ fontSize: "14px", color: "#6b7280", marginTop: "8px" }}>
              They will see your new stories and books in their feed.
            </Text>

            <Button
              href={profileUrl}
              style={{
                backgroundColor: "#4f46e5",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "6px",
                textDecoration: "none",
                display: "inline-block",
                marginTop: "24px",
                fontWeight: 600,
              }}
            >
              View Profile
            </Button>
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
