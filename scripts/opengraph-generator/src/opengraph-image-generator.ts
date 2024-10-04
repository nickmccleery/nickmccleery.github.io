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
  lineHeight: number; // New property for line height
  maxWidth: number; // New property for text wrapping
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

  // Function to wrap text
  function wrapText(text: string, maxWidth: number): string[] {
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

  // Wrap text and draw it with custom line height
  const lines = wrapText(options.text, options.maxWidth);
  let y = options.textPosition.y;

  lines.forEach((line) => {
    ctx.fillText(line, options.textPosition.x, y);
    y += options.lineHeight;
  });

  // Convert the canvas to a buffer
  const buffer = canvas.toBuffer("image/png");

  // Use Sharp to save the image
  console.log("Saving image to:", options.outputPath);
  await sharp(buffer).toFile(options.outputPath);
}
