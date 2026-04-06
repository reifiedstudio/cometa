import {
  DetectDocumentTextCommand,
  GetDocumentTextDetectionCommand,
  StartDocumentTextDetectionCommand,
  TextractClient,
  type Block,
} from "@aws-sdk/client-textract";

const region = process.env.AWS_REGION ?? "us-east-1";

const hasAWSCreds =
  !!process.env.AWS_ACCESS_KEY_ID || !!process.env.AWS_PROFILE || !!process.env.S3_BUCKET;

const textract = hasAWSCreds ? new TextractClient({ region }) : null;

export async function extractText(s3Bucket: string, s3Key: string): Promise<string> {
  if (!textract) {
    console.log("[ocr] No AWS credentials — skipping extraction");
    return "";
  }

  const isPdf = s3Key.toLowerCase().endsWith(".pdf");

  if (isPdf) {
    return extractTextAsync(s3Bucket, s3Key);
  }

  return extractTextSync(s3Bucket, s3Key);
}

/** Sync API for images (PNG, JPEG, TIFF) */
async function extractTextSync(s3Bucket: string, s3Key: string): Promise<string> {
  const response = await textract!.send(
    new DetectDocumentTextCommand({
      Document: {
        S3Object: {
          Bucket: s3Bucket,
          Name: s3Key,
        },
      },
    }),
  );

  return blocksToText(response.Blocks ?? []);
}

/** Async API for PDFs — polls with exponential backoff */
async function extractTextAsync(s3Bucket: string, s3Key: string): Promise<string> {
  const startResponse = await textract!.send(
    new StartDocumentTextDetectionCommand({
      DocumentLocation: {
        S3Object: {
          Bucket: s3Bucket,
          Name: s3Key,
        },
      },
    }),
  );

  const jobId = startResponse.JobId!;
  console.log(`[ocr] Started Textract job ${jobId} for ${s3Key}`);

  // Poll with exponential backoff
  let delay = 2000;
  const maxDelay = 30000;
  const maxElapsed = 5 * 60 * 1000; // 5 minutes
  const startTime = Date.now();

  while (Date.now() - startTime < maxElapsed) {
    await sleep(delay);

    const result = await textract!.send(
      new GetDocumentTextDetectionCommand({ JobId: jobId }),
    );

    const status = result.JobStatus ?? "FAILED";
    console.log(`[ocr] Job ${jobId} status: ${status}`);

    if (status === "SUCCEEDED") {
      // Collect all blocks, handling pagination
      const allBlocks: Block[] = result.Blocks ?? [];
      let nextToken = result.NextToken;

      while (nextToken) {
        const nextResult = await textract!.send(
          new GetDocumentTextDetectionCommand({ JobId: jobId, NextToken: nextToken }),
        );
        allBlocks.push(...(nextResult.Blocks ?? []));
        nextToken = nextResult.NextToken;
      }

      console.log(`[ocr] Job ${jobId} complete — ${allBlocks.length} blocks`);
      return blocksToText(allBlocks);
    }

    if (status === "FAILED") {
      throw new Error(`Textract job ${jobId} failed: ${result.StatusMessage ?? "unknown error"}`);
    }

    // Exponential backoff, capped at maxDelay
    delay = Math.min(delay * 2, maxDelay);
  }

  throw new Error(`Textract job ${jobId} timed out after 5 minutes`);
}

function blocksToText(blocks: Block[]): string {
  return blocks
    .filter((block) => block.BlockType === "LINE")
    .map((block) => block.Text ?? "")
    .join("\n");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
