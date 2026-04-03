import { DetectDocumentTextCommand, TextractClient } from "@aws-sdk/client-textract";

const region = process.env.AWS_REGION ?? "eu-west-1";

const hasAWSCreds =
  !!process.env.AWS_ACCESS_KEY_ID || !!process.env.AWS_PROFILE || !!process.env.S3_BUCKET;

const textract = hasAWSCreds ? new TextractClient({ region }) : null;

export async function extractText(s3Bucket: string, s3Key: string): Promise<string> {
  if (!textract) {
    console.log("[textract] No AWS credentials available, returning placeholder text");
    return "[OCR placeholder] This is mock OCR text for local development. The document content would be extracted here using AWS Textract.";
  }

  const response = await textract.send(
    new DetectDocumentTextCommand({
      Document: {
        S3Object: {
          Bucket: s3Bucket,
          Name: s3Key,
        },
      },
    }),
  );

  const blocks = response.Blocks ?? [];
  return blocks
    .filter((block) => block.BlockType === "LINE")
    .map((block) => block.Text ?? "")
    .join("\n");
}
