import sharp from "sharp";
import { registerFont, createCanvas, loadImage } from "canvas";

interface OpenGraphOptions {
  templatePath: string;
  outputPath: string;
  fontPath: string;
  fontSize: number;
  text: string;
  textColor: string;
  textPosition: { x: number; y: number };
}

export async function generateOpenGraphImage(
  options: OpenGraphOptions
): Promise<void> {
  // Register the font
  registerFont(options.fontPath, { family: "CustomFont" });

  // Load the template image
  const image = await loadImage(options.templatePath);

  // Create a canvas with the same dimensions as the template
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");

  // Draw the template image onto the canvas
  ctx.drawImage(image, 0, 0);

  // Set up the text style
  ctx.font = `${options.fontSize}px CustomFont`;
  ctx.fillStyle = options.textColor;

  // Draw the text
  ctx.fillText(options.text, options.textPosition.x, options.textPosition.y);

  // Convert the canvas to a buffer
  const buffer = canvas.toBuffer("image/png");

  // Use Sharp to save the image
  console.log("Saving image to:", options.outputPath);
  await sharp(buffer).toFile(options.outputPath);
}
