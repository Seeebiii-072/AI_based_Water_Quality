import { SENSORS, type CleanValues, type Values } from "./sensors";

/** Fill gaps in a validated window: forward-fill, then back-fill, then sensor default. */
export function imputeWindow(window: Values[]): CleanValues[] {
  const out = window.map(() => ({}) as CleanValues);
  for (const m of SENSORS) {
    let last: number | null = null;
    const col = window.map((r) => {
      if (r[m.key] !== null) last = r[m.key];
      return last;
    });
    const firstValid = col.find((v) => v !== null) ?? m.typical;
    col.forEach((v, i) => { out[i][m.key] = v ?? firstValid; });
  }
  return out;
}
