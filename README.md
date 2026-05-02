# MelanoScan — Frontend

Minimal, clinical/editorial UI for melanoma detection. Built with Vite + React + Tailwind.

## Setup

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Project structure

```
src/
├── App.jsx                 # main page, ties everything together
├── main.jsx                # React entry point
├── index.css               # Tailwind directives
├── components/
│   ├── DisclaimerBanner.jsx
│   ├── Header.jsx
│   ├── InfoModal.jsx
│   ├── UploadZone.jsx
│   ├── ImagePreview.jsx
│   ├── AnalyzeButton.jsx
│   ├── LoadingIndicator.jsx
│   ├── ResultCard.jsx
│   └── ErrorMessage.jsx
└── lib/
    └── api.js              # mock now → real Gradio call later
```

## Renaming the project

The display name "MelanoScan" appears in two places — change both:

- `src/components/Header.jsx`
- `src/components/InfoModal.jsx`
- `index.html` (browser tab title)

## Connecting your model (later)

When your Hugging Face Space is live, open `src/lib/api.js`:

1. Delete the mock implementation
2. Uncomment the real implementation template at the bottom
3. Replace `YOUR_USERNAME/YOUR_SPACE_NAME` with your actual Space slug
4. Adjust the response parser to match your Gradio app's output shape

That's the only file you'll need to touch — the rest of the UI stays the same.

## Design tokens

- Accent: `sky-500` (#0ea5e9)
- Background: `white`
- Soft sections: `slate-50`
- Borders: `slate-200`
- Body text: `slate-600` / `slate-900`
- Font: Inter (loaded from Google Fonts)
# deep-learning-melanoma-detection-model
