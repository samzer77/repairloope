"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import ButtonLink from "@/components/ButtonLink";

import { useAuth } from "@/features/auth/AuthContext";

export default function Header() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-emerald-700">
          🔧 RepairLoop
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/repairers"
            className="hidden text-sm font-medium text-slate-700 hover:text-emerald-700 sm:block"
          >
            Réparateurs
          </Link>

                    {!loading && user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-slate-700 hover:text-emerald-700"
              >
                Tableau de bord
              </Link>
              {user.role === "repairer" && (
                <Link
                  href="/profile"
                  className="text-sm font-medium text-slate-700 hover:text-emerald-700"
                >
                  Mon profil
                </Link>
              )}
                            {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="text-sm font-medium text-slate-700 hover:text-emerald-700"
                >
                  Administration
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
              >
                Déconnexion
              </button>
            </>
          ) : (

            !loading && (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-700 hover:text-emerald-700"
                >
                  Connexion
                </Link>
                <ButtonLink href="/register">Créer un compte</ButtonLink>
              </>
            )
          )}
          
        </nav>
      </div>
    </header>
  );
}
