import * as pdfjsLib from "pdfjs-dist";

// Point to the worker file in our static assets
pdfjsLib.GlobalWorkerOptions.workerSrc = "/js/pdf.worker.mjs";

export { readFileTo, loadAndRender } from "./pdfLoader";
export { generateDiff } from "./imageProcessor";
