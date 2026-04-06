"use client";

import { useState, useCallback } from "react";
import { requestSignatures } from "@/lib/api";
import { toast } from "sonner";
import { X, Send, Loader2 } from "lucide-react";

interface SignatureModalProps {
  documentId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function SignatureModal({
  documentId,
  isOpen,
  onClose,
  onSuccess,
}: SignatureModalProps) {
  const [emails, setEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const addEmail = useCallback(() => {
    const trimmed = emailInput.trim();
    if (!trimmed) return;
    if (!isValidEmail(trimmed)) {
      toast.error("Invalid email address");
      return;
    }
    if (emails.includes(trimmed)) {
      toast.error("Email already added");
      return;
    }
    setEmails((prev) => [...prev, trimmed]);
    setEmailInput("");
  }, [emailInput, emails]);

  const removeEmail = (email: string) => {
    setEmails((prev) => prev.filter((e) => e !== email));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addEmail();
    }
    if (e.key === "Backspace" && emailInput === "" && emails.length > 0) {
      setEmails((prev) => prev.slice(0, -1));
    }
  };

  const handleSend = async () => {
    if (emails.length === 0) {
      toast.error("Add at least one signer email");
      return;
    }
    setSending(true);
    try {
      await requestSignatures({
        documentId,
        signerEmails: emails,
        message: message || undefined,
      });
      toast.success("Signature request sent");
      setEmails([]);
      setMessage("");
      onSuccess?.();
      onClose();
    } catch {
      toast.error("Failed to send signature request");
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#EBEEF1]">
          <h3 className="text-base font-semibold text-[#212327]">
            Send for Signature
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-[#717983] hover:text-[#212327] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          {/* Email input */}
          <div>
            <label className="block text-sm font-medium text-[#212327] mb-1.5">
              Signer emails
            </label>
            <div className="flex flex-wrap gap-1.5 p-2 min-h-[40px] border border-[#EBEEF1] rounded-lg bg-white focus-within:border-[#212327] transition-colors">
              {emails.map((email) => (
                <span
                  key={email}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#F0F0F0] text-sm text-[#212327] rounded-md"
                >
                  {email}
                  <button
                    type="button"
                    onClick={() => removeEmail(email)}
                    className="text-[#717983] hover:text-[#212327] transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={addEmail}
                placeholder={emails.length === 0 ? "name@company.com" : ""}
                className="flex-1 min-w-[140px] text-sm outline-none bg-transparent placeholder:text-[#A0A5AE]"
              />
            </div>
            <p className="text-xs text-[#717983] mt-1">
              Press Enter or comma to add multiple emails
            </p>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-[#212327] mb-1.5">
              Message{" "}
              <span className="text-[#A0A5AE] font-normal">(optional)</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please review and sign this document..."
              rows={3}
              className="w-full px-3 py-2 text-sm border border-[#EBEEF1] rounded-lg bg-white placeholder:text-[#A0A5AE] outline-none focus:border-[#212327] resize-none transition-colors"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-[#EBEEF1]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[#555A65] bg-white border border-[#EBEEF1] rounded-lg hover:bg-[#F8F8F8] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={sending || emails.length === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#212327] rounded-lg hover:bg-[#212327]/90 transition-colors disabled:opacity-50"
          >
            {sending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Send size={14} />
            )}
            {sending ? "Sending..." : "Send for Signature"}
          </button>
        </div>
      </div>
    </div>
  );
}
