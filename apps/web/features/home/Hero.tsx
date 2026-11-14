import ButtonLink from "@/components/ButtonLink";

export default function Hero() {
  return (
    <section className="bg-emerald-50">
      <div className="mx-auto max-w-6xl px-4 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Ne jetez plus, <span className="text-emerald-600">faites réparer</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
          Publiez votre demande, recevez des devis de réparateurs locaux,
          choisissez le meilleur et suivez votre réparation.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/register">Publier une demande</ButtonLink>
          <ButtonLink href="/repairers" variant="secondary">
            Voir les réparateurs
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
