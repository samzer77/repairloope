import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/features/auth/AuthContext";


export const metadata: Metadata = {
  title: "RepairLoop – Faites réparer vos objets près de chez vous",
  description:
    "Publiez votre demande, recevez des devis de réparateurs locaux et suivez votre réparation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
     <body className="flex min-h-screen flex-col font-sans antialiased">
  <AuthProvider>
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
  </AuthProvider>
</body>

    </html>
  );
}
