const categories = [
  { name: "Électroménager", icon: "🧺" },
  { name: "Informatique", icon: "💻" },
  { name: "Smartphones", icon: "📱" },
  { name: "Vélos", icon: "🚲" },
  { name: "Meubles", icon: "🪑" },
  { name: "Vêtements", icon: "🧵" },
];

export default function Categories() {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold">Que pouvez-vous faire réparer ?</h2>
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <li
              key={c.name}
              className="rounded-xl border border-slate-200 bg-white p-5 text-center"
            >
              <div className="text-3xl">{c.icon}</div>
              <p className="mt-2 text-sm font-medium">{c.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
