import sharp from "sharp";
import {
  registerFont,
  createCanvas,
  loadImage,
  CanvasRenderingContext2D as NodeCanvasRenderingContext2D,
} from "canvas";
import { FontConfig } from "./opengraph-config.mjs";
import path from "path";

const PREFIX_OFFSET = 75;
const DEFAULT_OFFSET = 50;

interface TextOptions {
  text: string;
  font: FontConfig;
  position: { x: number; y: number };
  maxWidth?: number;
  lineHeight?: number;
}

interface OpenGraphOptions {
  templatePath: string;
  outputPath: string;
  title: TextOptions;
  description: TextOptions;
  domain: TextOptions;
  descriptionOffset?: number;
}

// Function to wrap text
function wrapText(
  ctx: NodeCanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

function drawText(
  ctx: NodeCanvasRenderingContext2D,
  options: TextOptions
): number {
  const fontFamily = options.font.name.split(".")[0];
  ctx.font = `${options.font.size}px "${fontFamily}"`;
  ctx.fillStyle = options.font.color;

  let x = options.position.x;
  let y = options.position.y;

  // Draw prefix symbol, if required.
  if (options.font.prefix_symbol) {
    const prefixWidth = ctx.measureText(options.font.prefix_symbol).width;
    ctx.fillStyle = options.font.prefix_symbol_color || options.font.color;
    ctx.fillText(
      options.font.prefix_symbol,
      x - prefixWidth - PREFIX_OFFSET,
      y
    );
  }

  // Draw main text.
  ctx.fillStyle = options.font.color;
  const lines = options.maxWidth
    ? wrapText(ctx, options.text, options.maxWidth)
    : [options.text];

  lines.forEach((line, index) => {
    ctx.fillText(line, x, y);
    y += options.lineHeight || options.font.size;
  });

  // Return the y-coordinate of the bottom of the text.
  return y;
}

export async function generateOpenGraphImage(
  options: OpenGraphOptions
): Promise<void> {
  const fontsPath = path.join(process.cwd(), "fonts");
  registerFont(path.join(fontsPath, options.title.font.name), {
    family: options.title.font.name.split(".")[0],
  });
  registerFont(path.join(fontsPath, options.description.font.name), {
    family: options.description.font.name.split(".")[0],
  });
  registerFont(path.join(fontsPath, options.domain.font.name), {
    family: options.domain.font.name.split(".")[0],
  });

  // Load the template image.
  const image = await loadImage(options.templatePath);

  // Create a canvas with the same dimensions as the template
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d") as NodeCanvasRenderingContext2D;

  // Draw the template image onto the canvas.
  ctx.drawImage(image, 0, 0);

  // Draw domain.
  drawText(ctx, options.domain);

  // Draw title and get its bottom y-coordinate.
  const titleBottom = drawText(ctx, options.title);

  // Update description position based on title's bottom then draw.
  const descriptionOffset = options.descriptionOffset || DEFAULT_OFFSET;
  options.description.position.y = titleBottom + descriptionOffset;
  drawText(ctx, options.description);

  // Save.
  const buffer = canvas.toBuffer("image/png");
  console.log("Saving image to:", options.outputPath);
  await sharp(buffer).toFile(options.outputPath);
}
