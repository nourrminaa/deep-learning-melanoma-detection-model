import { Client } from "@gradio/client";

const SPACE_ID = "srnazr/melanoma-detector";
const THRESHOLD = 0.25;

export async function analyzeImage(file) {
  const client = await Client.connect(SPACE_ID);
  const result = await client.predict("/predict", { image: file });

  const data = result.data[0];

  // Single sigmoid — label is whichever scored highest
  const melanoma = data.confidences.find(c => c.label === "Melanoma");
  const benign   = data.confidences.find(c => c.label === "Benign");

  const melanomProb = melanoma.confidence;
  const isMelanoma  = melanomProb >= THRESHOLD;

  return {
    prediction:  isMelanoma ? "Melanoma" : "Benign",
    confidence:  isMelanoma ? melanomProb : benign.confidence,
    probabilities: {
      melanoma: melanomProb,
      benign:   benign.confidence,
    },
  };
}
