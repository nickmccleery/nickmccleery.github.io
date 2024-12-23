import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateOpenGraphImage } from "./opengraph-image-generator.js";
import yaml from "js-yaml";
import globalConfig from "./opengraph-config.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contentDir = path.join(__dirname, "..", "..", "..", "content");
const outputDir = path.join(
  __dirname,
  "..",
  "..",
  "..",
  globalConfig.output_dir
);

// Ensure output directory exists.
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

interface FrontMatter {
  title: string;
  description: string;
}

function extractFrontMatter(content: string): FrontMatter {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---/;
  const match = content.match(frontMatterRegex);

  if (match) {
    const frontMatter = yaml.load(match[1]) as FrontMatter;
    return {
      title: frontMatter.title || "",
      description: frontMatter.description || "",
    };
  }

  return { title: "", description: "" };
}

async function processMarkdownFile(filePath: string) {
  const content = fs.readFileSync(filePath, "utf-8");
  const { title, description } = extractFrontMatter(content);

  if (title) {
    const fileName = path.basename(filePath, ".md");
    const outputPath = path.join(outputDir, `${fileName}.png`);

    await generateOpenGraphImage({
      templatePath: path.join(__dirname, "..", globalConfig.template_path),
      outputPath,
      title: {
        text: title,
        font: globalConfig.title_font,
        position: { x: 150, y: 230 },
        maxWidth: 900,
        lineHeight: 65,
      },
      description: {
        text: description,
        font: globalConfig.description_font,
        position: { x: 150, y: 0 },
        maxWidth: 900,
        lineHeight: 40,
      },
      domain: {
        text: globalConfig.domain,
        font: globalConfig.domain_font,
        position: { x: 150, y: 150 },
      },
      descriptionOffset: 30,
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

async function generateHomeOpenGraphImage() {
  const outputPath = path.join(outputDir, `home.png`);
  const title = "Home";
  const description =
    "Engineer who likes working at the intersection of hardware and software.";

  await generateOpenGraphImage({
    templatePath: path.join(__dirname, "..", globalConfig.template_path),
    outputPath,
    title: {
      text: title,
      font: globalConfig.title_font,
      position: { x: 150, y: 230 },
      maxWidth: 900,
      lineHeight: 65,
    },
    description: {
      text: description,
      font: globalConfig.description_font,
      position: { x: 150, y: 0 },
      maxWidth: 900,
      lineHeight: 40,
    },
    domain: {
      text: globalConfig.domain,
      font: globalConfig.domain_font,
      position: { x: 150, y: 150 },
    },
    descriptionOffset: 30,
  });

  console.log(`Generated OpenGraph image for home page.`);
}

// Run the generation over our content directory.
processDirectory(contentDir).catch(console.error);

// Run the generation for the home page.
generateHomeOpenGraphImage().catch(console.error);
