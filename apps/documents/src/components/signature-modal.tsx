"use client";

import DatePicker from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import { requestSignatures } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Loader2, Send, X } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

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
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [sending, setSending] = useState(false);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

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
      let expiresInDays: number | undefined;
      if (dueDate) {
        const diff = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        if (diff > 0) expiresInDays = diff;
      }

      await requestSignatures({
        documentId,
        signerEmails: emails,
        message: message || undefined,
        expiresInDays,
      });
      toast.success("Signature request sent");
      setEmails([]);
      setMessage("");
      setDueDate(undefined);
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
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-card rounded-xl shadow-2xl w-full max-w-md mx-4 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-base font-semibold text-foreground">Send for Signature</h3>
          <Button variant="ghost" size="icon-xs" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          {/* Email input */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Signer emails
            </label>
            <div className="flex flex-wrap gap-1.5 p-2 min-h-[40px] border border-border rounded-lg bg-card focus-within:border-foreground transition-colors">
              {emails.map((email) => (
                <span
                  key={email}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-border text-sm text-foreground rounded-md"
                >
                  {email}
                  <button
                    type="button"
                    onClick={() => removeEmail(email)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
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
                className="flex-1 min-w-[140px] text-sm outline-none bg-transparent placeholder:text-muted-foreground/60"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Press Enter or comma to add multiple emails
            </p>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Message <span className="text-muted-foreground/60 font-normal">(optional)</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please review and sign this document..."
              rows={3}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card placeholder:text-muted-foreground/60 outline-none focus:border-foreground resize-none transition-colors"
            />
          </div>

          {/* Due date */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Due date <span className="text-muted-foreground/60 font-normal">(optional)</span>
            </label>
            <DatePicker
              value={dueDate}
              onChange={setDueDate}
              placeholder="Pick a due date"
              futureOnly
              className="w-full justify-start"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Signers will be notified the request expires on this date
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="default" onClick={handleSend} disabled={sending || emails.length === 0}>
            {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            {sending ? "Sending..." : "Send for Signature"}
          </Button>
        </div>
      </div>
    </div>
  );
}
