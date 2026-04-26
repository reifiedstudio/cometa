import type { Meta, StoryObj } from "@storybook/react";
import {
  AllSignedEmail,
  OtpEmail,
  SignatureRequestEmail,
} from "../index";
import { EmailPreview } from "./email-preview";

const meta: Meta<typeof EmailPreview> = {
  title: "Signatures",
  component: EmailPreview,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof EmailPreview>;

export const SignatureRequest: Story = {
  args: {
    name: "Signature Request",
    subject: "daniel@reified.studio sent you a document to sign",
    email: (
      <SignatureRequestEmail
        documentName="NDA — Acme Corp"
        documentType="contract"
        senderEmail="daniel@reified.studio"
        message="Please review and sign at your earliest convenience."
        signUrl="https://sign.daniellourie.me/sign/abc123"
      />
    ),
  },
};

export const AllSigned: Story = {
  args: {
    name: "All Signed",
    subject: "All parties have signed: NDA — Acme Corp",
    email: (
      <AllSignedEmail
        documentName="NDA — Acme Corp"
        signers={[
          { name: "Sarah Chen", email: "sarah@acme.com", signedAt: "2026-04-25T14:30:00Z" },
          { name: "James Park", email: "james@reified.dev", signedAt: "2026-04-25T16:45:00Z" },
        ]}
      />
    ),
  },
};

export const Otp: Story = {
  args: {
    name: "OTP Verification",
    subject: "Your verification code",
    email: <OtpEmail otp="482917" />,
  },
};
