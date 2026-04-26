import { render } from "@react-email/render";
import { Resend } from "resend";

const apiKey = typeof process !== "undefined" ? process.env?.RESEND_API_KEY : undefined;

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

  // Pre-render to HTML to avoid Resend's internal @react-email/render call
  // which breaks in bun-bundled Lambda builds due to version mismatches.
  const html = await render(react);
  console.log(`[email] Rendered HTML length: ${html?.length ?? 0}, starts with: ${html?.substring(0, 50)}`);

  const { data, error } = await resend.emails.send({
    from: (typeof process !== "undefined" ? process.env?.EMAIL_FROM : undefined) ?? "Cometa <docs@daniellourie.me>",
    to,
    subject,
    html,
  });

  if (error) {
    console.error("[email] Failed to send:", error);
    throw error;
  }

  console.log(`[email] Sent to ${to}: ${subject} (id: ${data?.id})`);
  return data;
}
