import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import { EmailHeader } from "./email-header";
import { EmailFooter } from "./email-footer";

interface SubmissionApprovedProps {
  documentName: string;
  documentType: string;
  approvedBy?: string;
}

export function SubmissionApprovedEmail({
  documentName = "Document",
  documentType = "document",
  approvedBy,
}: SubmissionApprovedProps) {
  return (
    <Html>
      <Head />
      <Preview>Submission approved: {documentName}</Preview>
      <Body style={body}>
        <Container style={container}>
          <EmailHeader />
          <Heading style={heading}>Submission Approved</Heading>
          <Text style={text}>
            Your {documentType} submission <strong>{documentName}</strong> has been reviewed and approved.
          </Text>
          {approvedBy && <Text style={text}>Approved by: {approvedBy}</Text>}
          <Hr style={hr} />
          <Text style={footer}>
            No action is required from you. This is a confirmation that your submission has been
            processed.
          </Text>
          <EmailFooter />
        </Container>
      </Body>
    </Html>
  );
}

// Keep old name as alias for backwards compatibility
export const DocumentApprovedEmail = SubmissionApprovedEmail;

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
const hr = { borderColor: "#EBEEF1", margin: "24px 0" };
const footer = { fontSize: "13px", color: "#717983", lineHeight: "1.5" };
