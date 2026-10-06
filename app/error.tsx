"use client";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-md p-10 text-center">
      <p className="text-slate-300">Something went wrong loading the dashboard.</p>
      <button onClick={reset} className="mt-4 rounded bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950">
        Try again
      </button>
    </div>
  );
}
