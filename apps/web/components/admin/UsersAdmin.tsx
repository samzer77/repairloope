"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/Button";
import { errorMessage } from "@/components/admin/shared";
import { useAuth } from "@/features/auth/AuthContext";
import { api } from "@/lib/api";
import type { User } from "@/lib/types";

const inputClass = "rounded-lg border border-slate-300 px-3 py-2 text-sm";

export function UsersAdmin() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  async function search(term: string) {
    setError("");
    try {
      setUsers(await api.users.search(term));
    } catch (e) {
      setError(errorMessage(e));
    }
  }

  useEffect(() => {
    search("");
  }, []);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    search(q.trim());
  }

  async function toggleActive(u: User) {
    setError("");
    try {
      const updated = await api.users.setActive(u.id, !u.active);
      setUsers((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold">Utilisateurs</h2>

      {error && <p className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          className={`flex-1 ${inputClass}`}
          placeholder="Rechercher par nom ou e-mail"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button type="submit">Rechercher</Button>
      </form>

      <ul className="divide-y divide-slate-200">
        {users.map((u) => {
          const isMe = u.id === me?.id;
          return (
            <li key={u.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
              <div>
                <p className="font-medium">
                  {u.name} {isMe && <span className="text-xs text-slate-500">(toi)</span>}
                </p>
                <p className="text-xs text-slate-500">
                  {u.email} · {u.role} · {u.active ? "Actif" : "Désactivé"}
                </p>
              </div>
              <Button
                variant={u.active ? "danger" : "secondary"}
                disabled={isMe}
                onClick={() => toggleActive(u)}
              >
                {u.active ? "Désactiver" : "Réactiver"}
              </Button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
