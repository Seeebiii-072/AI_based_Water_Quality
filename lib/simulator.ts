import { SENSORS, type Reading, type Scenario, type SensorKey, type Values } from "./sensors";

const gauss = () => {
  let u = 0, v = 0;
  while (!u) u = Math.random();
  while (!v) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};
const ease = (cur: number, target: number, a: number) => cur + (target - cur) * a;

/** Correlated plant simulator: flow drives load, low DO raises NH4-N and lowers ORP. */
export class Simulator {
  private i = 0;
  private scenario: Scenario = "normal";
  private left = 0;
  private s = { do: 2.6, nh4: 5, flow: 100, temp: 18, turb: 22 };

  private updateScenario() {
    if (this.left > 0) {
      if (--this.left === 0) this.scenario = "normal";
      return;
    }
    const r = Math.random();
    if (r < 0.012) { this.scenario = "low_do"; this.left = 25 + Math.floor(Math.random() * 15); }
    else if (r < 0.02) { this.scenario = "high_nh4"; this.left = 25 + Math.floor(Math.random() * 15); }
  }

  step(): Reading {
    this.i++;
    this.updateScenario();
    const s = this.s;
    const d = Math.sin((2 * Math.PI * this.i) / 120);
    const sc = this.scenario;

    s.flow = ease(s.flow, 100 + 35 * d, 0.1);
    s.temp = ease(s.temp, 18 + 2 * Math.sin((2 * Math.PI * this.i) / 600), 0.05);
    s.do = ease(s.do, sc === "low_do" ? 0.7 : 2.6 - 0.3 * d, 0.2);
    const nh4Target = 5 + 0.04 * (s.flow - 100) + (sc === "low_do" ? 5 : 0) + (sc === "high_nh4" ? 12 : 0);
    s.nh4 = ease(s.nh4, nh4Target, 0.12);
    s.turb = ease(s.turb, 20 + 0.25 * (s.flow - 100), 0.1);

    const raw: Record<SensorKey, number> = {
      ph: 7.3 - 0.02 * (s.nh4 - 6) + 0.03 * gauss(),
      temperature: s.temp + 0.1 * gauss(),
      do: Math.max(0.05, s.do + 0.05 * gauss()),
      conductivity: 800 + 18 * s.nh4 + 0.4 * (s.flow - 100) + 10 * gauss(),
      turbidity: Math.max(0, s.turb + gauss()),
      orp: -110 + 75 * s.do + 4 * gauss(),
      nh4: Math.max(0, s.nh4 + 0.15 * gauss()),
      flow: Math.max(0, s.flow + 1.5 * gauss()),
    };

    const values = {} as Values;
    for (const m of SENSORS) {
      const r = Math.random();
      let v: number | null = raw[m.key];
      if (r < 0.02) v = null; // missing reading
      else if (r < 0.027) v = m.max + (m.max - m.min) * 0.3; // spike / outlier
      values[m.key] = v === null ? null : Number(v.toFixed(m.decimals));
    }
    return { t: Date.now(), scenario: sc, values };
  }
}
