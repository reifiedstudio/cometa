import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cometa",
  description: "Document management for South African businesses",
};

function HomeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function DocumentsIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function Sidebar() {
  return (
    <aside className="flex flex-col items-center w-[60px] border-r border-[#EBEEF1] bg-white py-4">
      {/* Logo */}
      <div className="mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="32" height="32">
          <defs>
            <clipPath id="lc"><rect width="200" height="200" x="0" y="0" /></clipPath>
            <g id="lg"><g transform="matrix(0.997,0,0,1,100.147,100)" opacity="1"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="rgb(255,0,0)" fillOpacity="1" d="M51.995,-68.599 C51.995,-31.97 22.612,-2.586 -14.017,-2.586 C-14.017,-2.586 -51.854,-2.586 -51.854,-2.586 C-53.188,-2.586 -54.269,-1.505 -54.269,-0.171 C-54.269,1.163 -53.188,2.244 -51.854,2.244 C-51.854,2.244 -14.017,2.244 -14.017,2.244 C22.612,2.244 51.995,31.628 51.995,68.257 C51.995,68.257 52.995,68.257 52.995,68.257 C52.995,68.257 52.995,-68.599 52.995,-68.599 C52.995,-68.599 51.995,-68.599 51.995,-68.599z" /></g></g></g>
            <filter id="lf" filterUnits="objectBoundingBox" x="0%" y="0%" width="100%" height="100%"><feComponentTransfer in="SourceGraphic"><feFuncA type="table" tableValues="1.0 0.0" /></feComponentTransfer></filter>
            <mask id="lm" maskType="alpha"><g filter="url(#lf)"><rect width="200" height="200" x="0" y="0" fill="#ffffff" opacity="0" /><use xlinkHref="#lg" /></g></mask>
          </defs>
          <g clipPath="url(#lc)"><g mask="url(#lm)"><g transform="matrix(1,0,0,1,100,100)" opacity="1"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="rgb(0,0,0)" fillOpacity="1" d="M-51.925,-68.428 L51.925,-68.428 L51.925,68.428 L-51.925,68.428z" /></g></g></g></g>
        </svg>
      </div>

      {/* Nav icons */}
      <nav className="flex flex-col items-center gap-1 flex-1">
        <SidebarButton icon={<HomeIcon />} label="Home" />
        <SidebarButton icon={<DocumentsIcon />} label="Documents" active />
        <SidebarButton icon={<TrashIcon />} label="Trash" />
      </nav>

      {/* User avatar */}
      <div className="mt-auto">
        <div className="w-8 h-8 rounded-full bg-[#D09305] flex items-center justify-center text-white text-xs font-semibold select-none">
          DL
        </div>
      </div>
    </aside>
  );
}

function SidebarButton({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
          active
            ? "bg-[#F8F8F8] text-[#212327]"
            : "text-[#717983] hover:bg-[#F8F8F8] hover:text-[#555A65]"
        }`}
      >
        {icon}
      </TooltipTrigger>
      <TooltipContent side="right">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full flex bg-white font-[family-name:var(--font-geist-sans)]">
        <TooltipProvider>
          <Sidebar />
          <main className="flex-1 flex flex-col min-h-0">{children}</main>
          <Toaster position="bottom-right" richColors />
        </TooltipProvider>
      </body>
    </html>
  );
}
