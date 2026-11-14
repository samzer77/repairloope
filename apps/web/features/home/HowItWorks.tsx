const steps = [
  { title: "Décrivez", text: "Ajoutez une catégorie, une description et des photos de l'objet." },
  { title: "Comparez", text: "Recevez des devis et posez vos questions aux réparateurs." },
  { title: "Planifiez", text: "Acceptez un devis et convenez d'un rendez-vous." },
  { title: "Évaluez", text: "Suivez la réparation puis laissez un avis." },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-center text-2xl font-bold">Comment ça marche ?</h2>
      <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <li key={step.title} className="rounded-xl border border-slate-200 p-6">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 font-bold text-white">
              {i + 1}
            </span>
            <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
