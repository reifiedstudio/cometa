import {
  Body,
  Container,
  Head,
  Html,
  Preview,
} from "@react-email/components";
import { EmailHeader } from "./email-header";
import { EmailFooter } from "./email-footer";

interface EmailLayoutProps {
  preview: string;
  children: React.ReactNode;
}

/**
 * Shared email layout — wraps all email templates with consistent
 * padding, container, header (logo), and footer (confidentiality + copyright).
 *
 * Usage:
 * ```tsx
 * <EmailLayout preview="Your document was approved">
 *   <Heading>...</Heading>
 *   <Text>...</Text>
 * </EmailLayout>
 * ```
 */
export function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          <EmailHeader />
          {children}
          <EmailFooter />
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#f6f6f6",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  padding: "40px 0",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "32px",
  borderRadius: "12px",
  maxWidth: "480px",
};
