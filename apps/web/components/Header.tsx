import Link from "next/link";
import ButtonLink from "./ButtonLink";

export default function Header() {
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
          <Link
            href="/login"
            className="text-sm font-medium text-slate-700 hover:text-emerald-700"
          >
            Connexion
          </Link>
          <ButtonLink href="/register">Créer un compte</ButtonLink>
        </nav>
      </div>
    </header>
  );
}
