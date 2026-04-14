import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cometa Drive",
  description: "Google Drive handoffs and access routing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full flex bg-white font-sans">
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
