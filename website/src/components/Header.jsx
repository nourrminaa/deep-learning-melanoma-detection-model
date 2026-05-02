import { Info } from "lucide-react";

export default function Header({ onInfoClick }) {
  return (
    <header className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-base font-medium tracking-tight text-slate-900 cursor-pointer"
  onClick={() => window.location.reload()}>
            MelanoScan
          </span>
        </div>
        <button
          onClick={onInfoClick}
          aria-label="About this tool"
          className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-colors"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
