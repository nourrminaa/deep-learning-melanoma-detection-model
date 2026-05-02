import { AlertCircle } from "lucide-react";

export default function ErrorMessage({ message }) {
  return (
    <div className="mt-8 rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 flex items-start gap-3">
      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
      <div>
        <p className="text-sm text-rose-900 font-medium">Analysis failed</p>
        <p className="text-xs text-rose-700 mt-0.5">{message}</p>
      </div>
    </div>
  );
}
