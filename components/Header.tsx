"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header({ live }: { live?: boolean }) {
  const path = usePathname();
  const link = (href: string, label: string) => (
    <Link
      href={href}
      className={`rounded-md px-3 py-1.5 text-sm ${path === href ? "bg-slate-800 text-cyan-300" : "text-slate-400 hover:text-slate-200"}`}
    >
      {label}
    </Link>
  );
  return (
    <header className="border-b border-slate-800 bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-bold tracking-widest text-slate-100 sm:text-base">WATER QUALITY AI MONITOR</h1>
          {live !== undefined && (
            <span className={`flex items-center gap-1.5 text-xs font-semibold ${live ? "text-emerald-400" : "text-slate-500"}`}>
              <span className={`h-2 w-2 rounded-full ${live ? "bg-emerald-400" : "bg-slate-500"}`} />
              {live ? "LIVE" : "PAUSED"}
            </span>
          )}
        </div>
        <nav className="flex gap-1">
          {link("/", "Live Monitoring")}
          {link("/research", "Model / Research")}
        </nav>
      </div>
    </header>
  );
}
