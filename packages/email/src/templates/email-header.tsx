import { Section } from "@react-email/components";

/**
 * Shared email header with the Cometa logo mark.
 * Use at the top of every email template.
 */
export function EmailHeader() {
  return (
    <Section style={headerStyle}>
      <svg
        width="24"
        height="32"
        viewBox="169.921 7.566 18.388 24.118"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", margin: "0 auto 12px" }}
      >
        <g fill="#212327">
          <path d="M188.309 31.6841H169.921V20.0364H176.609C183.076 20.0364 188.309 25.2502 188.309 31.677V31.6841Z" />
          <path d="M188.309 7.56566H169.921V19.2062H176.609C183.076 19.2062 188.309 13.9925 188.309 7.56566V7.56566Z" />
        </g>
      </svg>
    </Section>
  );
}

const headerStyle = {
  textAlign: "center" as const,
  paddingBottom: "16px",
  borderBottom: "1px solid #EBEEF1",
  marginBottom: "24px",
};
