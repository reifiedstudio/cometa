export interface Signer {
  name: string;
  role?: string;
  company?: string;
  email?: string;
  signedAt?: string;
}

export interface SignatureBlockProps {
  signers: Signer[];
  title?: string;
}

export function SignatureBlock({ signers, title = "Signatures" }: SignatureBlockProps) {
  return (
    <section className="mt-10">
      <h3 className="mb-6 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <div
        className="grid gap-8"
        style={{ gridTemplateColumns: `repeat(${Math.min(signers.length, 2)}, 1fr)` }}
      >
        {signers.map((signer, i) => (
          <div key={i} className="space-y-4">
            <div className="h-16 rounded-md border-2 border-dashed border-muted-foreground/25 bg-muted/30" />
            <div className="border-t pt-2">
              <p className="text-sm font-medium">{signer.name}</p>
              {signer.role && (
                <p className="text-xs text-muted-foreground">{signer.role}</p>
              )}
              {signer.company && (
                <p className="text-xs text-muted-foreground">{signer.company}</p>
              )}
              {signer.email && (
                <p className="text-xs text-muted-foreground">{signer.email}</p>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Date:</span>
              {signer.signedAt ? (
                <span>{signer.signedAt}</span>
              ) : (
                <span className="inline-block w-32 border-b border-muted-foreground/40" />
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
