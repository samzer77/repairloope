import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import type { RepairRequest } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function RequestCard({ request: r }: { request: RepairRequest }) {
  const pending = r.quotes.filter((q) => q.status === "pending").length;

  return (
    <Link
      href={`/requests/${r.id}`}
      className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-400 hover:shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-slate-900">{r.title}</h3>
        <StatusBadge status={r.status} />
      </div>
      <p className="mt-1 text-sm text-slate-600">
        {r.category || "Sans catégorie"} · {r.location || "Lieu non précisé"}
      </p>
      <p className="mt-2 text-xs text-slate-500">
        Créée le {formatDate(r.createdAt)}
        {pending > 0 && ` · ${pending} devis en attente`}
      </p>
    </Link>
  );
}
