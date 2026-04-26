import type { Meta, StoryObj } from "@storybook/react";
import {
  AllSignedEmail,
  NoteCreatedEmail,
  SubmissionApprovedEmail,
  SubmissionRejectedEmail,
  OtpEmail,
  SignatureRequestEmail,
} from "../index";
import { EmailPreview } from "./email-preview";

// ── Intake ──

const intakeMeta: Meta<typeof EmailPreview> = {
  title: "Intake",
  component: EmailPreview,
  parameters: { layout: "fullscreen" },
};
export default intakeMeta;
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
