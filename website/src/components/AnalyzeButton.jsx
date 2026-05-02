import { Loader2 } from "lucide-react";

export default function AnalyzeButton({ onClick, loading, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className="inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium px-8 py-3 rounded-full transition-colors text-sm tracking-wide"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        "Analyze Image"
      )}
    </button>
  );
}
