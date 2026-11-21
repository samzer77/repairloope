"use client";

import { Suspense } from "react";
import { RequestDetail } from "@/components/request/RequestDetail";
import { RequireAuth } from "@/components/RequireAuth";

export default function RequestPage() {
  return (
    <RequireAuth>
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Suspense fallback={<p className="text-slate-500">Chargement…</p>}>
          <RequestDetail />
        </Suspense>
      </main>
    </RequireAuth>
  );
}
