import { Heading, Hr, Text } from "@react-email/components";
import { EmailLayout } from "./email-layout";

interface SubmissionRejectedProps {
  documentName: string;
  reason?: string;
  reviewerNote?: string;
}

export function SubmissionRejectedEmail({
  documentName = "Document",
  reason,
  reviewerNote,
}: SubmissionRejectedProps) {
  return (
    <EmailLayout preview={`Submission rejected: ${documentName}`}>
      <Heading style={heading}>Submission Rejected</Heading>
      <Text style={text}>
        Your submission <strong>{documentName}</strong> has been rejected and requires your attention.
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
        Please resubmit a clearer version of this document. You can reply to this email or upload directly to Cometa.
      </Text>
    </EmailLayout>
  );
}

export const DocumentRejectedEmail = SubmissionRejectedEmail;

const heading = { fontSize: "20px", fontWeight: "600" as const, color: "#212327", marginBottom: "16px" };
const text = { fontSize: "14px", color: "#555A65", lineHeight: "1.6" };
const label = { fontSize: "12px", color: "#717983", fontWeight: "600" as const, textTransform: "uppercase" as const, marginBottom: "4px" };
const hr = { borderColor: "#EBEEF1", margin: "24px 0" };
const footer = { fontSize: "13px", color: "#717983", lineHeight: "1.5" };
