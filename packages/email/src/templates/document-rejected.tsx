import {
  Body,
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
import { EmailFooter } from "./email-footer";

interface DocumentRejectedProps {
  documentName: string;
  reason?: string;
  reviewerNote?: string;
}

export function DocumentRejectedEmail({
  documentName = "Document",
  reason,
  reviewerNote,
}: DocumentRejectedProps) {
  return (
    <Html>
      <Head />
      <Preview>Document rejected: {documentName}</Preview>
      <Body style={body}>
        <Container style={container}>
          <EmailHeader />
          <Heading style={heading}>Document Rejected</Heading>
          <Text style={text}>
            The document <strong>{documentName}</strong> has been rejected and requires your
            attention.
          </Text>
          {reason && (
            <>
              <Text style={label}>Reason</Text>
              <Text style={text}>{reason}</Text>
            </>
          )}
          {reviewerNote && (
            <>
              <Text style={label}>Note from reviewer</Text>
              <Text style={text}>{reviewerNote}</Text>
            </>
          )}
          <Hr style={hr} />
          <Text style={footer}>
            Please resubmit a clearer version of this document. You can reply to this email or
            upload directly to Cometa.
          </Text>
        <EmailFooter />
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
const label = {
  fontSize: "12px",
  color: "#717983",
  fontWeight: "600" as const,
  textTransform: "uppercase" as const,
  marginBottom: "4px",
};
const hr = { borderColor: "#EBEEF1", margin: "24px 0" };
const footer = { fontSize: "13px", color: "#717983", lineHeight: "1.5" };
