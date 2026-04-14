import { AllSignedEmail, OtpEmail, SignatureRequestEmail, sendEmail } from "@cometa/email";

const APP_URL =
  process.env.SIGNATURES_APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function sendSigningInvite(params: {
  signerEmail: string;
  signerToken: string;
  senderEmail: string;
  fileName: string;
  fileType?: string;
  message?: string;
}) {
  const signUrl = `${APP_URL}/sign/${params.signerToken}`;
  await sendEmail({
    to: params.signerEmail,
    subject: `${params.senderEmail} sent you a document to sign`,
    react: SignatureRequestEmail({
      documentName: params.fileName,
      documentType: params.fileType ?? "document",
      senderEmail: params.senderEmail,
      message: params.message,
      signUrl,
    }),
  });
}

export async function sendOtpEmail(email: string, otp: string) {
  await sendEmail({
    to: email,
    subject: "Your verification code",
    react: OtpEmail({ otp }),
  });
}

export async function sendAllSignedEmail(params: {
  to: string;
  fileName: string;
  signers: Array<{ name: string; email: string; signedAt: string }>;
}) {
  await sendEmail({
    to: params.to,
    subject: "All signatures collected",
    react: AllSignedEmail({
      documentName: params.fileName,
      signers: params.signers,
    }),
  });
}
