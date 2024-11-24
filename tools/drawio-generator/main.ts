// main.ts

import { create } from "xmlbuilder2";
import { getUuid, getUtcTimestamp, getTodayDate } from "./utils";
import {
  computeGrid,
  computeGridLabelCoordinates,
  computeCenterLines,
} from "./grid";
import {
  drawGridLabels,
  drawTitleBlock,
  drawBorder,
  drawGrid,
  drawCenterLines,
} from "./draw";
import {
  SHEET_CONFIGS,
  PAPER_SIZES,
  BORDER_WIDTH,
  FRAME_WIDTH,
} from "./constants";

const AGENT =
  "5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) draw.io/17.2.4 Chrome/96.0.4664.174 Electron/16.1.0 Safari/537.36";

const DEFAULT_LABELS = {
  companyName: "ACME INC.",
  drawingTitle: "WIDGET GENERAL ARRANGEMENT",
  authorName: "JOHN DOE",
  reviewedBy: "JANE SMITH",
};

export function generateDrawioTemplate(
  paperSize: PAPER_SIZES = PAPER_SIZES.A3,
  companyName: string = DEFAULT_LABELS.companyName,
  drawingTitle: string = DEFAULT_LABELS.drawingTitle,
  authorName: string = DEFAULT_LABELS.authorName,
  reviewedBy: string = DEFAULT_LABELS.reviewedBy
): string {
  const sheetConfig = SHEET_CONFIGS[paperSize];
  const grandparentID = getUuid();
  const parentID = getUuid();

  // Check for empty strings and assign default values if necessary.
  companyName = (companyName || DEFAULT_LABELS.companyName).toUpperCase();
  drawingTitle = (drawingTitle || DEFAULT_LABELS.drawingTitle).toUpperCase();
  authorName = (authorName || DEFAULT_LABELS.authorName).toUpperCase();
  reviewedBy = (reviewedBy || DEFAULT_LABELS.reviewedBy).toUpperCase();

  // Create DTD string with paper size.
  const dtd = `<!DOCTYPE mxfile [
    <!-- Units are 1/100ths of an inch.  -->
    <!-- ${paperSize} -->
    <!ENTITY PAGE_WIDTH "${sheetConfig.width}">
    <!ENTITY PAGE_HEIGHT "${sheetConfig.height}">
    <!-- Border declared in 100ths of an inch. -->
    <!ENTITY xBorderStart "${BORDER_WIDTH}">
    <!ENTITY xBorderEnd "${sheetConfig.width - BORDER_WIDTH}">
    <!ENTITY yBorderStart "${BORDER_WIDTH}">
    <!ENTITY yBorderEnd "${sheetConfig.height - BORDER_WIDTH}">
]>`;

  const xml = create({ version: "1.0", encoding: "UTF-8" }).ele("mxfile", {
    host: "Electron",
    modified: getUtcTimestamp(),
    agent: AGENT,
    etag: "97qwMRf_CjlpHfch55Ug",
    version: "17.2.4",
    type: "device",
  });

  const diagram = xml.ele("diagram", {
    name: "Template",
    id: getUuid(),
  });

  const mx_graph_model = diagram.ele("mxGraphModel", {
    dx: "2874",
    dy: "1769",
    grid: "0",
    gridSize: "10",
    guides: "1",
    tooltips: "1",
    connect: "1",
    arrows: "1",
    fold: "1",
    page: "1",
    pageScale: "1",
    pageWidth: "&PAGE_WIDTH;",
    pageHeight: "&PAGE_HEIGHT;",
    math: "0",
    shadow: "0",
  });

  const root = mx_graph_model.ele("root");

  root.ele("mxCell", { id: grandparentID });
  root.ele("mxCell", { id: parentID, parent: grandparentID });

  const gridCoords = computeGrid(
    sheetConfig.width,
    sheetConfig.height,
    sheetConfig.grid.rows,
    sheetConfig.grid.cols,
    BORDER_WIDTH,
    FRAME_WIDTH
  );

  const centerLineCoords = computeCenterLines(
    sheetConfig.width,
    sheetConfig.height,
    BORDER_WIDTH,
    FRAME_WIDTH
  );

  const [axisXCoords, axisYCoords] = computeGridLabelCoordinates(
    sheetConfig.width,
    sheetConfig.height,
    sheetConfig.grid.rows,
    sheetConfig.grid.cols,
    BORDER_WIDTH,
    FRAME_WIDTH
  );

  drawBorder(root, parentID); // Uses parameters inside the .drawio file.
  drawGrid(root, parentID, gridCoords);
  drawCenterLines(root, parentID, centerLineCoords);
  drawGridLabels(root, parentID, axisXCoords, axisYCoords);

  drawTitleBlock(root, parentID, sheetConfig.width, sheetConfig.height, {
    companyName: companyName,
    drawingTitle: drawingTitle,
    authorName: authorName,
    dateDrawn: getTodayDate(),
    reviewedBy: reviewedBy,
    reviewDate: "YYYY-MM-DD",
    pageSize: paperSize,
    sheetNumber: "1 of 1",
    revision: "A",
  });

  // Get XML string without declaration.
  const xmlString = xml.end({ prettyPrint: true, headless: true });

  // Combine XML declaration, DTD, and XML content.
  return `<?xml version="1.0" encoding="UTF-8"?>\n${dtd}\n${xmlString}`;
}
