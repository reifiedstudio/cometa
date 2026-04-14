import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  if (event.requestContext.http.method === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders() };
  }

  if (event.requestContext.http.method !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  let body: { html: string; filename?: string };
  try {
    body = JSON.parse(event.body ?? "{}");
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }

  if (!body.html) {
    return json(400, { error: "Missing 'html' field" });
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();
    await page.setContent(body.html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "1.5cm", bottom: "2cm", left: "1.5cm", right: "1.5cm" },
      displayHeaderFooter: true,
      headerTemplate: "<span></span>",
      footerTemplate: `
        <div style="width: 100%; font-size: 8pt; color: #999; padding: 0 1.5cm; display: flex; justify-content: space-between;">
          <span>${body.filename ?? "Document"}</span>
          <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>
      `,
    });

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders(),
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${body.filename ?? "document"}.pdf"`,
      },
      body: Buffer.from(pdf).toString("base64"),
      isBase64Encoded: true,
    };
  } catch (err) {
    console.error("[pdf-converter] Error:", err);
    return json(500, { error: err instanceof Error ? err.message : "PDF generation failed" });
  } finally {
    if (browser) await browser.close();
  }
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function json(status: number, body: Record<string, unknown>): APIGatewayProxyResultV2 {
  return {
    statusCode: status,
    headers: { ...corsHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}
