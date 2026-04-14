export interface CompanyInfo {
  name: string;
  logo?: string;
  registrationNumber?: string;
  vatNumber?: string;
}

export interface DocumentHeaderProps {
  company: CompanyInfo;
  title: string;
  reference?: string;
  date?: string;
}

export function DocumentHeader({ company, title, reference, date }: DocumentHeaderProps) {
  return (
    <header className="mb-8 border-b pb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {company.logo ? (
            <img src={company.logo} alt={company.name} className="h-10 w-auto" />
          ) : (
            <div className="flex size-10 items-center justify-center rounded-md bg-primary text-lg font-bold text-primary-foreground">
              {company.name.charAt(0)}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold">{company.name}</p>
            {company.registrationNumber && (
              <p className="text-xs text-muted-foreground">
                Reg: {company.registrationNumber}
              </p>
            )}
          </div>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          {reference && <p className="font-mono">{reference}</p>}
          {date && <p>{date}</p>}
        </div>
      </div>
      <h1 className="mt-4 text-xl font-semibold">{title}</h1>
    </header>
  );
}
