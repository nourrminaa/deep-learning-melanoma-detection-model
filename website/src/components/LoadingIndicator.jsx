export default function LoadingIndicator() {
  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <div className="flex items-center gap-1.5">
        <span
          className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"
          style={{ animationDelay: "200ms" }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"
          style={{ animationDelay: "400ms" }}
        />
      </div>
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Running model</p>
    </div>
  );
}
