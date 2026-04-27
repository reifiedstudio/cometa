import { AuthSync } from "@/components/auth-sync";
import { AppClerkProvider } from "@/components/clerk-provider";
import { QueryProvider } from "@/components/query-provider";
import type { Metadata } from "next";
import { NavigationProgress } from "@cometa/ui/navigation-progress";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cometa — Tasks",
  description: "Task management dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full flex bg-white font-sans">
        <NavigationProgress />
        <AppClerkProvider>
          <AuthSync />
          <QueryProvider>
            <div className="flex flex-1 flex-col min-h-0 w-full">{children}</div>
            <Toaster position="bottom-right" />
          </QueryProvider>
        </AppClerkProvider>
      </body>
    </html>
  );
}
