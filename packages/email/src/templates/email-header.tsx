import { Img, Section } from "@react-email/components";

const LOGO_URL = "https://assets.daniellourie.me/email/cometa-logo.svg";

/**
 * Shared email header with the Cometa logo.
 */
export function EmailHeader() {
  return (
    <Section style={headerStyle}>
      <Img
        src={LOGO_URL}
        width="120"
        height="20"
        alt="Cometa"
        style={{ display: "block", margin: "0 auto" }}
      />
    </Section>
  );
}

const headerStyle = {
  textAlign: "center" as const,
  paddingBottom: "20px",
  borderBottom: "1px solid #EBEEF1",
  marginBottom: "24px",
};
