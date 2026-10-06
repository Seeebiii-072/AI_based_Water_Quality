# Water Quality AI Monitor

Research prototype of an AI **soft sensor** that estimates Total Nitrogen (TN) from routine water-quality sensors
(pH, temperature, DO, conductivity, turbidity, ORP, NH4-N, flow). Data is **simulated**; predictions are labelled
**AI Estimated TN** and are not measured values.

Stack: Next.js (App Router), TypeScript, Tailwind CSS, Recharts. No database, API keys, or extra services.

```
Simulated sensors -> validation -> preprocessing -> time-series window -> model -> TN -> dashboard
```

## Run
```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Deploy
Import the repo in Vercel (framework preset: Next.js, no env vars needed).

## Layout
- `lib/simulator.ts` correlated sensor simulator (disturbances, noise, missing values, outliers)
- `lib/validate.ts`, `lib/preprocess.ts` range checks and imputation
- `lib/model.ts` `SoftSensorModel` interface + heuristic placeholder (swap in LSTM/GRU here)
- `app/api/predict/route.ts` stateless serverless prediction endpoint
- `components/`, `app/` dashboard and research page

## Limitations
Placeholder model is not trained on real data. Simulation state lives in the browser; the API is stateless (serverless-safe).
