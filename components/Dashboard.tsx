"use client";
import { useMemo, useState } from "react";
import { SCENARIO_LABEL, SENSORS, type SensorKey } from "@/lib/sensors";
import { useSimulation } from "@/lib/useSimulation";
import Card from "./Card";
import Header from "./Header";
import SensorCard from "./SensorCard";
import TrendChart from "./TrendChart";

const Row = ({ k, v }: { k: string; v: React.ReactNode }) => (
  <div className="flex justify-between gap-4 py-1 text-sm"><span className="text-slate-400">{k}</span><span className="text-right text-slate-100">{v}</span></div>
);

export default function Dashboard() {
  const { running, toggle, history, status, scenario, counts, error } = useSimulation();
  const [selected, setSelected] = useState<SensorKey>("do");
  const latest = history[history.length - 1];
  const lastTn = [...history].reverse().find((p) => p.tn !== null)?.tn ?? null;
  const meta = SENSORS.find((s) => s.key === selected)!;

  const chartData = useMemo(
    () => history.map((p) => ({ time: new Date(p.t).toLocaleTimeString([], { hour12: false }), tn: p.tn, ...p.values })),
    [history],
  );
  const sensorStates = status ? Object.values(status) : [];
  const faulty = sensorStates.filter((s) => s !== "ok").length;

  return (
    <>
      <Header live={running} />
      <main className="mx-auto max-w-7xl space-y-4 px-4 py-6">
        {error && (
          <div role="alert" className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-300">
            Prediction service error: {error}. Retrying on the next reading.
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">AI Estimated TN</p>
            {lastTn === null ? (
              <p className="mt-4 text-sm text-slate-400">Waiting for first reading…</p>
            ) : (
              <p className="mt-2 text-5xl font-bold tabular-nums text-slate-50">
                {lastTn.toFixed(1)}<span className="ml-2 text-base font-normal text-slate-400">mg/L</span>
              </p>
            )}
            <p className="mt-3 text-xs text-slate-500">Model estimate from simulated sensors — not a measured TN value.</p>
            <button onClick={toggle} className="mt-4 rounded-md bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-400">
              {running ? "Stop simulation" : "Start simulation"}
            </button>
          </Card>

          <Card title="Model information">
            <Row k="Model" v="AI Soft Sensor" />
            <Row k="Status" v={running ? "Running" : "Stopped"} />
            <Row k="Data Source" v="Simulation" />
            <Row k="Input window" v="10 readings" />
            <Row k="Scenario" v={SCENARIO_LABEL[scenario]} />
          </Card>

          <Card title="Data quality">
            <Row k="Readings processed" v={counts.readings} />
            <Row k="Missing readings" v={counts.missing} />
            <Row k="Outliers" v={counts.outliers} />
            <Row k="Sensor status" v={!status ? "—" : faulty === 0 ? <span className="text-emerald-400">All sensors OK</span> : <span className="text-amber-400">{faulty} flagged</span>} />
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {SENSORS.map((m) => (
            <SensorCard key={m.key} meta={m} value={latest?.values[m.key] ?? null} status={status?.[m.key]} selected={m.key === selected} onSelect={() => setSelected(m.key)} />
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card title={`Sensor trend — ${meta.label}${meta.unit ? ` (${meta.unit})` : ""}`}>
            {history.length === 0 ? <p className="py-24 text-center text-sm text-slate-500">Waiting for data…</p> : <TrendChart data={chartData} dataKey={selected} color={meta.color} />}
          </Card>
          <Card title="AI Estimated TN (mg/L)">
            {history.length === 0 ? <p className="py-24 text-center text-sm text-slate-500">Waiting for data…</p> : <TrendChart data={chartData} dataKey="tn" color="#22d3ee" />}
          </Card>
        </div>
      </main>
    </>
  );
}
