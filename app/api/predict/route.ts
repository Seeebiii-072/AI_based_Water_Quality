import { NextResponse } from "next/server";
import { heuristicModel } from "@/lib/model";
import { imputeWindow } from "@/lib/preprocess";
import { SENSORS, type Values } from "@/lib/sensors";
import { validateReading } from "@/lib/validate";

export const dynamic = "force-dynamic";

const sanitize = (row: unknown): Values => {
  const out = {} as Values;
  for (const m of SENSORS) {
    const v = (row as Record<string, unknown> | null)?.[m.key];
    out[m.key] = typeof v === "number" && Number.isFinite(v) ? v : null;
  }
  return out;
};

/** Stateless: validate -> preprocess -> window -> model. */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!Array.isArray(body?.window) || body.window.length === 0 || body.window.length > 60) {
      return NextResponse.json({ error: "Expected a non-empty 'window' array (max 60)." }, { status: 400 });
    }
    const validated = (body.window as unknown[]).map((r) => validateReading(sanitize(r)));
    const window = imputeWindow(validated.map((v) => v.clean)).slice(-heuristicModel.windowSize);
    const tn = heuristicModel.predict(window);
    return NextResponse.json({ tn, model: heuristicModel.id, status: validated[validated.length - 1].status });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
