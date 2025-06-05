import sharp from "sharp";
import { GlobalFonts, createCanvas, loadImage } from "@napi-rs/canvas";
import { FontConfig } from "./opengraph-config.mjs";
import path from "path";

const PREFIX_OFFSET = 30;
const DEFAULT_OFFSET = 20;

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

import type { SKRSContext2D } from "@napi-rs/canvas";

function wrapText(
  ctx: SKRSContext2D,
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

function drawText(ctx: SKRSContext2D, options: TextOptions): number {
  const fontFamily = options.font.name.split(".")[0];
  ctx.font = `${options.font.size}px "${fontFamily}"`;
  ctx.fillStyle = options.font.color;

  let x = options.position.x;
  let y = options.position.y;

  if (options.font.prefix_symbol) {
    const prefixWidth = ctx.measureText(options.font.prefix_symbol).width;
    ctx.fillStyle = options.font.prefix_symbol_color || options.font.color;
    ctx.fillText(
      options.font.prefix_symbol,
      x - prefixWidth - PREFIX_OFFSET,
      y
    );
  }

  ctx.fillStyle = options.font.color;
  const lines = options.maxWidth
    ? wrapText(ctx, options.text, options.maxWidth)
    : [options.text];

  lines.forEach((line) => {
    ctx.fillText(line, x, y);
    y += options.lineHeight || options.font.size;
  });

  return y;
}

export async function generateOpenGraphImage(
  options: OpenGraphOptions
): Promise<void> {
  const fontsPath = path.join(process.cwd(), "fonts");

  GlobalFonts.registerFromPath(
    path.join(fontsPath, options.title.font.name),
    options.title.font.name.split(".")[0]
  );
  GlobalFonts.registerFromPath(
    path.join(fontsPath, options.description.font.name),
    options.description.font.name.split(".")[0]
  );
  GlobalFonts.registerFromPath(
    path.join(fontsPath, options.domain.font.name),
    options.domain.font.name.split(".")[0]
  );

  const image = await loadImage(options.templatePath);
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(image, 0, 0);

  drawText(ctx, options.domain);
  const titleBottom = drawText(ctx, options.title);
  const descriptionOffset = options.descriptionOffset || DEFAULT_OFFSET;
  options.description.position.y = titleBottom + descriptionOffset;
  drawText(ctx, options.description);

  const buffer = canvas.toBuffer("image/png");
  console.log("Saving image to:", options.outputPath);
  await sharp(buffer).toFile(options.outputPath);
}
