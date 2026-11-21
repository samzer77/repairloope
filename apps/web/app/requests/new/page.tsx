"use client";

import { RequestForm } from "@/components/RequestForm";
import { RequireAuth } from "@/components/RequireAuth";

export default function NewRequestPage() {
  return (
    <RequireAuth roles={["owner"]}>
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Nouvelle demande</h1>
        <RequestForm />
      </main>
    </RequireAuth>
  );
}
