import { Image as ImageIcon } from "lucide-react";

export default function ImagePreview({ file, previewUrl, onRemove }) {
  const sizeKB = (file.size / 1024).toFixed(1);
  const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
  const sizeText = file.size > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div
        className="relative bg-slate-50 flex items-center justify-center"
        style={{ minHeight: "320px" }}
      >
        <img
          src={previewUrl}
          alt="Uploaded lesion"
          className="max-h-[420px] w-auto object-contain"
        />
      </div>
      <div className="px-5 py-4 flex items-center justify-between border-t border-slate-200">
        <div className="flex items-center gap-3 min-w-0">
          <ImageIcon className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm text-slate-900 truncate">{file.name}</p>
            <p className="text-xs text-slate-500">{sizeText}</p>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="text-xs text-slate-500 hover:text-rose-600 transition-colors px-3 py-1.5 rounded-full hover:bg-rose-50"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
