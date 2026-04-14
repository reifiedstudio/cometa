/**
 * Seeds the canonical document types. These types are fixed — users cannot
 * create or modify them via the UI. To change the set, edit this file and
 * re-run `POST /api/admin/seed-types`.
 *
 * Each type carries a `description` that is fed into the classifier prompt
 * to give the model real semantic distinguishers between types.
 */
export async function seedDefaultDocumentTypes() {
  const { db, schema } = await import("@cometa/db");
  const { eq } = await import("drizzle-orm");

  const defaults = [
    {
      slug: "invoice",
      name: "Invoice",
      pluralName: "Invoices",
      badgeColor: "bg-orange-100 text-orange-700",
      description:
        "A request for payment issued by a supplier BEFORE money has been paid. Always has an invoice number, an issue date, a due date or payment terms (e.g. 'Net 30'), supplier banking/payee details, and an outstanding balance owed. Usually itemised with line items and VAT/tax breakdown. The word 'INVOICE' or 'TAX INVOICE' is typically prominent. NOT a receipt — a receipt is proof of payment after the fact.",
      fields: [
        { key: "supplier", label: "Supplier", type: "text" },
        { key: "invoiceNumber", label: "Invoice No.", type: "text" },
        { key: "date", label: "Date", type: "date" },
        { key: "dueDate", label: "Due Date", type: "date" },
        { key: "paymentTerms", label: "Payment Terms", type: "text" },
        { key: "currency", label: "Currency", type: "text" },
        { key: "subtotal", label: "Subtotal", type: "currency" },
        { key: "vat", label: "VAT", type: "currency" },
        { key: "total", label: "Total", type: "currency" },
        {
          key: "items",
          label: "Line Items",
          type: "table",
          columns: [
            { key: "description", label: "Description", align: "left" },
            { key: "quantity", label: "Qty", align: "right" },
            { key: "unitPrice", label: "Unit Price", align: "right", isMoney: true },
            { key: "total", label: "Total", align: "right", isMoney: true },
          ],
        },
      ],
      isDefault: true,
    },
    {
      slug: "receipt",
      name: "Receipt",
      pluralName: "Receipts",
      badgeColor: "bg-emerald-100 text-emerald-700",
      description:
        "Proof of a purchase that has ALREADY been paid. Issued at the point of sale by a shop, restaurant, petrol station, or online checkout. Hallmarks: a store/merchant name and address at the top, a transaction date and time, a list of items bought, a total, and a payment method (cash, card, last 4 digits of card, 'PAID'/'APPROVED'). No due date and no invoice number — the money is already gone. Often printed on narrow thermal paper.",
      fields: [
        { key: "supplier", label: "Supplier", type: "text" },
        { key: "date", label: "Date", type: "date" },
        { key: "paymentMethod", label: "Payment Method", type: "text" },
        { key: "cardLastFour", label: "Card", type: "text" },
        { key: "currency", label: "Currency", type: "text" },
        { key: "subtotal", label: "Subtotal", type: "currency" },
        { key: "tax", label: "Tax", type: "currency" },
        { key: "tip", label: "Tip", type: "currency" },
        { key: "total", label: "Total", type: "currency" },
        {
          key: "items",
          label: "Line Items",
          type: "table",
          columns: [
            { key: "name", label: "Item", align: "left" },
            { key: "quantity", label: "Qty", align: "right" },
            { key: "unitPrice", label: "Price", align: "right", isMoney: true },
          ],
        },
      ],
      isDefault: true,
    },
    {
      slug: "contract",
      name: "Contract",
      pluralName: "Contracts",
      badgeColor: "bg-blue-100 text-blue-700",
      description:
        "A legal agreement between two or more named parties setting out obligations, terms, and conditions. Multiple pages of formal prose. Hallmarks: 'AGREEMENT' / 'CONTRACT' / 'TERMS' in the title, named parties (sometimes 'Party A and Party B'), recitals or 'WHEREAS' clauses, numbered clauses, an effective date, often an expiry/termination date, signature blocks at the end, and governing law jurisdiction. NOT a transactional document — no totals, no line items.",
      fields: [
        { key: "contractType", label: "Type", type: "text" },
        { key: "effectiveDate", label: "Effective Date", type: "date" },
        { key: "expiryDate", label: "Expiry Date", type: "date" },
        { key: "governingLaw", label: "Governing Law", type: "text" },
        { key: "parties", label: "Parties", type: "list" },
        { key: "keyTerms", label: "Key Terms", type: "list" },
      ],
      isDefault: true,
    },
    {
      slug: "delivery_note",
      name: "Delivery Note",
      pluralName: "Delivery Notes",
      badgeColor: "bg-red-100 text-red-700",
      description:
        "A document that accompanies physical goods being shipped, confirming what was delivered. Also called a 'packing slip', 'goods received note', or 'waybill'. Hallmarks: a delivery/dispatch date, a reference or delivery number, sender (supplier) AND receiver names with addresses, an itemised list of goods with quantities, BUT no prices or totals (those live on the invoice). Often has a signature line for the recipient acknowledging receipt.",
      fields: [
        { key: "supplier", label: "Supplier", type: "text" },
        { key: "deliveryDate", label: "Delivery Date", type: "date" },
        { key: "referenceNumber", label: "Reference No.", type: "text" },
        { key: "receiver", label: "Receiver", type: "text" },
        { key: "address", label: "Address", type: "text" },
        {
          key: "items",
          label: "Line Items",
          type: "table",
          columns: [
            { key: "description", label: "Item", align: "left" },
            { key: "quantity", label: "Qty", align: "right" },
            { key: "unit", label: "Unit", align: "right" },
          ],
        },
      ],
      isDefault: true,
    },
    {
      slug: "bill",
      name: "Bill",
      pluralName: "Bills",
      badgeColor: "bg-sky-100 text-sky-700",
      description:
        "A recurring statement from a utility or service provider for ongoing usage — electricity, water, gas, internet, phone, council rates, insurance premiums. Hallmarks: a provider name and logo, a customer account number, a billing period (e.g. '01 Jan – 31 Jan'), an amount due with a due date, sometimes meter readings or usage details. Distinguished from an invoice because it's tied to an account/subscription rather than a one-off purchase, and from a receipt because it has not yet been paid.",
      fields: [
        { key: "provider", label: "Provider", type: "text" },
        { key: "accountNumber", label: "Account No.", type: "text" },
        { key: "billingPeriod", label: "Billing Period", type: "text" },
        { key: "dueDate", label: "Due Date", type: "date" },
        { key: "currency", label: "Currency", type: "text" },
        { key: "amountDue", label: "Amount Due", type: "currency" },
        {
          key: "items",
          label: "Line Items",
          type: "table",
          columns: [
            { key: "description", label: "Description", align: "left" },
            { key: "amount", label: "Amount", align: "right", isMoney: true },
          ],
        },
      ],
      isDefault: true,
    },
  ];

  let seeded = 0;
  let updated = 0;
  for (const type of defaults) {
    const [existing] = await db
      .select()
      .from(schema.documentTypes)
      .where(eq(schema.documentTypes.slug, type.slug))
      .limit(1);

    if (!existing) {
      await db.insert(schema.documentTypes).values(type);
      seeded++;
    } else {
      // Keep canonical types in sync — overwrite description, fields, name, plural, colour.
      await db
        .update(schema.documentTypes)
        .set({
          name: type.name,
          pluralName: type.pluralName,
          badgeColor: type.badgeColor,
          description: type.description,
          fields: type.fields,
          isActive: true,
          updatedAt: new Date(),
        })
        .where(eq(schema.documentTypes.slug, type.slug));
      updated++;
    }
  }

  return { seeded, updated, total: defaults.length };
}
