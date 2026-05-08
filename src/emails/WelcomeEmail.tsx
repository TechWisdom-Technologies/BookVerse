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

interface WelcomeEmailProps {
  username: string;
  loginUrl: string;
}

export function WelcomeEmail({ username, loginUrl }: WelcomeEmailProps) {
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
          <Section style={{ backgroundColor: "#4f46e5", padding: "32px 24px", textAlign: "center" }}>
            <Heading style={{ color: "#ffffff", margin: 0, fontSize: "28px" }}>
              Welcome to BookVerse!
            </Heading>
          </Section>

          {/* Content */}
          <Section style={{ padding: "32px 24px" }}>
            <Text style={{ fontSize: "16px", color: "#374151", lineHeight: "1.6" }}>
              Hi @{username},
            </Text>
            <Text style={{ fontSize: "16px", color: "#374151", lineHeight: "1.6" }}>
              Thanks for joining BookVerse! We&apos;re excited to have you as part of our
              community of book lovers and storytellers.
            </Text>
            <Text style={{ fontSize: "16px", color: "#374151", lineHeight: "1.6" }}>
              Here&apos;s what you can do:
            </Text>
            <ul style={{ color: "#374151", lineHeight: "1.6" }}>
              <li>Browse thousands of free books in our library</li>
              <li>Read and write original stories</li>
              <li>Connect with other book enthusiasts</li>
              <li>Save your favorite books to your shelf</li>
            </ul>

            <Button
              href={loginUrl}
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
              Start Exploring
            </Button>

            <Text style={{ fontSize: "14px", color: "#6b7280", marginTop: "24px" }}>
              If you have any questions, feel free to reach out to our support team.
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

