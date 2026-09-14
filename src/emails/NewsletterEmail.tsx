import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Section,
  Link,
} from "@react-email/components";

interface NewsletterEmailProps {
  subject: string;
  content: string; // The newsletter body, which could contain newlines.
}

export function NewsletterEmail({ subject, content }: NewsletterEmailProps) {
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
          <Section style={{ backgroundColor: "#18181b", padding: "32px 24px", textAlign: "center" }}>
            <Heading style={{ color: "#ffffff", margin: 0, fontSize: "28px", fontWeight: 700 }}>
              BookVerse
            </Heading>
            <Text style={{ color: "#a1a1aa", margin: "8px 0 0 0", fontSize: "14px", textTransform: "uppercase", letterSpacing: "2px" }}>
              Newsletter
            </Text>
          </Section>

          {/* Content */}
          <Section style={{ padding: "40px 24px" }}>
            <Heading style={{ color: "#18181b", margin: "0 0 24px 0", fontSize: "20px", fontWeight: 600 }}>
              {subject}
            </Heading>
            
            {/* Split content by newlines to render proper paragraphs */}
            {content.split("\n").map((paragraph, index) => (
              <Text key={index} style={{ fontSize: "16px", color: "#3f3f46", lineHeight: "1.6", margin: "0 0 16px 0" }}>
                {paragraph}
              </Text>
            ))}
          </Section>

          {/* Footer */}
          <Section
            style={{
              backgroundColor: "#f4f4f5",
              padding: "32px 24px",
              textAlign: "center",
              borderTop: "1px solid #e4e4e7"
            }}
          >
            <Text style={{ fontSize: "12px", color: "#71717a", margin: 0 }}>
              © {new Date().getFullYear()} BookVerse. All rights reserved.
            </Text>
            <Text style={{ fontSize: "12px", color: "#71717a", margin: "8px 0 0 0" }}>
              <Link href="https://bookverse.app" style={{ color: "#18181b", textDecoration: "underline" }}>
                bookverse.app
              </Link>
            </Text>
            <Text style={{ fontSize: "10px", color: "#a1a1aa", margin: "24px 0 0 0" }}>
              You are receiving this email because you subscribed to the BookVerse newsletter.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
