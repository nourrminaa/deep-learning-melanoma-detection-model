import { AlertCircle } from "lucide-react";

export default function DisclaimerBanner() {
  return (
    <div className="w-full bg-slate-50 border-b border-slate-200">
      <div className="mx-auto max-w-5xl px-6 py-2.5 flex items-center gap-2.5">
        <AlertCircle className="w-3.5 h-3.5 text-sky-600 shrink-0" />
        <p className="text-xs text-slate-600 leading-relaxed">
          For educational and research purposes only. This tool is not a medical diagnostic
          device. Always consult a qualified dermatologist.
        </p>
      </div>
    </div>
  );
}
