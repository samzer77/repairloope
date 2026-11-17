"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/AuthContext";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) return <p className="p-8">Chargement...</p>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold">Bonjour {user.name}</h1>
      <p className="mt-2 text-slate-600">
        Compte : {user.role === "owner" ? "Propriétaire" : user.role === "repairer" ? "Réparateur" : "Administrateur"}
      </p>
    </div>
  );
}
