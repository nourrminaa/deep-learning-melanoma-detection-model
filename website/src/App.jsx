import { useState, useRef } from "react";
import DisclaimerBanner from "./components/DisclaimerBanner";
import Header from "./components/Header";
import InfoModal from "./components/InfoModal";
import UploadZone from "./components/UploadZone";
import ImagePreview from "./components/ImagePreview";
import AnalyzeButton from "./components/AnalyzeButton";
import LoadingIndicator from "./components/LoadingIndicator";
import ResultCard from "./components/ResultCard";
import ErrorMessage from "./components/ErrorMessage";
import { analyzeImage } from "./lib/api";

export default function App() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const resultRef = useRef(null);

  const handleFile = (file) => {
    setFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeImage(file);
      setResult(data);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <DisclaimerBanner />
      <Header onInfoClick={() => setInfoOpen(true)} />

      <main className="mx-auto max-w-3xl px-6 pt-16 pb-32">
        <section className="mb-14 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-sky-600 mb-5">
            Skin Lesion Analysis
          </p>
          <h1 className="text-4xl sm:text-5xl font-light tracking-tight mb-5 text-slate-900">
            Upload an image for evaluation
          </h1>
          <p className="text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
            Submit a clear, well-lit photo of a skin lesion. The model will return a
            classification with a confidence score.
          </p>
        </section>

        {!previewUrl && <UploadZone onFile={handleFile} />}

        {previewUrl && (
          <>
            <ImagePreview file={file} previewUrl={previewUrl} onRemove={handleReset} />
            {!result && !loading && (
              <div className="mt-8 flex justify-center">
                <AnalyzeButton onClick={handleAnalyze} loading={loading} />
              </div>
            )}
          </>
        )}

        {loading && <LoadingIndicator />}
        {error && <ErrorMessage message={error} />}

        {result && (
          <div ref={resultRef}>
            <ResultCard result={result} onReset={handleReset} />
          </div>
        )}
      </main>

      <InfoModal open={infoOpen} onClose={() => setInfoOpen(false)} />
    </div>
  );
}
