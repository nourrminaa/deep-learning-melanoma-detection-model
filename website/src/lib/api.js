// =============================================================================
// API LAYER
// -----------------------------------------------------------------------------
// Right now this is a MOCK that returns fake results so you can test the UI
// without a backend. When your Hugging Face Space (or Colab Gradio link) is
// ready, replace the body of `analyzeImage` with the real call — see the
// commented block at the bottom of this file for the template.
// =============================================================================

export async function analyzeImage(file) {
  // --- MOCK IMPLEMENTATION (remove once the model is hooked up) ---
  await new Promise((resolve) => setTimeout(resolve, 2200));

  const malignantProb = Math.random();
  const benignProb = 1 - malignantProb;
  const isMalignant = malignantProb > 0.5;

  return {
    prediction: isMalignant ? "Malignant" : "Benign",
    confidence: isMalignant ? malignantProb : benignProb,
    probabilities: {
      benign: benignProb,
      malignant: malignantProb,
    },
  };
}

// =============================================================================
// REAL IMPLEMENTATION TEMPLATE — uncomment and adapt when ready
// =============================================================================
//
// import { Client } from "@gradio/client";
//
// // Replace with your Hugging Face Space slug, e.g. "yourname/melanoma-detector"
// const SPACE_ID = "YOUR_USERNAME/YOUR_SPACE_NAME";
//
// export async function analyzeImage(file) {
//   const client = await Client.connect(SPACE_ID);
//   const result = await client.predict("/predict", { image: file });
//
//   // result.data is whatever your Gradio function returned.
//   // The shape below assumes your Gradio app returns:
//   //   { label: "Malignant", confidences: [{label, confidence}, ...] }
//   // Adjust this parser to match what your model actually returns.
//
//   const data = Array.isArray(result.data) ? result.data[0] : result.data;
//   const benign = data.confidences.find((c) => c.label.toLowerCase() === "benign");
//   const malignant = data.confidences.find((c) => c.label.toLowerCase() === "malignant");
//
//   return {
//     prediction: data.label,
//     confidence: data.label === "Malignant" ? malignant.confidence : benign.confidence,
//     probabilities: {
//       benign: benign.confidence,
//       malignant: malignant.confidence,
//     },
//   };
// }
