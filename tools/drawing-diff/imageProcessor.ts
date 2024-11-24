interface Colors {
  SOURCE: string;
  TARGET: string;
}

type RenderElement = HTMLImageElement;

async function generateDiff(
  sourceImage: HTMLImageElement,
  targetImage: HTMLImageElement,
  workingCanvas: HTMLCanvasElement,
  renderElements: RenderElement[]
): Promise<void> {
  // Configure colors.
  const COLORS: Colors = {
    SOURCE: "#0000FF",
    TARGET: "#F28522",
  };

  // Use source image dimensions for diff.
  const width: number = sourceImage.naturalWidth;
  const height: number = sourceImage.naturalHeight;
  initializeCanvas(workingCanvas, width, height);

  const ctx: CanvasRenderingContext2D | null = workingCanvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  clear(workingCanvas, ctx);

  ctx.globalCompositeOperation = "screen";

  // Draw and screen source.
  const sourceImageScreened: HTMLImageElement = await screenImage(
    workingCanvas,
    ctx,
    sourceImage,
    width,
    height,
    COLORS.SOURCE
  );
  await sourceImageScreened.decode();

  clear(workingCanvas, ctx);

  // Draw and screen target.
  const targetImageScreened: HTMLImageElement = await screenImage(
    workingCanvas,
    ctx,
    targetImage,
    width,
    height,
    COLORS.TARGET
  );
  await targetImageScreened.decode();

  clear(workingCanvas, ctx);

  // Set opacity and redraw.
  ctx.globalCompositeOperation = "source-over";
  drawImage(ctx, sourceImageScreened, width, height);
  ctx.save();
  ctx.globalAlpha = 0.5;
  drawImage(ctx, targetImageScreened, width, height);

  // Update render elements
  await Promise.all(
    renderElements.map(async (element) => {
      element.src = workingCanvas.toDataURL("image/png");
      await element.decode();
    })
  );
}

function initializeCanvas(
  canvas: HTMLCanvasElement,
  width: number,
  height: number
): void {
  canvas.hidden = true;
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
}

function clear(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

async function screenImage(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  screenColor: string
): Promise<HTMLImageElement> {
  drawImage(ctx, image, width, height);
  desaturate(canvas, ctx);
  ctx.fillStyle = screenColor;
  ctx.fillRect(0, 0, width, height);

  const imageScreened = new Image(width, height);
  imageScreened.src = canvas.toDataURL("image/png");
  return imageScreened;
}

function desaturate(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
): void {
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const count = data[i] + data[i + 1] + data[i + 2];
    let colour = 0;

    if (count > 510) {
      colour = 255;
    } else if (count > 255) {
      colour = 127.5;
    }

    data[i] = colour;
    data[i + 1] = colour;
    data[i + 2] = colour;
    data[i + 3] = 255;
  }

  ctx.putImageData(imgData, 0, 0);
}

function drawImage(
  ctx: CanvasRenderingContext2D,
  imageObj: HTMLImageElement,
  width: number,
  height: number
): void {
  ctx.drawImage(imageObj, 0, 0, width, height);
}

export {
  generateDiff,
  initializeCanvas,
  clear,
  screenImage,
  desaturate,
  drawImage,
};
