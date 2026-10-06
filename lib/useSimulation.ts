"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Simulator } from "./simulator";
import type { Scenario, SensorKey, SensorStatus, Values } from "./sensors";

export interface Point { t: number; values: Values; tn: number | null }
const WINDOW = 10;
const MAX_POINTS = 60;

export function useSimulation(intervalMs = 1500) {
  const sim = useRef<Simulator | null>(null);
  const win = useRef<Values[]>([]);
  const [running, setRunning] = useState(true);
  const [history, setHistory] = useState<Point[]>([]);
  const [status, setStatus] = useState<Record<SensorKey, SensorStatus> | null>(null);
  const [scenario, setScenario] = useState<Scenario>("normal");
  const [counts, setCounts] = useState({ readings: 0, missing: 0, outliers: 0 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!running) return;
    sim.current ??= new Simulator();
    let cancelled = false;

    const tick = async () => {
      const r = sim.current!.step();
      win.current = [...win.current, r.values].slice(-WINDOW);
      let tn: number | null = null;
      let st: Record<SensorKey, SensorStatus> | null = null;
      try {
        const res = await fetch("/api/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ window: win.current }),
        });
        if (!res.ok) throw new Error(`Prediction API returned ${res.status}`);
        const data = await res.json();
        tn = data.tn;
        st = data.status;
        if (!cancelled) setError(null);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Prediction request failed");
      }
      if (cancelled) return;
      setScenario(r.scenario);
      setHistory((h) => [...h, { t: r.t, values: r.values, tn }].slice(-MAX_POINTS));
      if (st) {
        setStatus(st);
        const vals = Object.values(st);
        setCounts((c) => ({
          readings: c.readings + 1,
          missing: c.missing + vals.filter((s) => s === "missing").length,
          outliers: c.outliers + vals.filter((s) => s === "outlier").length,
        }));
      }
    };

    tick();
    const id = setInterval(tick, intervalMs);
    return () => { cancelled = true; clearInterval(id); };
  }, [running, intervalMs]);

  const toggle = useCallback(() => setRunning((r) => !r), []);
  return { running, toggle, history, status, scenario, counts, error };
}
