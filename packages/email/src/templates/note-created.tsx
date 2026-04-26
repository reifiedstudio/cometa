import {
  Button,
  Heading,
  Hr,
  Section,
  Text,
} from "@react-email/components";
import { EmailLayout } from "./email-layout";

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
    <EmailLayout preview={`New note: ${title}`}>
      <Heading style={heading}>Note Created</Heading>
      <Text style={text}>A new note has been created:</Text>
      <Text style={docName}>{title}</Text>
      {snippet && (
        <Section style={snippetBox}>
          <Text style={snippetText}>{snippet}</Text>
        </Section>
      )}
      <Section style={buttonSection}>
        <Button style={button} href={viewUrl}>
          View Note
        </Button>
      </Section>
      <Hr style={hr} />
      <Text style={footer}>
        This note expires in 30 days. If you did not create this note, you can safely ignore this email.
      </Text>
    </EmailLayout>
  );
}

const heading = { fontSize: "20px", fontWeight: "600" as const, color: "#212327", marginBottom: "16px" };
const text = { fontSize: "14px", color: "#555A65", lineHeight: "1.6" };
const docName = { fontSize: "16px", fontWeight: "600" as const, color: "#212327", padding: "12px 16px", backgroundColor: "#F8F8FA", borderRadius: "8px" };
const snippetBox = { backgroundColor: "#F8F8FA", borderRadius: "8px", padding: "12px 16px", margin: "16px 0" };
const snippetText = { fontSize: "14px", color: "#555A65", fontStyle: "italic" as const, margin: "0", lineHeight: "1.5" };
const buttonSection = { textAlign: "center" as const, margin: "24px 0" };
const button = { backgroundColor: "#212327", color: "#ffffff", padding: "12px 24px", borderRadius: "8px", fontSize: "14px", fontWeight: "600" as const, textDecoration: "none" };
const hr = { borderColor: "#EBEEF1", margin: "24px 0" };
const footer = { fontSize: "13px", color: "#717983", lineHeight: "1.5" };
