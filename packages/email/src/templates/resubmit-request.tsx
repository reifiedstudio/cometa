import { Body, Container, Head, Heading, Hr, Html, Preview, Text } from "@react-email/components";
import { EmailHeader } from "./email-header";
import { EmailFooter } from "./email-footer";

interface ResubmitRequestProps {
  documentName: string;
  issue: string;
}

export function ResubmitRequestEmail({
  documentName = "Document",
  issue = "The document could not be read clearly.",
}: ResubmitRequestProps) {
  return (
    <Html>
      <Head />
      <Preview>Please resubmit: {documentName}</Preview>
      <Body style={body}>
        <Container style={container}>
          <EmailHeader />
          <Heading style={heading}>Resubmission Required</Heading>
          <Text style={text}>
            We were unable to process <strong>{documentName}</strong> properly.
          </Text>
          <Text style={label}>Issue</Text>
          <Text style={text}>{issue}</Text>
          <Hr style={hr} />
          <Text style={footer}>
            Please send a clearer photo or scan of this document by replying to this email or
            uploading directly.
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
