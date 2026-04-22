import type { Meta, StoryObj } from "@storybook/react";
import {
  AllSignedEmail,
  SubmissionApprovedEmail,
  SubmissionRejectedEmail,
  OtpEmail,
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

export const SubmissionApproved: Story = {
  args: {
    name: "Submission Approved",
    subject: "Your invoice submission was approved",
    email: (
      <SubmissionApprovedEmail
        documentName="Invoice INV-2026-Q1-4521"
        documentType="invoice"
      />
    ),
  },
};

export const SubmissionRejected: Story = {
  args: {
    name: "Submission Rejected",
    subject: "Your invoice submission was rejected",
    email: (
      <SubmissionRejectedEmail
        documentName="Invoice INV-2026-Q1-4521"
        reason="Amount mismatch — please resubmit with correct totals."
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
