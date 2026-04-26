import { Heading, Hr, Text } from "@react-email/components";
import { EmailLayout } from "./email-layout";

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
    <EmailLayout preview={`Submission approved: ${documentName}`}>
      <Heading style={heading}>Submission Approved</Heading>
      <Text style={text}>
        Your {documentType} submission <strong>{documentName}</strong> has been reviewed and approved.
      </Text>
      {approvedBy && <Text style={text}>Approved by: {approvedBy}</Text>}
      <Hr style={hr} />
      <Text style={footer}>
        No action is required from you. This is a confirmation that your submission has been processed.
      </Text>
    </EmailLayout>
  );
}

export const DocumentApprovedEmail = SubmissionApprovedEmail;

const heading = { fontSize: "20px", fontWeight: "600" as const, color: "#212327", marginBottom: "16px" };
const text = { fontSize: "14px", color: "#555A65", lineHeight: "1.6" };
const hr = { borderColor: "#EBEEF1", margin: "24px 0" };
const footer = { fontSize: "13px", color: "#717983", lineHeight: "1.5" };
