export interface AgentSkill {
  key: string;
  name: string;
  description: string;
  capabilities: string[];
  defaultEnabled: boolean;
}

export interface AgentConfig {
  slug: string;
  name: string;
  model: string;
  description: string;
  skills: AgentSkill[];
}

export const agentConfigs: Record<string, AgentConfig> = {
  accounting: {
    slug: "accounting",
    name: "Accounting Agent",
    model: "claude-sonnet-4-6",
    description: "Processes financial documents, approves payments, and manages expense workflows.",
    skills: [
      {
        key: "invoice-triage",
        name: "Invoice Triage",
        description: "Reviews incoming invoices, matches them to POs, and routes for approval or payment.",
        capabilities: [
          "Auto-approve invoices under R10,000 from approved vendors",
          "Escalate invoices over R10,000 for human sign-off",
          "Verify PO number matches",
          "Flag duplicate invoices",
        ],
        defaultEnabled: true,
      },
      {
        key: "expense-review",
        name: "Expense Review",
        description: "Reviews staff expense claims and reimbursement requests against policy.",
        capabilities: [
          "Auto-approve expenses under R5,000 with a receipt",
          "Reject claims without supporting documentation",
          "Flag policy violations",
          "Escalate expenses over R5,000 for human sign-off",
        ],
        defaultEnabled: true,
      },
      {
        key: "payment-tracking",
        name: "Payment Tracking",
        description: "Tracks payment due dates and notifies stakeholders when payments are processed.",
        capabilities: [
          "Notify originating task when payment is processed",
          "Track due dates and surface upcoming payments",
        ],
        defaultEnabled: true,
      },
      {
        key: "vendor-handoff",
        name: "Vendor Handoff to Legal",
        description: "Forwards new vendor contracts to the legal department for review.",
        capabilities: [
          "Detect new vendor contracts",
          "Send hand-off message to the Legal agent with context",
        ],
        defaultEnabled: true,
      },
      {
        key: "activity-logging",
        name: "Activity Logging",
        description: "Records reasoning and decisions on each task as the agent works.",
        capabilities: [
          "Log reasoning before changing task status",
          "Keep entries concise and specific",
        ],
        defaultEnabled: true,
      },
    ],
  },
  legal: {
    slug: "legal",
    name: "Legal Agent",
    model: "claude-sonnet-4-6",
    description: "Handles legal queries from other tasks and departments.",
    skills: [
      {
        key: "verify-contract",
        name: "Verify Contract",
        description:
          "Runs an 8-point integrity check on a signature request. Invoked only when a task explicitly asks to verify, check, or validate a contract or signature request.",
        capabilities: [
          "Confirms request is not cancelled or expired",
          "Confirms a PDF file is attached",
          "Confirms all required signers have email + name",
          "Confirms signing order is valid",
          "Confirms audit trail is intact for signed signers",
          "Confirms expiry is healthy (warns if <7 days)",
          "Confirms no declined signers are blocking the request",
          "Posts a structured Verification Report back on the task with verdict (verified / needs_review / rejected)",
        ],
        defaultEnabled: true,
      },
      {
        key: "legal-summary",
        name: "Legal Summary",
        description:
          "Produces a legal-angle summary of any document by ID — works on signature requests, intake documents, or notes. Invoked when a task explicitly asks to summarise / brief / TL;DR a document.",
        capabilities: [
          "Resolves any UUID by trying signatures → intake → notes (first hit wins)",
          "Identifies parties (counterparty, signers, addressees)",
          "Lists key dates (effective, expiry, signing, received)",
          "Captures the document's subject in one sentence",
          "Flags legal risks visible in metadata (missing signers, declined, expired, missing fields)",
          "Recommends a next step (review, sign, nudge signer, file)",
          "Posts a structured Legal Summary back on the task",
        ],
        defaultEnabled: true,
      },
      {
        key: "contract-review",
        name: "Contract Review",
        description:
          "Performs clause-level legal review of a signature-request contract. Fetches the PDF via web_fetch and analyses 9 standard clause categories. Invoked when a task explicitly asks to review, analyse, or give a legal opinion on a contract.",
        capabilities: [
          "Fetches the actual PDF bytes via the presigned URL (web_fetch)",
          "Classifies parties + capacity",
          "Reviews term & termination clauses",
          "Reviews confidentiality scope and permitted disclosures",
          "Reviews indemnity, liability caps, and damages exclusions",
          "Reviews governing law & jurisdiction",
          "Reviews assignment & change-of-control",
          "Reviews notice provisions and force majeure",
          "Flags non-standard obligations (MFN, exclusivity, audit rights, IP assignment, non-competes)",
          "Produces a verdict: accept / negotiate / amend / decline with top-3 risks",
        ],
        defaultEnabled: true,
      },
    ],
  },
};

export function getAgentConfig(slug: string): AgentConfig | undefined {
  return agentConfigs[slug];
}

export function listAgentSlugs(): string[] {
  return Object.keys(agentConfigs);
}
