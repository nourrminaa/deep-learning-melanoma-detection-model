import { RotateCcw } from "lucide-react";

function ProbBar({ label, pct, active, danger }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className={`text-sm ${active ? "text-slate-900 font-medium" : "text-slate-500"}`}>
          {label}
        </span>
        <span className={`text-sm tabular-nums ${active ? "text-slate-900 font-medium" : "text-slate-500"}`}>
          {pct}%
        </span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            active && danger ? "bg-rose-500" : active ? "bg-sky-500" : "bg-slate-300"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function ResultCard({ result, onReset }) {
  const isMalignant   = result.prediction === "Malignant";
  const confidencePct = (result.confidence * 100).toFixed(1);
  const benignPct     = (result.probabilities.benign * 100).toFixed(1);
  const malignantPct  = (result.probabilities.malignant * 100).toFixed(1);

  return (
    <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-8 sm:p-10">
      <p className="text-xs uppercase tracking-[0.2em] text-sky-600 mb-6">Result</p>

      <div className="flex items-baseline gap-4 mb-2 flex-wrap">
        <span
          className={`inline-flex items-center text-xs uppercase tracking-[0.15em] font-medium px-3 py-1 rounded-full border ${
            isMalignant
              ? "bg-rose-50 text-rose-700 border-rose-200"
              : "bg-emerald-50 text-emerald-700 border-emerald-200"
          }`}
        >
          {result.prediction}
        </span>
      </div>

      <div className="mb-10">
        <div className="text-6xl sm:text-7xl font-light tracking-tight text-slate-900 mb-1">
          {confidencePct}
          <span className="text-3xl text-slate-400">%</span>
        </div>
        <p className="text-sm text-slate-500">model confidence</p>
      </div>

      <div className="space-y-5 mb-10">
        <ProbBar label="Benign"    pct={benignPct}    active={!isMalignant} danger={false} />
        <ProbBar label="Malignant" pct={malignantPct} active={isMalignant}  danger={true}  />
      </div>

      <div className="pt-6 border-t border-slate-200 flex items-center justify-between flex-wrap gap-4">
        <p className="text-xs text-slate-500 max-w-md leading-relaxed">
          This is a research tool. Please consult a dermatologist for any clinical decisions.
        </p>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 text-sm text-slate-700 hover:text-sky-600 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Analyze another
        </button>
      </div>
    </div>
  );
}