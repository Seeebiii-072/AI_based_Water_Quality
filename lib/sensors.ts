export const SENSORS = [
  { key: "ph", label: "pH", unit: "", min: 5.5, max: 9, typical: 7.2, decimals: 2, color: "#a78bfa" },
  { key: "temperature", label: "Temperature", unit: "°C", min: 5, max: 35, typical: 18, decimals: 1, color: "#fb923c" },
  { key: "do", label: "DO", unit: "mg/L", min: 0, max: 12, typical: 2.5, decimals: 2, color: "#22d3ee" },
  { key: "conductivity", label: "Conductivity", unit: "µS/cm", min: 200, max: 3000, typical: 900, decimals: 0, color: "#facc15" },
  { key: "turbidity", label: "Turbidity", unit: "NTU", min: 0, max: 200, typical: 25, decimals: 1, color: "#94a3b8" },
  { key: "orp", label: "ORP", unit: "mV", min: -400, max: 400, typical: 80, decimals: 0, color: "#f472b6" },
  { key: "nh4", label: "NH4-N", unit: "mg/L", min: 0, max: 60, typical: 6, decimals: 2, color: "#f87171" },
  { key: "flow", label: "Flow", unit: "m³/h", min: 0, max: 400, typical: 100, decimals: 0, color: "#4ade80" },
] as const;

export type SensorKey = (typeof SENSORS)[number]["key"];
export type SensorMeta = (typeof SENSORS)[number];
export type Values = Record<SensorKey, number | null>;
export type CleanValues = Record<SensorKey, number>;
export type SensorStatus = "ok" | "missing" | "outlier";
export type Scenario = "normal" | "low_do" | "high_nh4";

export const SCENARIO_LABEL: Record<Scenario, string> = {
  normal: "Normal operation",
  low_do: "Low DO disturbance",
  high_nh4: "Elevated NH4-N",
};

export interface Reading {
  t: number;
  scenario: Scenario;
  values: Values;
}
