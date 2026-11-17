import Link from "next/link";
import LoginForm from "@/features/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold">Connexion</h1>
      <div className="mt-6">
        <LoginForm />
      </div>
      <p className="mt-4 text-sm text-slate-600">
        Pas encore de compte ?{" "}
        <Link href="/register" className="font-medium text-emerald-700 hover:underline">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
