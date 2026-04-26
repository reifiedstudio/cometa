import type { Metadata } from "next";
import { NavigationProgress } from "@cometa/ui/navigation-progress";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cometa Notes",
  description: "AI-generated notes and reports",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full flex bg-white font-sans">
        <NavigationProgress />
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
