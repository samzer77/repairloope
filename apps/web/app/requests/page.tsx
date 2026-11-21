"use client";

import { Suspense } from "react";
import { RequestDirectory } from "@/components/RequestDirectory";
import { RequireAuth } from "@/components/RequireAuth";

export default function RequestsPage() {
  return (
    <RequireAuth roles={["repairer", "admin"]}>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Demandes de réparation</h1>
        <Suspense fallback={<p className="text-slate-500">Chargement…</p>}>
          <RequestDirectory />
        </Suspense>
      </main>
    </RequireAuth>
  );
}
