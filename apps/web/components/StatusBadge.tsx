import { STATUS_LABELS, type RequestStatus } from "@/lib/types";

const colors: Record<RequestStatus, string> = {
  draft: "bg-slate-100 text-slate-700",
  submitted: "bg-blue-100 text-blue-800",
  discussion: "bg-indigo-100 text-indigo-800",
  quotes: "bg-violet-100 text-violet-800",
  planned: "bg-amber-100 text-amber-800",
  in_repair: "bg-orange-100 text-orange-800",
  done: "bg-emerald-100 text-emerald-800",
  unrepairable: "bg-rose-100 text-rose-800",
  cancelled: "bg-slate-200 text-slate-600",
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
