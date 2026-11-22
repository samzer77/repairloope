import Link from "next/link";
import type { RepairerProfile } from "@/lib/types";

export function RepairerCard({ repairer }: { repairer: RepairerProfile }) {
  return (
    <li className="flex flex-col rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold">{repairer.name}</h3>
        {repairer.verified && (
          <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
            Vérifié
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-slate-600">{repairer.zone || "Zone non précisée"}</p>
      <p className="mt-2 line-clamp-3 text-sm text-slate-700">{repairer.bio}</p>

      {repairer.categories.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {repairer.categories.map((c) => (
            <span key={c} className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
              {c}
            </span>
          ))}
        </div>
      )}

      <Link
        href={`/repairers/${repairer.userId}`}
        className="mt-auto pt-4 text-sm font-medium text-teal-700 hover:underline"
      >
        Voir le profil →
      </Link>
    </li>
  );
}
