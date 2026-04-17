import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Cometa Gateway",
  description: "MCP server and API gateway for all Cometa services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${inter.variable}`}>
      <body className="h-full flex bg-white font-sans">
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
