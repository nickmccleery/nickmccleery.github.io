import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateOpenGraphImage } from "./opengraph-image-generator.js";

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contentDir = path.join(__dirname, "..", "..", "..", "content");
console.log(contentDir);
const outputDir = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "static",
  "images",
  "og"
);

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function extractTitle(content: string): string | null {
  const titleRegex = /title:\s*(?:["'](.+?)["']|(.+))(?:\n|$)/;
  const match = content.match(titleRegex);

  if (match) {
    return match[1] || match[2];
  }

  return null;
}

async function processMarkdownFile(filePath: string) {
  const content = fs.readFileSync(filePath, "utf-8");
  let title = extractTitle(content);

  if (title) {
    const fileName = path.basename(filePath, ".md");
    const outputPath = path.join(outputDir, `${fileName}.png`);

    await generateOpenGraphImage({
      templatePath: path.join(__dirname, "..", "templates", "template.png"),
      outputPath,
      fontPath: path.join(__dirname, "..", "fonts", "SpaceMono-Regular.ttf"),
      fontSize: 150,
      text: title,
      textColor: "#000000",
      textPosition: { x: 390, y: 630 },
      lineHeight: 170,
      maxWidth: 2500,
    });

    console.log(`Generated OpenGraph image for: ${fileName}`);
  }
}

async function processDirectory(dirPath: string) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      console.log(`Processing file: ${fullPath}`);
      await processMarkdownFile(fullPath);
    }
  }
}

processDirectory(contentDir).catch(console.error);
