import { generateDrawioTemplate } from "./index";
import { PAPER_SIZES } from "./constants";
import * as fs from "fs";

function testDrawioTemplateGenerator() {
  console.log("Generating DrawIO template...");
  const paperSize = PAPER_SIZES.A3;
  const xmlString = generateDrawioTemplate(paperSize);

  console.log("Writing template to file...");
  fs.writeFileSync("output.drawio", xmlString, "utf8");

  console.log("Template generated successfully. Check output.drawio");
}

testDrawioTemplateGenerator();
