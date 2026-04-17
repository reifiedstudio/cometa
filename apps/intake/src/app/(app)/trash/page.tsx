"use client";

import { IntakeLayout } from "@/components/intake-layout";
import TrashPage from "@/components/trash-page";

export default function Trash() {
  return (
    <IntakeLayout breadcrumbs={[{ label: "Intake" }, { label: "Trash" }]} active="trash">
      <TrashPage />
    </IntakeLayout>
  );
}
