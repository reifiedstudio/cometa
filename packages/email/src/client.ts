import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

export const resend = apiKey ? new Resend(apiKey) : null;

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string;
  subject: string;
  react: React.ReactElement;
}) {
  if (!resend) {
    console.log(`[email] No RESEND_API_KEY — would send to ${to}: ${subject}`);
    return null;
  }

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "Cometa <docs@daniellourie.me>",
    to,
    subject,
    react,
  });

  if (error) {
    console.error("[email] Failed to send:", error);
    throw error;
  }

  console.log(`[email] Sent to ${to}: ${subject} (id: ${data?.id})`);
  return data;
}
