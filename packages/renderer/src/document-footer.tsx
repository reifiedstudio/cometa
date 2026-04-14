export interface DocumentFooterProps {
  company: {
    name: string;
    address?: string;
    registrationNumber?: string;
    vatNumber?: string;
    website?: string;
    email?: string;
    phone?: string;
  };
  confidential?: boolean;
}

export function DocumentFooter({ company, confidential }: DocumentFooterProps) {
  const details = [
    company.address,
    company.registrationNumber && `Reg: ${company.registrationNumber}`,
    company.vatNumber && `VAT: ${company.vatNumber}`,
  ].filter(Boolean);

  const contact = [company.website, company.email, company.phone].filter(Boolean);

  return (
    <footer className="mt-12 border-t pt-4">
      {confidential && (
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Confidential
        </p>
      )}
      <div className="flex items-end justify-between text-xs text-muted-foreground">
        <div className="space-y-0.5">
          <p className="font-medium text-foreground">{company.name}</p>
          {details.map((d, i) => (
            <p key={i}>{d}</p>
          ))}
        </div>
        <div className="space-y-0.5 text-right">
          {contact.map((c, i) => (
            <p key={i}>{c}</p>
          ))}
        </div>
      </div>
    </footer>
  );
}
