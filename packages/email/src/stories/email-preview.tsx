import { render } from "@react-email/render";
import { useEffect, useRef, useState } from "react";

interface EmailPreviewProps {
  /** Display name shown in the topbar */
  name: string;
  /** Subject line shown in the topbar */
  subject: string;
  /** The email template element to render */
  email: React.ReactElement;
}

/**
 * Renders a react-email template inside an email-client-style frame.
 * Uses an iframe so the email's own CSS is sandboxed from the surrounding page,
 * matching how real email clients render messages.
 */
export function EmailPreview({ name, subject, email }: EmailPreviewProps) {
  const [html, setHtml] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let cancelled = false;
    render(email, { pretty: true }).then((output) => {
      if (!cancelled) setHtml(output);
    });
    return () => {
      cancelled = true;
    };
  }, [email]);

  // Auto-resize iframe to fit its email content.
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !html) return;
    const onLoad = () => {
      try {
        const doc = iframe.contentDocument;
        if (doc) iframe.style.height = `${doc.documentElement.scrollHeight}px`;
      } catch {
        /* cross-origin or doc not ready — ignore */
      }
    };
    iframe.addEventListener("load", onLoad);
    return () => iframe.removeEventListener("load", onLoad);
  }, [html]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
      }}
    >
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "white",
          borderBottom: "1px solid #e2e8f0",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <span style={{ fontWeight: 600, fontSize: "14px" }}>{name}</span>
        <span style={{ color: "#e2e8f0" }}>|</span>
        <span style={{ fontSize: "13px", color: "#64748b" }}>{subject}</span>
      </header>
      <div style={{ padding: "32px 24px 64px" }}>
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            background: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          {html ? (
            <iframe
              ref={iframeRef}
              srcDoc={html}
              title={name}
              style={{
                display: "block",
                width: "100%",
                border: 0,
                minHeight: "400px",
              }}
            />
          ) : (
            <div
              style={{
                padding: "48px",
                textAlign: "center",
                color: "#94a3b8",
                fontSize: "13px",
              }}
            >
              Rendering...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
