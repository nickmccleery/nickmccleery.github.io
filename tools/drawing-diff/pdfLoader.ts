import * as pdfjsLib from "pdfjs-dist";
import {
  PDFDocumentLoadingTask,
  PageViewport as PDFViewport,
} from "pdfjs-dist";

// Set the worker source for PDF.js library.
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface RenderContext {
  canvasContext: CanvasRenderingContext2D;
  transform: number[];
  viewport: PDFViewport;
}

function readFileTo(event: Event, renderElement: HTMLImageElement): void {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const fileReader = new FileReader();

  fileReader.onload = function (): void {
    const typedarray = new Uint8Array(this.result as ArrayBuffer);
    const loadingTask = pdfjsLib.getDocument(typedarray);
    loadAndRender(loadingTask, renderElement);
  };
  fileReader.readAsArrayBuffer(file);
}

function loadAndRender(
  loadingTask: PDFDocumentLoadingTask,
  renderElement: HTMLImageElement
): void {
  (async () => {
    const pdf = await loadingTask.promise;

    // Fetch the first page.
    const page = await pdf.getPage(1);
    const scale = 3;
    const viewport = page.getViewport({ scale });

    // Support HiDPI-screens.
    const outputScale = window.devicePixelRatio || 1;

    // Prepare canvas using PDF page dimensions.
    const canvas = document.getElementById("pdf") as HTMLCanvasElement;
    if (!canvas) {
      throw new Error("Canvas element not found.");
    }

    canvas.hidden = true;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas context not found.");
    }

    canvas.width = Math.floor(viewport.width * outputScale);
    canvas.height = Math.floor(viewport.height * outputScale);
    canvas.style.width = `${Math.floor(viewport.width)}px`;
    canvas.style.height = `${Math.floor(viewport.height)}px`;

    const transform =
      outputScale !== 1
        ? [outputScale, 0, 0, outputScale, 0, 0]
        : [1, 0, 0, 1, 0, 0];

    // Render PDF page into canvas context.
    const renderContext: RenderContext = {
      canvasContext: context,
      transform,
      viewport,
    };

    const renderTask = page.render(renderContext);
    renderTask.promise.then(function (): void {
      const imageSrc = canvas.toDataURL("image/png");
      renderElement.src = imageSrc;
    });
  })();
}

export { readFileTo, loadAndRender };
