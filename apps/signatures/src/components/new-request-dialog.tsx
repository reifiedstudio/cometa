"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DatePicker from "@/components/date-picker";
import { createSignatureRequest } from "@/lib/api";
import { FileUp, Plus, X } from "lucide-react";
import { useRef, useState } from "react";

interface NewRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

export function NewRequestDialog({ open, onOpenChange, onCreated }: NewRequestDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [signerInput, setSignerInput] = useState("");
  const [signers, setSigners] = useState<string[]>([]);
  const [expiresAt, setExpiresAt] = useState<Date | undefined>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d;
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function addSigner() {
    const email = signerInput.trim().toLowerCase();
    if (!email || !email.includes("@")) return;
    if (signers.includes(email)) return;
    setSigners([...signers, email]);
    setSignerInput("");
  }

  function removeSigner(email: string) {
    setSigners(signers.filter((s) => s !== email));
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      addSigner();
    }
  }

  async function handleSubmit() {
    if (!file) return setError("Please upload a document");
    if (!signers.length) return setError("Add at least one signer");
    if (!expiresAt) return setError("Set an expiry date");

    setError("");
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("signerEmails", JSON.stringify(signers));
      if (message) formData.append("message", message);

      const diffDays = Math.ceil(
        (expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
      );
      formData.append("expiresInDays", String(Math.max(1, diffDays)));

      await createSignatureRequest(formData);
      onCreated();
      onOpenChange(false);

      // Reset form
      setFile(null);
      setMessage("");
      setSigners([]);
      setSignerInput("");
    } catch (err) {
      setError("Failed to create request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New Signature Request</DialogTitle>
          <DialogDescription>Upload a document and add signers</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* File upload */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setFile(f);
              }}
            />
            {file ? (
              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-red-600">PDF</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium truncate max-w-[280px]">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                </div>
                <button type="button" onClick={() => setFile(null)} className="text-muted-foreground hover:text-foreground">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center gap-2 p-6 rounded-lg border-2 border-dashed border-border hover:border-muted-foreground/40 hover:bg-muted/30 transition-colors"
              >
                <FileUp size={24} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Click to upload PDF</span>
              </button>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Message <span className="text-muted-foreground font-normal">(optional)</span></label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please review and sign this document"
              rows={2}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          {/* Signers */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Signers</label>
            <div className="flex gap-2">
              <input
                type="email"
                value={signerInput}
                onChange={(e) => setSignerInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="email@example.com"
                className="flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button variant="outline" onClick={addSigner} className="shrink-0 h-[38px]">
                <Plus size={14} />
                Add
              </Button>
            </div>
            {signers.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {signers.map((email) => (
                  <span
                    key={email}
                    className="inline-flex items-center gap-1 text-xs bg-muted px-2.5 py-1 rounded-full"
                  >
                    {email}
                    <button type="button" onClick={() => removeSigner(email)} className="text-muted-foreground hover:text-foreground">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Expiry */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Expires</label>
            <DatePicker
              value={expiresAt}
              onChange={(d) => setExpiresAt(d)}
              placeholder="Pick expiry date"
              futureOnly
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Sending..." : "Send Request"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
