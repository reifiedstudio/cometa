import {
  Body,
  Button,
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

interface NoteCreatedProps {
  title: string;
  snippet: string;
  viewUrl: string;
}

export function NoteCreatedEmail({
  title = "Untitled Note",
  snippet = "",
  viewUrl = "#",
}: NoteCreatedProps) {
  return (
    <Html>
      <Head />
      <Preview>New note: {title}</Preview>
      <Body style={body}>
        <Container style={container}>
          <EmailHeader />
          <Heading style={heading}>Note Created</Heading>
          <Text style={text}>
            A new note has been created: <strong>{title}</strong>
          </Text>
          {snippet && (
            <Text style={snippetStyle}>{snippet}</Text>
          )}
          <Button style={button} href={viewUrl}>
            View Note
          </Button>
          <Hr style={hr} />
          <Text style={footer}>
            This note was created via the Cometa platform.
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
const snippetStyle = {
  fontSize: "13px",
  color: "#717983",
  lineHeight: "1.5",
  backgroundColor: "#f8f9fa",
  padding: "12px 16px",
  borderRadius: "8px",
  borderLeft: "3px solid #e2e8f0",
};
const button = {
  backgroundColor: "#212327",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600" as const,
  padding: "12px 24px",
  borderRadius: "8px",
  textDecoration: "none",
  display: "inline-block" as const,
  marginTop: "16px",
};
const hr = { borderColor: "#EBEEF1", margin: "24px 0" };
const footer = { fontSize: "13px", color: "#717983", lineHeight: "1.5" };
