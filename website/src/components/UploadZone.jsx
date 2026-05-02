import { useState, useRef, useCallback } from "react";
import { Upload } from "lucide-react";

export default function UploadZone({ onFile }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const validateAndSet = useCallback(
    (file) => {
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file (JPG or PNG).");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be under 10MB.");
        return;
      }
      onFile(file);
    },
    [onFile]
  );

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    validateAndSet(e.dataTransfer.files?.[0]);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 px-6 py-20 text-center ${
        isDragging
          ? "border-sky-500 bg-sky-50/60"
          : "border-slate-300 bg-white hover:border-sky-400 hover:bg-sky-50/30"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        className="hidden"
        onChange={(e) => validateAndSet(e.target.files?.[0])}
      />
      <div className="flex flex-col items-center gap-4">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
            isDragging ? "bg-sky-100" : "bg-slate-100"
          }`}
        >
          <Upload className={`w-5 h-5 ${isDragging ? "text-sky-600" : "text-slate-500"}`} />
        </div>
        <div>
          <p className="text-base text-slate-900 font-medium mb-1">Drag and drop an image</p>
          <p className="text-sm text-slate-500">
            or <span className="text-sky-600 underline underline-offset-2">click to browse</span>
          </p>
        </div>
        <p className="text-xs text-slate-400 mt-2">JPG or PNG · up to 10MB</p>
      </div>
    </div>
  );
}
