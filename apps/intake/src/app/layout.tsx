"use client";

import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/clerk-react";
import "./globals.css";

const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider publishableKey={clerkPubKey} afterSignOutUrl="/sign-in/">
      <html lang="en" className="h-full antialiased">
        <body className="h-full flex bg-white font-sans">
          {children}
          <Toaster position="bottom-right" richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}
