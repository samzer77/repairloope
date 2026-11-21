"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { RequestCard } from "@/components/RequestCard";
import { RequestFilters } from "@/components/RequestFilters";
import { api } from "@/lib/api";
import type { ListFilters, RepairRequest } from "@/lib/types";

const SORTS = ["recent", "oldest", "title"] as const;

/** Transforme les paramètres de l'URL en filtres validés. */
function filtersFromParams(sp: URLSearchParams): ListFilters {
  const sort = sp.get("sort") ?? "";
  return {
    q: sp.get("q") ?? undefined,
    category: sp.get("category") ?? undefined,
    location: sp.get("location") ?? undefined,
    since: sp.get("since") ?? undefined,
    sort: (SORTS as readonly string[]).includes(sort) ? (sort as ListFilters["sort"]) : "recent",
  };
}

export function RequestDirectory() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const key = searchParams.toString();
  const filters = filtersFromParams(new URLSearchParams(key));

  const [items, setItems] = useState<RepairRequest[] | null>(null);
  const [error, setError] = useState("");

  // Une nouvelle URL déclenche un nouvel appel à l'API
  useEffect(() => {
    api.requests
      .list(filtersFromParams(new URLSearchParams(key)))
      .then((data) => {
        setItems(data);
        setError("");
      })
      .catch((e: Error) => setError(e.message));
  }, [key]);

  function apply(next: ListFilters) {
    const sp = new URLSearchParams();
    for (const [name, value] of Object.entries(next)) {
      if (value) sp.set(name, String(value));
    }
    const query = sp.toString();
    router.push(query ? `/requests?${query}` : "/requests");
  }

  return (
    <>
      <RequestFilters key={key} initial={filters} onApply={apply} />

      {error && <p className="mb-4 rounded bg-red-50 p-3 text-red-700">{error}</p>}
      {!items && !error && <p className="text-slate-500">Chargement…</p>}

      {items && (
        <>
          <p className="mb-4 text-sm text-slate-600">
            {items.length} demande{items.length > 1 ? "s" : ""} trouvée{items.length > 1 ? "s" : ""}
          </p>
          {items.length === 0 ? (
            <p className="text-slate-500">Aucune demande ne correspond à ces critères.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {items.map((r) => (
                <RequestCard key={r.id} request={r} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
