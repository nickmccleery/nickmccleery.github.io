const RESET_MATCHING_PIXELS = false;
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
  const COLORS: Colors = {
    SOURCE: "#0000FF",
    TARGET: "#F28522",
  };

  const width: number = sourceImage.naturalWidth;
  const height: number = sourceImage.naturalHeight;
  initializeCanvas(workingCanvas, width, height);

  const ctx: CanvasRenderingContext2D | null = workingCanvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  // Create temporary canvas for original pixel comparison.
  const sourceCanvas = document.createElement("canvas");
  const targetCanvas = document.createElement("canvas");
  initializeCanvas(sourceCanvas, width, height);
  initializeCanvas(targetCanvas, width, height);

  const sourceCtx = sourceCanvas.getContext("2d")!;
  const targetCtx = targetCanvas.getContext("2d")!;

  // Get original pixel data for comparison.
  drawImage(sourceCtx, sourceImage, width, height);
  drawImage(targetCtx, targetImage, width, height);
  const sourceData = sourceCtx.getImageData(0, 0, width, height);
  const targetData = targetCtx.getImageData(0, 0, width, height);

  // Process the diff as normal.
  clear(workingCanvas, ctx);
  ctx.globalCompositeOperation = "screen";

  const sourceImageScreened = await screenImage(
    workingCanvas,
    ctx,
    sourceImage,
    width,
    height,
    COLORS.SOURCE
  );
  await sourceImageScreened.decode();

  clear(workingCanvas, ctx);

  const targetImageScreened = await screenImage(
    workingCanvas,
    ctx,
    targetImage,
    width,
    height,
    COLORS.TARGET
  );
  await targetImageScreened.decode();

  clear(workingCanvas, ctx);

  ctx.globalCompositeOperation = "source-over";
  drawImage(ctx, sourceImageScreened, width, height);
  ctx.save();
  ctx.globalAlpha = 0.6;
  drawImage(ctx, targetImageScreened, width, height);

  if (RESET_MATCHING_PIXELS) {
    // After diff is complete, restore original pixels where they match.
    const diffData = ctx.getImageData(0, 0, width, height);

    for (let i = 0; i < sourceData.data.length; i += 4) {
      const pixelsMatch =
        Math.abs(sourceData.data[i] - targetData.data[i]) <= 5 &&
        Math.abs(sourceData.data[i + 1] - targetData.data[i + 1]) <= 5 &&
        Math.abs(sourceData.data[i + 2] - targetData.data[i + 2]) <= 5 &&
        Math.abs(sourceData.data[i + 3] - targetData.data[i + 3]) <= 5;

      if (pixelsMatch) {
        diffData.data[i] = sourceData.data[i];
        diffData.data[i + 1] = sourceData.data[i + 1];
        diffData.data[i + 2] = sourceData.data[i + 2];
        diffData.data[i + 3] = sourceData.data[i + 3];
      }
    }

    ctx.putImageData(diffData, 0, 0);
  }

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
