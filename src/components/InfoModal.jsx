import { useEffect } from "react";
import { X } from "lucide-react";

export default function InfoModal({ open, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-sky-600 mb-2">About</p>
            <h2 className="text-2xl font-light tracking-tight text-slate-900">MelanoScan</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-5 text-sm text-slate-600 leading-relaxed">
          <div>
            <h3 className="text-slate-900 font-medium mb-1.5">What it does</h3>
            <p>
              An AI model trained to classify images of skin lesions as benign or malignant,
              returning a confidence score for each prediction.
            </p>
          </div>
          <div>
            <h3 className="text-slate-900 font-medium mb-1.5">How to use it</h3>
            <p>
              Upload a clear, well-lit, close-up photograph of the lesion. Avoid shadows,
              blurry images, or photos taken from too far away.
            </p>
          </div>
          <div>
            <h3 className="text-slate-900 font-medium mb-1.5">Limitations</h3>
            <p>
              This model is a research tool. It can produce both false positives and false
              negatives. It does not replace clinical examination, dermoscopy, or biopsy.
            </p>
          </div>
          <div className="pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-500">
              If you are concerned about a skin lesion, please consult a qualified dermatologist.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
