"use client";

import { useEffect, useState, use } from "react";
import {
  CheckCircle2,
  Clock,
  Eye,
  XCircle,
  AlertCircle,
  Loader2,
  ShieldCheck,
  PenLine,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const signerStatusConfig: Record<
  string,
  { label: string; color: string; icon: typeof Clock }
> = {
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

export default function SignPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
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

  // Fetch signer info on mount
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_URL}/api/sign/${token}`);
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
    load();
  }, [token]);

  const handleSendOtp = async () => {
    setOtpSending(true);
    try {
      const res = await fetch(`${API_URL}/api/sign/${token}/otp`, {
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
      const res = await fetch(`${API_URL}/api/sign/${token}/verify`, {
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
      const res = await fetch(`${API_URL}/api/sign/${token}/sign`, {
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

  // Cometa logo (same SVG from the sidebar)
  const Logo = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width="28"
      height="28"
    >
      <defs>
        <clipPath id="lc2">
          <rect width="200" height="200" x="0" y="0" />
        </clipPath>
        <g id="lg2">
          <g transform="matrix(0.997,0,0,1,100.147,100)" opacity="1">
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path
                fill="rgb(255,0,0)"
                fillOpacity="1"
                d="M51.995,-68.599 C51.995,-31.97 22.612,-2.586 -14.017,-2.586 C-14.017,-2.586 -51.854,-2.586 -51.854,-2.586 C-53.188,-2.586 -54.269,-1.505 -54.269,-0.171 C-54.269,1.163 -53.188,2.244 -51.854,2.244 C-51.854,2.244 -14.017,2.244 -14.017,2.244 C22.612,2.244 51.995,31.628 51.995,68.257 C51.995,68.257 52.995,68.257 52.995,68.257 C52.995,68.257 52.995,-68.599 52.995,-68.599 C52.995,-68.599 51.995,-68.599 51.995,-68.599z"
              />
            </g>
          </g>
        </g>
        <filter
          id="lf2"
          filterUnits="objectBoundingBox"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
        >
          <feComponentTransfer in="SourceGraphic">
            <feFuncA type="table" tableValues="1.0 0.0" />
          </feComponentTransfer>
        </filter>
        {/* @ts-expect-error maskType is a valid SVG attribute */}
        <mask id="lm2" maskType="alpha">
          <g filter="url(#lf2)">
            <rect
              width="200"
              height="200"
              x="0"
              y="0"
              fill="#ffffff"
              opacity="0"
            />
            <use xlinkHref="#lg2" />
          </g>
        </mask>
      </defs>
      <g clipPath="url(#lc2)">
        <g mask="url(#lm2)">
          <g transform="matrix(1,0,0,1,100,100)" opacity="1">
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path
                fill="rgb(0,0,0)"
                fillOpacity="1"
                d="M-51.925,-68.428 L51.925,-68.428 L51.925,68.428 L-51.925,68.428z"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );

  if (step === "loading") {
    return (
      <div className="w-full max-w-lg mx-4">
        <div className="bg-white rounded-xl shadow-sm border border-[#EBEEF1] p-8 flex flex-col items-center gap-3">
          <Loader2 size={24} className="animate-spin text-[#717983]" />
          <p className="text-sm text-[#717983]">Loading...</p>
        </div>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="w-full max-w-lg mx-4">
        <div className="bg-white rounded-xl shadow-sm border border-[#EBEEF1] p-8 text-center">
          <div className="flex justify-center mb-3">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h2 className="text-lg font-semibold text-[#212327] mb-2">
            Unable to Load
          </h2>
          <p className="text-sm text-[#555A65]">{errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-4">
      <div className="bg-white rounded-xl shadow-sm border border-[#EBEEF1] overflow-hidden">
        {/* Header with branding */}
        <div className="px-6 py-5 border-b border-[#EBEEF1]">
          <div className="flex items-center gap-2 mb-4">
            <Logo />
            <span className="text-sm font-semibold text-[#212327]">Cometa</span>
          </div>
          <h1 className="text-lg font-semibold text-[#212327]">
            {data?.document.name}
          </h1>
          <p className="text-sm text-[#717983] mt-1">
            {data?.request.requestedByEmail} has requested your signature
          </p>
          {data?.request.message && (
            <div className="mt-3 p-3 bg-[#F8F8F8] rounded-lg">
              <p className="text-sm text-[#555A65] italic">
                &ldquo;{data.request.message}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Signers overview */}
        {data && data.signatures.length > 1 && (
          <div className="px-6 py-4 border-b border-[#EBEEF1]">
            <p className="text-xs font-medium text-[#717983] uppercase tracking-wide mb-2">
              Signers
            </p>
            <div className="space-y-2">
              {data.signatures.map((s) => {
                const config =
                  signerStatusConfig[s.status] ?? signerStatusConfig.pending;
                const Icon = config.icon;
                return (
                  <div
                    key={s.email}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-[#555A65]">
                      {s.name || s.email}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}
                    >
                      <Icon size={12} />
                      {config.label}
                    </span>
                  </div>
                );
              })}
            </div>
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
              <h2 className="text-lg font-semibold text-[#212327] mb-1">
                Already Signed
              </h2>
              <p className="text-sm text-[#717983]">
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
                  <h2 className="text-sm font-semibold text-[#212327]">
                    Verify your identity
                  </h2>
                  <p className="text-xs text-[#717983]">
                    We&apos;ll send a verification code to{" "}
                    <span className="font-medium text-[#555A65]">
                      {data?.signer.email}
                    </span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={otpSending}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium text-white bg-[#212327] rounded-lg hover:bg-[#212327]/90 transition-colors disabled:opacity-50"
              >
                {otpSending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <ShieldCheck size={14} />
                )}
                {otpSending ? "Sending..." : "Send Verification Code"}
              </button>
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
                  <h2 className="text-sm font-semibold text-[#212327]">
                    Enter verification code
                  </h2>
                  <p className="text-xs text-[#717983]">
                    Check your email for a 6-digit code
                  </p>
                </div>
              </div>
              {errorMessage && (
                <p className="text-sm text-red-600">{errorMessage}</p>
              )}
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
                  if (e.key === "Enter" && otpCode.length === 6)
                    handleVerifyOtp();
                }}
                placeholder="000000"
                className="w-full px-4 py-3 text-center text-2xl font-mono tracking-[0.5em] border border-[#EBEEF1] rounded-lg outline-none focus:border-[#212327] transition-colors"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep("verify");
                    setOtpCode("");
                    setErrorMessage("");
                  }}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-[#555A65] bg-white border border-[#EBEEF1] rounded-lg hover:bg-[#F8F8F8] transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={otpVerifying || otpCode.length !== 6}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium text-white bg-[#212327] rounded-lg hover:bg-[#212327]/90 transition-colors disabled:opacity-50"
                >
                  {otpVerifying ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : null}
                  {otpVerifying ? "Verifying..." : "Verify"}
                </button>
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
                  <h2 className="text-sm font-semibold text-[#212327]">
                    Sign document
                  </h2>
                  <p className="text-xs text-[#717983]">
                    Enter your full legal name to sign
                  </p>
                </div>
              </div>
              {errorMessage && (
                <p className="text-sm text-red-600">{errorMessage}</p>
              )}
              <div>
                <input
                  type="text"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && signerName.trim()) handleSign();
                  }}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 text-sm border border-[#EBEEF1] rounded-lg outline-none focus:border-[#212327] transition-colors"
                  autoFocus
                />
                {signerName.trim() && (
                  <div className="mt-3 px-4 py-3 bg-[#F8F8F8] rounded-lg border border-[#EBEEF1]">
                    <p className="text-xs text-[#717983] mb-1">
                      Signature preview
                    </p>
                    <p className="text-xl font-serif italic text-[#212327]">
                      {signerName}
                    </p>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleSign}
                disabled={signing || !signerName.trim()}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium text-white bg-[#212327] rounded-lg hover:bg-[#212327]/90 transition-colors disabled:opacity-50"
              >
                {signing ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <PenLine size={14} />
                )}
                {signing ? "Signing..." : "Sign Document"}
              </button>
              <p className="text-xs text-[#A0A5AE] text-center">
                By signing, you agree that your electronic signature is legally
                binding.
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
              <h2 className="text-lg font-semibold text-[#212327] mb-1">
                Document Signed
              </h2>
              <p className="text-sm text-[#717983]">
                Thank you, {signerName}. Your signature has been recorded.
              </p>
              <p className="text-xs text-[#A0A5AE] mt-3">
                You may close this page.
              </p>
            </div>
          )}
        </div>

        {/* Footer branding */}
        <div className="px-6 py-3 border-t border-[#EBEEF1] bg-[#FAFAFA]">
          <p className="text-xs text-[#A0A5AE] text-center">
            Secured by Cometa
          </p>
        </div>
      </div>
    </div>
  );
}
