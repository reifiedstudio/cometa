import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Hr,
} from "@react-email/components";

interface OtpProps {
  otp: string;
}

export function OtpEmail({ otp = "000000" }: OtpProps) {
  return (
    <Html>
      <Head />
      <Preview>Your verification code is {otp}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Verification Code</Heading>
          <Text style={text}>
            Enter this code to verify your identity and view the document:
          </Text>
          <Text style={code}>{otp}</Text>
          <Hr style={hr} />
          <Text style={footer}>
            This code expires in 10 minutes. If you did not request this, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body = { backgroundColor: "#f6f6f6", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" };
const container = { backgroundColor: "#ffffff", margin: "40px auto", padding: "32px", borderRadius: "12px", maxWidth: "480px" };
const heading = { fontSize: "20px", fontWeight: "600" as const, color: "#212327", marginBottom: "16px" };
const text = { fontSize: "14px", color: "#555A65", lineHeight: "1.6" };
const code = { fontSize: "32px", fontWeight: "700" as const, color: "#212327", textAlign: "center" as const, letterSpacing: "8px", padding: "16px", backgroundColor: "#F8F8FA", borderRadius: "8px" };
const hr = { borderColor: "#EBEEF1", margin: "24px 0" };
const footer = { fontSize: "13px", color: "#717983", lineHeight: "1.5" };
