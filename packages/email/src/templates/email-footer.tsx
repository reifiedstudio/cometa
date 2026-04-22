import { Hr, Section, Text } from "@react-email/components";

/**
 * Shared email footer with confidentiality notice.
 */
export function EmailFooter() {
  return (
    <Section>
      <Hr style={hr} />
      <Text style={confidentiality}>
        This email and any attachments are confidential and intended solely for the use of the
        individual or entity to whom they are addressed. If you have received this email in error,
        please notify the sender immediately and delete the message. Any unauthorised review, use,
        disclosure, or distribution is prohibited.
      </Text>
      <Text style={company}>
        © {new Date().getFullYear()} Cometa. All rights reserved.
      </Text>
    </Section>
  );
}

const hr = { borderColor: "#EBEEF1", margin: "24px 0 16px" };
const confidentiality = {
  fontSize: "11px",
  color: "#9CA3AF",
  lineHeight: "1.5",
  margin: "0 0 8px",
};
const company = {
  fontSize: "11px",
  color: "#9CA3AF",
  margin: "0",
};
