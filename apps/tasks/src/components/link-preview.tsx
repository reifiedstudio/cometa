"use client";

import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://agfgro77yt22bbazajupls2ebu0jvfcn.lambda-url.us-east-1.on.aws";

interface OgMetadata {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  favicon?: string;
}

const URL_REGEX = /https?:\/\/[^\s<]+/g;

export function extractUrls(text: string): string[] {
  return [...new Set(text.match(URL_REGEX) ?? [])];
}

async function fetchUnfurl(url: string): Promise<OgMetadata> {
  const res = await fetch(`${API_URL}/api/unfurl?url=${encodeURIComponent(url)}`);
  if (!res.ok) throw new Error("Failed to unfurl");
  return res.json();
}

function PreviewCard({ url }: { url: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["unfurl", url],
    queryFn: () => fetchUnfurl(url),
    staleTime: 60 * 60 * 1000, // 1 hour
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="border border-border rounded-md p-3 animate-pulse">
        <div className="h-3 w-2/3 bg-muted rounded" />
        <div className="h-2 w-1/2 bg-muted rounded mt-2" />
      </div>
    );
  }

  if (!data?.title) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-3 border border-border rounded-md p-3 hover:bg-muted/50 transition-colors group overflow-hidden"
    >
      {data.image && (
        <img
          src={data.image}
          alt=""
          className="w-16 h-16 rounded object-cover shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      )}
      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="flex items-center gap-1.5">
          {data.favicon && (
            <img
              src={data.favicon}
              alt=""
              className="w-3.5 h-3.5 rounded-sm shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
          <span className="text-[10px] text-muted-foreground truncate">
            {data.siteName ?? new URL(url).hostname}
          </span>
        </div>
        <p className="text-xs font-medium truncate group-hover:text-primary transition-colors">
          {data.title}
        </p>
        {data.description && (
          <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
            {data.description}
          </p>
        )}
      </div>
      <ExternalLink
        size={12}
        className="shrink-0 mt-0.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </a>
  );
}

export function LinkPreviews({ text }: { text: string }) {
  const urls = extractUrls(text);
  if (urls.length === 0) return null;

  return (
    <div className="space-y-1.5 mt-2">
      {urls.slice(0, 3).map((url) => (
        <PreviewCard key={url} url={url} />
      ))}
    </div>
  );
}
