"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Logo } from "@cometa/ui/logo";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye,
  Loader2,
  Lock,
  PenLine,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const SIGN_API_URL = process.env.NEXT_PUBLIC_SIGN_API_URL ?? "https://mcp.daniellourie.me";

const signerStatusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "Pending", color: "bg-orange-100 text-orange-700", icon: Clock },
  viewed: { label: "Viewed", color: "bg-blue-100 text-blue-700", icon: Eye },
  signed: { label: "Signed", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  declined: { label: "Declined", color: "bg-red-100 text-red-700", icon: XCircle },
  expired: { label: "Expired", color: "bg-gray-100 text-gray-600", icon: AlertCircle },
};

interface Signer {
  email: string;
  status: string;
  signedAt?: string;
  name?: string;
}

interface SignPageData {
  signer: Signer;
  document: { id: string; name: string; type: string; description?: string; thumbnailUrl?: string };
  request: { message?: string; requestedByEmail: string; expiresAt: string };
  signatures: Signer[];
}

type Step = "loading" | "error" | "verify" | "otp" | "sign" | "done" | "already-signed";

export default function SignPage() {
  const pathname = usePathname();
  const token = pathname?.replace(/^\//, "").replace(/\/$/, "") ?? "";
  const [step, setStep] = useState<Step>("loading");
  const [data, setData] = useState<SignPageData | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // OTP state
  const [otpSending, setOtpSending] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpVerifying, setOtpVerifying] = useState(false);

  // Signing state
  const [signerName, setSignerName] = useState("");
  const [signing, setSigning] = useState(false);

  // Document viewing
  const [viewingDoc, setViewingDoc] = useState(false);
  const [docUrl, setDocUrl] = useState<string | null>(null);
  const [showDocViewer, setShowDocViewer] = useState(false);

  const handleViewDocument = async () => {
    if (docUrl) {
      setShowDocViewer(true);
      return;
    }
    setViewingDoc(true);
    try {
      const res = await fetch(`${SIGN_API_URL}/sign/${token}/document`);
      if (!res.ok) throw new Error("Failed to load document");
      const result = await res.json();
      setDocUrl(result.url);
      setShowDocViewer(true);
    } catch {
      // ignore
    } finally {
      setViewingDoc(false);
    }
  };

  // Fetch signer info on mount
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${SIGN_API_URL}/sign/${token}`);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setErrorMessage(body.error || "This signing link is invalid or has expired.");
          setStep("error");
          return;
        }
        const result = await res.json();
        setData(result);
        if (result.signer.status === "signed") {
          setStep("already-signed");
        } else {
          setStep("verify");
        }
      } catch {
        setErrorMessage("Failed to load signing information.");
        setStep("error");
      }
    }
    if (token && token !== "_") load();
  }, [token]);

  const handleSendOtp = async () => {
    setOtpSending(true);
    try {
      const res = await fetch(`${SIGN_API_URL}/sign/${token}/otp`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to send OTP");
      setStep("otp");
    } catch {
      setErrorMessage("Failed to send verification code. Please try again.");
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    setOtpVerifying(true);
    try {
      const res = await fetch(`${SIGN_API_URL}/sign/${token}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: otpCode }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setErrorMessage(body.error || "Invalid code. Please try again.");
        setOtpVerifying(false);
        return;
      }
      setErrorMessage("");
      setStep("sign");
    } catch {
      setErrorMessage("Verification failed. Please try again.");
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleSign = async () => {
    if (!signerName.trim()) return;
    setSigning(true);
    try {
      const res = await fetch(`${SIGN_API_URL}/sign/${token}/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: signerName.trim() }),
      });
      if (!res.ok) throw new Error("Failed to sign");
      setStep("done");
    } catch {
      setErrorMessage("Failed to sign document. Please try again.");
    } finally {
      setSigning(false);
    }
  };

  if (step === "loading") {
    return (
      <div className="w-full max-w-lg mx-4">
        <div className="bg-card rounded-xl shadow-sm border p-8 flex flex-col items-center gap-3">
          <Loader2 size={24} className="animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="w-full max-w-lg mx-4">
        <div className="bg-card rounded-xl shadow-sm border p-8 text-center">
          <div className="flex justify-center mb-3">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">Unable to Load</h2>
          <p className="text-sm text-muted-foreground">{errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-4">
      <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
        {/* Header with branding */}
        <div className="px-6 py-5 border-b">
          <div className="mb-4">
            <Logo className="h-5 w-auto" />
          </div>
          <h1 className="text-lg font-semibold text-foreground">{data?.document.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {data?.request.requestedByEmail} has requested your signature
          </p>
          {data?.request.message && (
            <div className="mt-3 p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground italic">
                &ldquo;{data.request.message}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Signers overview */}
        {data && data.signatures.length > 1 && (
          <div className="px-6 py-4 border-b">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Signers
            </p>
            <div className="space-y-2">
              {data.signatures.map((s) => {
                const config = signerStatusConfig[s.status] ?? signerStatusConfig.pending;
                const Icon = config.icon;
                return (
                  <div key={s.email} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{s.name || s.email}</span>
                    <Badge className={config.color}>
                      <Icon size={12} />
                      {config.label}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* View document -- available after OTP verification */}
        {(step === "sign" || step === "done" || step === "already-signed") && (
          <div className="px-6 py-4 border-b">
            <Button
              variant="outline"
              className="w-full gap-2 py-2.5"
              onClick={handleViewDocument}
              disabled={viewingDoc}
            >
              {viewingDoc ? <Loader2 size={14} className="animate-spin" /> : <Eye size={14} />}
              {viewingDoc ? "Opening..." : "View Document"}
            </Button>
          </div>
        )}

        {/* Main content area */}
        <div className="px-6 py-6">
          {/* Step: Already signed */}
          {step === "already-signed" && (
            <div className="text-center py-4">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 size={24} className="text-emerald-600" />
                </div>
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-1">Already Signed</h2>
              <p className="text-sm text-muted-foreground">
                You have already signed this document.
              </p>
            </div>
          )}

          {/* Step: Verify identity */}
          {step === "verify" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <ShieldCheck size={16} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Verify your identity</h2>
                  <p className="text-xs text-muted-foreground">
                    We&apos;ll send a verification code to{" "}
                    <span className="font-medium text-muted-foreground">{data?.signer.email}</span>
                  </p>
                </div>
              </div>
              <Button className="w-full gap-1.5" onClick={handleSendOtp} disabled={otpSending}>
                {otpSending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <ShieldCheck size={14} />
                )}
                {otpSending ? "Sending..." : "Send Verification Code"}
              </Button>
            </div>
          )}

          {/* Step: Enter OTP */}
          {step === "otp" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <ShieldCheck size={16} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Enter verification code</h2>
                  <p className="text-xs text-muted-foreground">
                    Check your email for a 6-digit code
                  </p>
                </div>
              </div>
              {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otpCode}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setOtpCode(val);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && otpCode.length === 6) handleVerifyOtp();
                }}
                placeholder="000000"
                className="w-full px-4 py-3 text-center text-2xl font-mono tracking-[0.5em] border rounded-lg outline-none focus:border-foreground transition-colors"
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setStep("verify");
                    setOtpCode("");
                    setErrorMessage("");
                  }}
                >
                  Back
                </Button>
                <Button
                  className="flex-1 gap-1.5"
                  onClick={handleVerifyOtp}
                  disabled={otpVerifying || otpCode.length !== 6}
                >
                  {otpVerifying ? <Loader2 size={14} className="animate-spin" /> : null}
                  {otpVerifying ? "Verifying..." : "Verify"}
                </Button>
              </div>
            </div>
          )}

          {/* Step: Sign */}
          {step === "sign" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <PenLine size={16} className="text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Sign document</h2>
                  <p className="text-xs text-muted-foreground">
                    Enter your full legal name to sign
                  </p>
                </div>
              </div>
              {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
              <div>
                <input
                  type="text"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && signerName.trim()) handleSign();
                  }}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 text-sm border rounded-lg outline-none focus:border-foreground transition-colors"
                  autoFocus
                />
                {signerName.trim() && (
                  <div className="mt-3 px-4 py-3 bg-muted rounded-lg border">
                    <p className="text-xs text-muted-foreground mb-1">Signature preview</p>
                    <p className="text-xl font-serif italic text-foreground">{signerName}</p>
                  </div>
                )}
              </div>
              <Button
                className="w-full gap-1.5"
                onClick={handleSign}
                disabled={signing || !signerName.trim()}
              >
                {signing ? <Loader2 size={14} className="animate-spin" /> : <PenLine size={14} />}
                {signing ? "Signing..." : "Sign Document"}
              </Button>
              <p className="text-xs text-muted-foreground/60 text-center">
                By signing, you agree that your electronic signature is legally binding.
              </p>
            </div>
          )}

          {/* Step: Done */}
          {step === "done" && (
            <div className="text-center py-4">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 size={24} className="text-emerald-600" />
                </div>
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-1">Document Signed</h2>
              <p className="text-sm text-muted-foreground">
                Thank you, {signerName}. Your signature has been recorded.
              </p>
              <p className="text-xs text-muted-foreground/60 mt-3">You may close this page.</p>
            </div>
          )}
        </div>

        {/* Footer branding */}
        <div className="px-6 py-3 border-t bg-muted">
          <p className="text-xs text-muted-foreground/60 text-center flex items-center justify-center gap-1">
            <Lock className="size-2.5" />
            Secured by Cometa
          </p>
        </div>
      </div>

      {/* Document viewer modal */}
      {showDocViewer && docUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowDocViewer(false)}
        >
          <div
            className="relative w-full max-w-4xl h-[85vh] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
              <p className="text-sm font-medium truncate">{data?.document.name}</p>
              <button
                type="button"
                onClick={() => setShowDocViewer(false)}
                className="p-1.5 rounded-md hover:bg-muted transition-colors"
              >
                <XCircle size={18} className="text-muted-foreground" />
              </button>
            </div>
            <iframe
              src={docUrl}
              className="flex-1 w-full border-0"
              title="Document viewer"
            />
          </div>
        </div>
      )}
    </div>
  );
}
