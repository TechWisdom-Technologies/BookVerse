import { Html, Head, Body, Container, Heading, Text } from "@react-email/components";

export function WelcomeEmail({ displayName }: { displayName?: string | null }) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "Arial, sans-serif" }}>
        <Container style={{ padding: "24px" }}>
          <Heading>Welcome to BookVerse</Heading>
          <Text>
            {displayName ? `Hi ${displayName},` : "Hi,"} thanks for joining BookVerse.
          </Text>
          <Text>Happy reading and writing.</Text>
        </Container>
      </Body>
    </Html>
  );
}

