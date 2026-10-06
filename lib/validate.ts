import { SENSORS, type SensorKey, type SensorStatus, type Values } from "./sensors";

export interface Validated {
  clean: Values; // outliers and missing replaced by null
  status: Record<SensorKey, SensorStatus>;
}

export function validateReading(values: Values): Validated {
  const clean = {} as Values;
  const status = {} as Record<SensorKey, SensorStatus>;
  for (const m of SENSORS) {
    const v = values[m.key];
    if (v === null || !Number.isFinite(v)) { clean[m.key] = null; status[m.key] = "missing"; }
    else if (v < m.min || v > m.max) { clean[m.key] = null; status[m.key] = "outlier"; }
    else { clean[m.key] = v; status[m.key] = "ok"; }
  }
  return { clean, status };
}
