"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "../features/auth/AuthContext"; // adapte le chemin si besoin
import type { Role } from "@/lib/types";

export function RequireAuth({ children, roles }: { children: ReactNode; roles?: Role[] }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return <p className="p-8 text-center text-slate-500">Chargement…</p>;
  }
  if (roles && !roles.includes(user.role)) {
    return <p className="p-8 text-center text-red-600">Accès refusé pour ton rôle.</p>;
  }
  return <>{children}</>;
}
