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

interface AllSignedProps {
  documentName: string;
  signers: Array<{
    name: string;
    email: string;
    signedAt: string;
  }>;
}

export function AllSignedEmail({ documentName = "Document", signers = [] }: AllSignedProps) {
  return (
    <Html>
      <Head />
      <Preview>All signatures collected for {documentName}</Preview>
      <Body style={body}>
        <Container style={container}>
          <EmailHeader />
          <Heading style={heading}>All Signatures Collected</Heading>
          <Text style={text}>
            All parties have signed <strong>{documentName}</strong>.
          </Text>
          <Section style={signerList}>
            {signers.map((signer) => (
              <Text key={signer.email} style={signerRow}>
                {signer.name} ({signer.email}) — signed{" "}
                {new Date(signer.signedAt).toLocaleDateString("en-ZA")}
              </Text>
            ))}
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            The document status has been updated to approved. You can view the signed document in
            Cometa.
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
const signerList = {
  backgroundColor: "#F8F8FA",
  borderRadius: "8px",
  padding: "12px 16px",
  margin: "16px 0",
};
const signerRow = { fontSize: "14px", color: "#212327", margin: "4px 0" };
const hr = { borderColor: "#EBEEF1", margin: "24px 0" };
const footer = { fontSize: "13px", color: "#717983", lineHeight: "1.5" };
