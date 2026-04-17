import type { Meta, StoryObj } from "@storybook/react";
import {
  AllSignedEmail,
  DocumentApprovedEmail,
  DocumentRejectedEmail,
  OtpEmail,
  ResubmitRequestEmail,
  SignatureRequestEmail,
} from "../index";
import { EmailPreview } from "./email-preview";

const meta: Meta<typeof EmailPreview> = {
  title: "Emails",
  component: EmailPreview,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof EmailPreview>;

export const DocumentApproved: Story = {
  args: {
    name: "Document Approved",
    subject: "Your invoice was approved",
    email: (
      <DocumentApprovedEmail
        documentName="Invoice INV-2026-Q1-4521"
        documentType="invoice"
      />
    ),
  },
};

export const DocumentRejected: Story = {
  args: {
    name: "Document Rejected",
    subject: "Your invoice was rejected",
    email: (
      <DocumentRejectedEmail
        documentName="Invoice INV-2026-Q1-4521"
        reason="Amount mismatch — please resubmit with correct totals."
      />
    ),
  },
};

export const ResubmitRequest: Story = {
  args: {
    name: "Resubmit Request",
    subject: "Please resubmit your document",
    email: (
      <ResubmitRequestEmail
        documentName="Eskom Bill — March 2026"
        issue="The scan is too blurry to read the account number."
      />
    ),
  },
};

export const SignatureRequest: Story = {
  args: {
    name: "Signature Request",
    subject: "You've been asked to sign a document",
    email: (
      <SignatureRequestEmail
        documentName="NDA — Acme Corp"
        documentType="contract"
      />
    ),
  },
};

export const AllSigned: Story = {
  args: {
    name: "All Signed",
    subject: "All parties have signed",
    email: (
      <AllSignedEmail
        documentName="NDA — Acme Corp"
        signers={[
          { name: "Sarah Chen", email: "sarah@acme.com" },
          { name: "James Park", email: "james@reified.dev" },
        ]}
      />
    ),
  },
};

export const Otp: Story = {
  args: {
    name: "OTP Code",
    subject: "Your verification code",
    email: <OtpEmail otp="482917" />,
  },
};
