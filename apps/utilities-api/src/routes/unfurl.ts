import { Hono } from "hono";
import type { UtilitiesEnv } from "../lib/types.js";

interface OgMetadata {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  favicon?: string;
  type?: string;
}

// ── Known URL patterns → metadata without fetching ──

const GOOGLE_PATTERNS: { re: RegExp; type: string; siteName: string; favicon: string }[] = [
  {
    re: /docs\.google\.com\/document\/d\/([^/]+)/,
    type: "Google Doc",
    siteName: "Google Docs",
    favicon: "https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico",
  },
  {
    re: /docs\.google\.com\/spreadsheets\/d\/([^/]+)/,
    type: "Google Sheet",
    siteName: "Google Sheets",
    favicon: "https://ssl.gstatic.com/docs/spreadsheets/favicon3.ico",
  },
  {
    re: /docs\.google\.com\/presentation\/d\/([^/]+)/,
    type: "Google Slides",
    siteName: "Google Slides",
    favicon: "https://ssl.gstatic.com/docs/presentations/images/favicon5.ico",
  },
  {
    re: /drive\.google\.com\/file\/d\/([^/]+)/,
    type: "Google Drive File",
    siteName: "Google Drive",
    favicon: "https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png",
  },
  {
    re: /drive\.google\.com\/drive\/folders\/([^/?]+)/,
    type: "Google Drive Folder",
    siteName: "Google Drive",
    favicon: "https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png",
  },
];

const KNOWN_PATTERNS: {
  re: RegExp;
  derive: (url: string, match: RegExpMatchArray) => OgMetadata;
}[] = [
  {
    re: /dropbox\.com\//,
    derive: (url) => ({
      url,
      siteName: "Dropbox",
      title: "Dropbox file",
      favicon: "https://cfl.dropboxstatic.com/static/images/favicon.ico",
      type: "Dropbox",
    }),
  },
  {
    re: /onedrive\.live\.com|sharepoint\.com/,
    derive: (url) => ({
      url,
      siteName: "OneDrive",
      title: "OneDrive file",
      favicon: "https://p.sfx.ms/images/favicon.ico",
      type: "OneDrive",
    }),
  },
  {
    re: /notion\.so\//,
    derive: (url) => ({
      url,
      siteName: "Notion",
      title: "Notion page",
      favicon: "https://www.notion.so/images/favicon.ico",
      type: "Notion",
    }),
  },
];

function matchKnownUrl(url: string): OgMetadata | null {
  for (const p of GOOGLE_PATTERNS) {
    const m = url.match(p.re);
    if (m) {
      return {
        url,
        title: p.type,
        description: `Open in ${p.siteName}`,
        siteName: p.siteName,
        favicon: p.favicon,
        type: p.type,
      };
    }
  }
  for (const p of KNOWN_PATTERNS) {
    const m = url.match(p.re);
    if (m) return p.derive(url, m);
  }
  return null;
}

// ── HTML OG parsing ──

function extractMeta(html: string, property: string): string | undefined {
  const re = new RegExp(
    `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']` +
      `|<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`,
    "i",
  );
  const match = html.match(re);
  return match?.[1] ?? match?.[2] ?? undefined;
}

function extractTitle(html: string): string | undefined {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match?.[1]?.trim();
}

function extractFavicon(html: string, baseUrl: string): string | undefined {
  const match = html.match(
    /<link[^>]+rel=["'](?:icon|shortcut icon)["'][^>]+href=["']([^"']+)["']/i,
  );
  if (!match?.[1]) return `${new URL(baseUrl).origin}/favicon.ico`;
  const href = match[1];
  if (href.startsWith("http")) return href;
  if (href.startsWith("//")) return `https:${href}`;
  return new URL(href, baseUrl).href;
}

// ── Route ──

const app = new Hono<UtilitiesEnv>();

app.get("/", async (c) => {
  const url = c.req.query("url");
  if (!url) {
    return c.json({ error: "url parameter required" }, 400);
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return c.json({ error: "Invalid URL" }, 400);
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return c.json({ error: "Only HTTP(S) URLs supported" }, 400);
  }

  // Check known URL patterns first — no fetch needed
  const known = matchKnownUrl(url);
  if (known) {
    return c.json(known, 200, { "Cache-Control": "public, max-age=86400" });
  }

  // Fall back to fetching OG tags for unknown URLs
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Cometa-Bot/1.0 (link preview)",
        Accept: "text/html",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      return c.json({ url, title: parsed.hostname } satisfies OgMetadata);
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) {
      return c.json({ url, title: parsed.hostname } satisfies OgMetadata);
    }

    const reader = res.body?.getReader();
    if (!reader) {
      return c.json({ url, title: parsed.hostname } satisfies OgMetadata);
    }

    let html = "";
    const decoder = new TextDecoder();
    while (html.length < 50_000) {
      const { done, value } = await reader.read();
      if (done) break;
      html += decoder.decode(value, { stream: true });
    }
    reader.cancel();

    const metadata: OgMetadata = {
      url,
      title: extractMeta(html, "og:title") ?? extractTitle(html),
      description: extractMeta(html, "og:description") ?? extractMeta(html, "description"),
      image: extractMeta(html, "og:image"),
      siteName: extractMeta(html, "og:site_name"),
      favicon: extractFavicon(html, url),
    };

    if (metadata.image && !metadata.image.startsWith("http")) {
      metadata.image = new URL(metadata.image, url).href;
    }

    return c.json(metadata, 200, {
      "Cache-Control": "public, max-age=3600",
    });
  } catch {
    return c.json({ url, title: parsed.hostname } satisfies OgMetadata);
  }
});

export const unfurlRoutes = app;
