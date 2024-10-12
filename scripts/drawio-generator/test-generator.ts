import { generateDrawioTemplate } from "./index";
import * as fs from "fs";

function testDrawioTemplateGenerator() {
  console.log("Generating DrawIO template...");
  const xmlString = generateDrawioTemplate();

  console.log("Writing template to file...");
  fs.writeFileSync("output.drawio", xmlString, "utf8");

  console.log("Template generated successfully. Check output.drawio");
}

testDrawioTemplateGenerator();
