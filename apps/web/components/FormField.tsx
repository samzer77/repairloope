type Props = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  error?: string;
  autoComplete?: string;
};

export default function FormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  error,
  autoComplete,
}: Props) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 ${
          error ? "border-red-500" : "border-slate-300"
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
