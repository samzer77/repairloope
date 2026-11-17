import Link from "next/link";
import RegisterForm from "@/features/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold">Créer un compte</h1>
      <div className="mt-6">
        <RegisterForm />
      </div>
      <p className="mt-4 text-sm text-slate-600">
        Déjà inscrit ?{" "}
        <Link href="/login" className="font-medium text-emerald-700 hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
