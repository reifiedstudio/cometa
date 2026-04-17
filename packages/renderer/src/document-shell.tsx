import type { ReactNode } from "react";
import { DocumentHeader, type CompanyInfo } from "./document-header";
import { DocumentFooter } from "./document-footer";
import { SignatureBlock, type Signer } from "./signature-block";

export interface DocumentShellProps {
  company: CompanyInfo & {
    address?: string;
    vatNumber?: string;
    website?: string;
    email?: string;
    phone?: string;
  };
  title: string;
  reference?: string;
  date?: string;
  signers?: Signer[];
  signatureTitle?: string;
  confidential?: boolean;
  children: ReactNode;
}

export function DocumentShell({
  company,
  title,
  reference,
  date,
  signers,
  signatureTitle,
  confidential,
  children,
}: DocumentShellProps) {
  return (
    <div className="mx-auto max-w-3xl bg-background px-10 py-8 text-foreground">
      <DocumentHeader company={company} title={title} reference={reference} date={date} />
      <div className="min-h-[200px]">{children}</div>
      {signers && signers.length > 0 && (
        <SignatureBlock signers={signers} title={signatureTitle} />
      )}
      <DocumentFooter company={company} confidential={confidential} />
    </div>
  );
}
