import { Suspense } from "react";
import { RepairerDetail } from "@/components/repairer/RepairerDetail";

export default function RepairerPage() {
  return (
    <Suspense fallback={<p className="text-slate-500">Chargement…</p>}>
      <RepairerDetail />
    </Suspense>
  );
}
