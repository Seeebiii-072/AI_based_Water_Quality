import type { CleanValues } from "./sensors";

/**
 * Soft-sensor interface. Replace `heuristicModel` with a trained LSTM/GRU
 * (e.g. ONNX Runtime Web or a hosted inference endpoint) without touching the rest of the app.
 */
export interface SoftSensorModel {
  id: string;
  name: string;
  windowSize: number;
  /** window: chronologically ordered, imputed readings. Returns estimated TN in mg/L. */
  predict(window: CleanValues[]): number;
}

/** Research-prototype stand-in: recency-weighted window mean + hand-set relationship. NOT trained on real data. */
export const heuristicModel: SoftSensorModel = {
  id: "heuristic-v0",
  name: "AI Soft Sensor",
  windowSize: 10,
  predict(window) {
    const n = window.length;
    const w = window.map((_, i) => Math.pow(0.8, n - 1 - i));
    const sum = w.reduce((a, b) => a + b, 0);
    const avg = (k: keyof CleanValues) => window.reduce((a, r, i) => a + r[k] * w[i], 0) / sum;
    const tn =
      4 +
      1.0 * avg("nh4") +
      0.015 * avg("turbidity") +
      1.4 * Math.max(0, 2 - avg("do")) +
      0.015 * (avg("flow") - 100) -
      0.08 * (avg("temperature") - 18);
    return Number(Math.max(0, tn).toFixed(2));
  },
};
