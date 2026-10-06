import type { SensorMeta, SensorStatus } from "@/lib/sensors";

const BADGE: Record<SensorStatus, string> = {
  ok: "text-emerald-400",
  missing: "text-slate-500",
  outlier: "text-amber-400",
};

export default function SensorCard({
  meta, value, status, selected, onSelect,
}: {
  meta: SensorMeta; value: number | null; status?: SensorStatus; selected: boolean; onSelect: () => void;
}) {
  const st = status ?? "missing";
  return (
    <button
      onClick={onSelect}
      className={`rounded-xl border p-4 text-left transition-colors ${selected ? "border-cyan-500/60 bg-slate-900" : "border-slate-800 bg-slate-900/60 hover:border-slate-700"}`}
    >
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{meta.label}</span>
        <span className={BADGE[st]}>{st === "ok" ? "OK" : st === "missing" ? "Missing" : "Outlier"}</span>
      </div>
      <div className={`mt-2 text-2xl font-semibold tabular-nums ${st === "outlier" ? "text-amber-300" : "text-slate-100"}`}>
        {value === null ? "—" : value.toFixed(meta.decimals)}
        <span className="ml-1 text-xs font-normal text-slate-500">{meta.unit}</span>
      </div>
    </button>
  );
}
