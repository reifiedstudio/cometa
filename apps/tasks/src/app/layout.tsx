import { QueryProvider } from "@/components/query-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Cometa — Tasks",
  description: "Task management dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full antialiased ${inter.variable}`}>
      <body className="h-full flex bg-white font-sans">
        <QueryProvider>
          <div className="flex flex-1 flex-col min-h-0 w-full">{children}</div>
          <Toaster position="bottom-right" />
        </QueryProvider>
      </body>
    </html>
  );
}
