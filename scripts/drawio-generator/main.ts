// main.ts

import { create } from "xmlbuilder2";
import { getUuid, getUtcTimestamp } from "./utils";
import { computeGrid, computeGridLabelCoordinates } from "./grid";
import { drawGridLabels, drawAuthorBox, drawBorder, drawGrid } from "./draw";
import { PAPER_SIZE, DIMS } from "./constants";

function buildDocument(): string {
  const GRANDPARENT_ID = getUuid();
  const PARENT_ID = getUuid();
  const dims = DIMS[PAPER_SIZE];

  // Create custom DTD string
  const dtd = `<!DOCTYPE mxfile [
    <!-- Units are 1/100ths of an inch.  -->
    <!-- ${PAPER_SIZE} -->
    <!ENTITY PAGE_WIDTH "${dims.width}">
    <!ENTITY PAGE_HEIGHT "${dims.height}">
    <!-- Border of 1/10th of an inch. -->
    <!ENTITY xBorderStart "${dims.border}">
    <!ENTITY xBorderEnd "${dims.width - dims.border}">
    <!ENTITY yBorderStart "${dims.border}">
    <!ENTITY yBorderEnd "${dims.height - dims.border}">
]>`;

  const xml = create({ version: "1.0", encoding: "UTF-8" }).ele("mxfile", {
    host: "Electron",
    modified: getUtcTimestamp(),
    agent:
      "5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) draw.io/17.2.4 Chrome/96.0.4664.174 Electron/16.1.0 Safari/537.36",
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

  root.ele("mxCell", { id: GRANDPARENT_ID });
  root.ele("mxCell", { id: PARENT_ID, parent: GRANDPARENT_ID });

  const [axisxcoords, axisycoords] = computeGridLabelCoordinates();
  drawGridLabels(root, PARENT_ID, axisxcoords, axisycoords);

  drawBorder(root, PARENT_ID);

  const grid_coords = computeGrid();
  drawGrid(root, PARENT_ID, grid_coords);

  drawAuthorBox(root, PARENT_ID);

  // Get XML string without declaration
  const xmlString = xml.end({ prettyPrint: true, headless: true });

  // Combine XML declaration, DTD, and XML content
  return `<?xml version="1.0" encoding="UTF-8"?>\n${dtd}\n${xmlString}`;
}

export function generateDrawioTemplate(): string {
  return buildDocument();
}
