import Card from "@/components/Card";
import Header from "@/components/Header";

const PIPELINE = ["Simulated Sensors", "Data Validation", "Preprocessing", "Time-Series Window", "AI Model", "TN Prediction", "Dashboard"];

export default function ResearchPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl space-y-4 px-4 py-6">
        <Card title="Research">
          <p className="text-slate-300">
            This project demonstrates an AI-based soft sensor for estimating Total Nitrogen from routinely available
            water-quality sensor measurements. The current implementation uses simulated sensor data and is intended as a
            research prototype. Future versions can integrate real wastewater datasets, trained LSTM/GRU models, SHAP
            explainability, and real sensor/SCADA data.
          </p>
        </Card>
        <Card title="Pipeline">
          <ol className="flex flex-wrap gap-2 text-sm">
            {PIPELINE.map((s, i) => (
              <li key={s} className="rounded-md border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-slate-200">{i + 1}. {s}</li>
            ))}
          </ol>
        </Card>
        <Card title="Inputs and target">
          <p className="text-slate-300">Inputs: pH, temperature, dissolved oxygen (DO), conductivity, turbidity, ORP, NH4-N, flow. Target: Total Nitrogen (TN, mg/L), shown as <b>AI Estimated TN</b>.</p>
        </Card>
        <Card title="Current model">
          <p className="text-slate-300">
            The first version uses a lightweight TypeScript soft sensor: readings are validated (range checks, missing values),
            gaps are imputed, the last 10 readings form a recency-weighted window, and a hand-set relationship produces the estimate.
            It is <b>not trained</b> on real data and its output must not be read as measured TN. The model sits behind a small
            <code className="mx-1 rounded bg-slate-800 px-1">SoftSensorModel</code> interface (<code className="rounded bg-slate-800 px-1">lib/model.ts</code>) so a trained LSTM/GRU can replace it.
          </p>
        </Card>
        <Card title="Simulation">
          <p className="text-slate-300">
            Sensor values are correlated (flow drives load; low DO raises NH4-N and lowers ORP) and include noise, occasional
            missing readings, spikes, and low-DO / elevated NH4-N disturbances.
          </p>
        </Card>
        <Card title="Limitations and future work">
          <ul className="list-disc space-y-1 pl-5 text-slate-300">
            <li>No real wastewater data or trained model yet; no reference TN measurement for comparison.</li>
            <li>Next: real datasets, LSTM/GRU training and integration, SHAP explainability, real sensor/SCADA ingestion.</li>
          </ul>
        </Card>
      </main>
    </>
  );
}
