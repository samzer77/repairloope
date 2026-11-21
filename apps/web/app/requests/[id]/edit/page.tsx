"use client";

import { useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { RequestForm } from "@/components/RequestForm";
import { RequireAuth } from "@/components/RequireAuth";
import { api } from "@/lib/api";
import type { RepairRequest } from "@/lib/types";

function EditRequest() {
  const { id } = useParams<{ id: string }>();
  const [request, setRequest] = useState<RepairRequest | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.requests
      .get(id)
      .then(setRequest)
      .catch((e: Error) => setError(e.message));
  }, [id]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!request) return <p className="text-slate-500">Chargement…</p>;
  if (request.status !== "draft") {
    return <p className="text-slate-600">Seul un brouillon peut être modifié.</p>;
  }
  return <RequestForm initial={request} />;
}

export default function EditRequestPage() {
  return (
    <RequireAuth roles={["owner"]}>
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Modifier le brouillon</h1>
        <Suspense fallback={<p className="text-slate-500">Chargement…</p>}>
          <EditRequest />
        </Suspense>
      </main>
    </RequireAuth>
  );
}
