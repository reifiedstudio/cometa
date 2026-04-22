import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { EmailHeader } from "./email-header";

interface SignatureRequestProps {
  documentName: string;
  documentType: string;
  senderEmail: string;
  message?: string;
  signUrl: string;
}

export function SignatureRequestEmail({
  documentName = "Document",
  documentType = "document",
  senderEmail = "someone@company.com",
  message,
  signUrl = "#",
}: SignatureRequestProps) {
  return (
    <Html>
      <Head />
      <Preview>
        You have a {documentType} to sign: {documentName}
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <EmailHeader />
          <Heading style={heading}>Document Signature Required</Heading>
          <Text style={text}>
            <strong>{senderEmail}</strong> has sent you a {documentType} to review and sign:
          </Text>
          <Text style={docName}>{documentName}</Text>
          {message && (
            <Section style={messageBox}>
              <Text style={messageText}>"{message}"</Text>
            </Section>
          )}
          <Section style={buttonSection}>
            <Button style={button} href={signUrl}>
              Review & Sign
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            This link will expire in 7 days. If you did not expect this request, you can safely
            ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#f6f6f6",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};
const container = {
  backgroundColor: "#ffffff",
  margin: "40px auto",
  padding: "32px",
  borderRadius: "12px",
  maxWidth: "480px",
};
const heading = {
  fontSize: "20px",
  fontWeight: "600" as const,
  color: "#212327",
  marginBottom: "16px",
};
const text = { fontSize: "14px", color: "#555A65", lineHeight: "1.6" };
const docName = {
  fontSize: "16px",
  fontWeight: "600" as const,
  color: "#212327",
  padding: "12px 16px",
  backgroundColor: "#F8F8FA",
  borderRadius: "8px",
};
const messageBox = {
  backgroundColor: "#F8F8FA",
  borderRadius: "8px",
  padding: "12px 16px",
  margin: "16px 0",
};
const messageText = {
  fontSize: "14px",
  color: "#555A65",
  fontStyle: "italic" as const,
  margin: "0",
};
const buttonSection = { textAlign: "center" as const, margin: "24px 0" };
const button = {
  backgroundColor: "#212327",
  color: "#ffffff",
  padding: "12px 24px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "600" as const,
  textDecoration: "none",
};
const hr = { borderColor: "#EBEEF1", margin: "24px 0" };
const footer = { fontSize: "13px", color: "#717983", lineHeight: "1.5" };
