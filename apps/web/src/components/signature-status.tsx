"use client";

import { useEffect, useState } from "react";
import { getSignatureStatus } from "@/lib/api";
import { Clock, Eye, CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";

const statusConfig: Record<
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

interface SignatureData {
  id: string;
  status: string;
  message?: string;
  signers: Signer[];
  createdAt: string;
  expiresAt?: string;
}

interface SignatureStatusProps {
  documentId: string;
}

export default function SignatureStatus({ documentId }: SignatureStatusProps) {
  const [data, setData] = useState<SignatureData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const result = await getSignatureStatus(documentId);
        if (!cancelled) setData(result);
      } catch {
        // Silently fail — component just won't render
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [documentId]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-3">
        <Loader2 size={14} className="animate-spin text-[#717983]" />
        <span className="text-sm text-[#717983]">Loading signature status...</span>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-2.5">
      <h3 className="text-sm font-semibold text-[#212327]">Signature Status</h3>
      <div className="bg-white rounded-xl border border-[#EBEEF1] divide-y divide-[#EBEEF1]">
        {data.signers.map((signer) => {
          const config = statusConfig[signer.status] ?? statusConfig.pending;
          const Icon = config.icon;
          return (
            <div
              key={signer.email}
              className="flex items-center justify-between px-4 py-3"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm text-[#212327]">
                  {signer.name || signer.email}
                </span>
                {signer.name && (
                  <span className="text-xs text-[#717983]">{signer.email}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {signer.signedAt && (
                  <span className="text-xs text-[#717983]">
                    {new Date(signer.signedAt).toLocaleDateString()}
                  </span>
                )}
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}
                >
                  <Icon size={12} />
                  {config.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {data.message && (
        <p className="text-xs text-[#717983] italic">
          Message: &ldquo;{data.message}&rdquo;
        </p>
      )}
    </div>
  );
}
