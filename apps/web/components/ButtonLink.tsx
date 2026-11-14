import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
};

const styles = {
  primary: "bg-emerald-600 text-white hover:bg-emerald-700",
  secondary: "border border-slate-300 text-slate-800 hover:bg-slate-100",
};

export default function ButtonLink({ href, children, variant = "primary" }: Props) {
  return (
    <Link
      href={href}
      className={`inline-block rounded-lg px-5 py-2.5 text-sm font-semibold transition ${styles[variant]}`}
    >
      {children}
    </Link>
  );
}
