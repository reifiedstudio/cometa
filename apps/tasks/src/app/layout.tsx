import { QueryProvider } from "@/components/query-provider";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cometa — Tasks",
  description: "Task management dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <div className="min-h-screen">
            <nav className="border-b border-border px-6 h-14 flex items-center gap-6">
              <a href="/" className="text-sm font-semibold tracking-tight">
                cometa
              </a>
              <span className="text-xs text-muted-foreground">tasks</span>
            </nav>
            <main>{children}</main>
          </div>
          <Toaster position="bottom-right" />
        </QueryProvider>
      </body>
    </html>
  );
}
