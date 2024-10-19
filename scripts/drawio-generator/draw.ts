import { getUuid } from "./utils";
import {
  AXIS_GEOM,
  DEFAULT_GEOM,
  ALPHABET,
  TEXT_STYLE,
  TEXT_STYLE_TITLEBLOCK,
  BORDER_WIDTH,
  FRAME_WIDTH,
} from "./constants";

export function drawGridLabels(
  root: any,
  parent_id: string,
  row_coords: [number, number][],
  col_coords: [number, number][]
) {
  let rowAxisNumber = 0;
  let colAxisLetterIndex = 0;

  let iLetter = 1;
  let iNumber = 1;

  row_coords.forEach(([x, y]) => {
    const mx_cell = root.ele("mxCell", {
      id: getUuid(),
      value: (rowAxisNumber + 1).toString(),
      style: TEXT_STYLE,
      vertex: "1",
      parent: parent_id,
    });

    mx_cell.ele("mxGeometry", {
      x: x.toString(),
      y: y.toString(),
      ...AXIS_GEOM,
    });

    if (iNumber % 2 === 0) {
      rowAxisNumber += 1;
    }
    iNumber += 1;
  });

  col_coords.forEach(([x, y]) => {
    const mx_cell = root.ele("mxCell", {
      id: getUuid(),
      value: ALPHABET[colAxisLetterIndex],
      style: TEXT_STYLE,
      vertex: "1",
      parent: parent_id,
    });

    mx_cell.ele("mxGeometry", {
      x: x.toString(),
      y: y.toString(),
      ...AXIS_GEOM,
    });

    if (iLetter % 2 === 0) {
      colAxisLetterIndex += 1;
    }
    iLetter += 1;
  });
}

export function drawLine(
  root: any,
  parent_id: string,
  x1: number | string,
  y1: number | string,
  x2: number | string,
  y2: number | string,
  width: number | string = 1
) {
  const TARGET = {
    as: "targetPoint",
  };
  const SOURCE = {
    as: "sourcePoint",
  };

  const style = `endArrow=none;dashed=0;html=1;rounded=0;strokeWidth=${width};`;

  const cell = root.ele("mxCell", {
    id: getUuid(),
    value: "",
    style: style,
    edge: "1",
    parent: parent_id,
  });

  const geometry = cell.ele("mxGeometry", DEFAULT_GEOM);

  geometry.ele("mxPoint", {
    x: x1.toString(),
    y: y1.toString(),
    ...SOURCE,
  });

  geometry.ele("mxPoint", {
    x: x2.toString(),
    y: y2.toString(),
    ...TARGET,
  });
}

export function drawBorder(root: any, parent_id: string) {
  const a: [string, string] = ["&xBorderStart;", "&yBorderStart;"];
  const b: [string, string] = ["&xBorderEnd;", "&yBorderStart;"];
  const c: [string, string] = ["&xBorderStart;", "&yBorderEnd;"];
  const d: [string, string] = ["&xBorderEnd;", "&yBorderEnd;"];

  const pairs = [
    [a, b],
    [b, d],
    [d, c],
    [c, a],
  ];

  pairs.forEach(([vec1, vec2]) => {
    drawLine(root, parent_id, vec1[0], vec1[1], vec2[0], vec2[1]);
  });
}

export function drawGrid(
  root: any,
  parent_id: string,
  coords: [number, number, number, number][]
) {
  coords.forEach(([x1, y1, x2, y2]) => {
    drawLine(root, parent_id, x1, y1, x2, y2, 1);
  });
}

export function drawCenterLines(
  root: any,
  parent_id: string,
  coords: [number, number, number, number][]
) {
  coords.forEach(([x1, y1, x2, y2]) => {
    drawLine(root, parent_id, x1, y1, x2, y2, 2);
  });
}

function drawRectangle(
  root: any,
  parentID: string,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const cell = root.ele("mxCell", {
    id: getUuid(),
    value: "",
    style: "rounded=0;whiteSpace=wrap;html=1;",
    vertex: "1",
    parent: parentID,
  });

  cell.ele("mxGeometry", {
    x: x.toString(),
    y: y.toString(),
    width: width.toString(),
    height: height.toString(),
    as: "geometry",
  });
}

function addText(
  root: any,
  parentID: string,
  x: number,
  y: number,
  width: number,
  height: number,
  value: string,
  fontSize: number,
  isBold: boolean,
  verticalAlign: "top" | "middle" | "bottom" = "middle",
  horizontalAlign: "left" | "center" | "right" = "left"
) {
  const cellStyle = `${TEXT_STYLE_TITLEBLOCK};align=${horizontalAlign};verticalAlign=${verticalAlign};fontSize=${fontSize};${
    isBold ? "fontStyle=1;" : ""
  }`;

  const cell = root.ele("mxCell", {
    id: getUuid(),
    value: value,
    style: cellStyle,
    vertex: "1",
    parent: parentID,
  });

  cell.ele("mxGeometry", {
    x: x.toString(),
    y: y.toString(),
    width: width.toString(),
    height: height.toString(),
    as: "geometry",
  });
}

export function drawTitleBlock(
  root: any,
  parentID: string,
  sheetWidth: number,
  sheetHeight: number,
  params: {
    companyName: string;
    drawingTitle: string;
    authorName: string;
    dateDrawn: string;
    reviewedBy: string;
    reviewDate: string;
    pageSize: string;
    sheetNumber: string;
    revision: string;
  }
) {
  const BLOCK_WIDTH = 650;
  const BLOCK_HEIGHT = 150;
  const margin = 5;

  // Calculate the position of the title block.
  const blockX = sheetWidth - BORDER_WIDTH - FRAME_WIDTH - BLOCK_WIDTH;
  const blockY = sheetHeight - BORDER_WIDTH - FRAME_WIDTH - BLOCK_HEIGHT;

  // Draw the main outline of the title block.
  drawRectangle(root, parentID, blockX, blockY, BLOCK_WIDTH, BLOCK_HEIGHT);

  // Define the layout
  const companyNameWidth = BLOCK_WIDTH * 0.3;
  const drawingTitleHeight = BLOCK_HEIGHT / 2;
  const infoRowHeight = BLOCK_HEIGHT / 4;
  const labelWidth = 60;

  // Draw internal lines.
  drawLine(
    root,
    parentID,
    blockX + companyNameWidth,
    blockY,
    blockX + companyNameWidth,
    blockY + BLOCK_HEIGHT
  );
  drawLine(
    root,
    parentID,
    blockX + companyNameWidth,
    blockY + drawingTitleHeight,
    blockX + BLOCK_WIDTH,
    blockY + drawingTitleHeight
  );
  drawLine(
    root,
    parentID,
    blockX + companyNameWidth,
    blockY + drawingTitleHeight + infoRowHeight,
    blockX + BLOCK_WIDTH,
    blockY + drawingTitleHeight + infoRowHeight
  );

  const infoColumnWidth = (BLOCK_WIDTH - companyNameWidth) / 3;
  drawLine(
    root,
    parentID,
    blockX + companyNameWidth + infoColumnWidth,
    blockY + drawingTitleHeight,
    blockX + companyNameWidth + infoColumnWidth,
    blockY + BLOCK_HEIGHT
  );
  drawLine(
    root,
    parentID,
    blockX + companyNameWidth + 2 * infoColumnWidth,
    blockY + drawingTitleHeight,
    blockX + companyNameWidth + 2 * infoColumnWidth,
    blockY + BLOCK_HEIGHT
  );

  // Add text with intermediate position variables.
  let textX, textY, textWidth, textHeight;

  // Company name.
  textX = blockX + margin;
  textY = blockY + margin;
  textWidth = companyNameWidth - 2 * margin;
  textHeight = BLOCK_HEIGHT - 2 * margin;
  addText(
    root,
    parentID,
    textX,
    textY,
    textWidth,
    textHeight,
    params.companyName,
    14,
    true,
    "middle",
    "center"
  );

  // Drawing title.
  textX = blockX + companyNameWidth + margin;
  textY = blockY + margin;
  textWidth = BLOCK_WIDTH - companyNameWidth - 2 * margin;
  textHeight = drawingTitleHeight - 2 * margin;
  addText(
    root,
    parentID,
    textX,
    textY,
    textWidth,
    textHeight,
    params.drawingTitle,
    16,
    true,
    "middle",
    "center"
  );

  // Author and date.
  drawLine(
    root,
    parentID,
    blockX + companyNameWidth + labelWidth,
    blockY + drawingTitleHeight,
    blockX + companyNameWidth + labelWidth,
    blockY + drawingTitleHeight + infoRowHeight * 2
  );

  textX = blockX + companyNameWidth + margin;
  textY = blockY + drawingTitleHeight;
  textWidth = labelWidth - 2 * margin;
  textHeight = infoRowHeight;
  addText(
    root,
    parentID,
    textX,
    textY,
    textWidth,
    textHeight,
    "DRAWN",
    8,
    true,
    "middle"
  );

  textX = blockX + companyNameWidth + labelWidth + margin;
  addText(
    root,
    parentID,
    textX,
    textY,
    infoColumnWidth - labelWidth - 2 * margin,
    textHeight,
    params.authorName,
    8,
    false,
    "middle"
  );

  textY = blockY + drawingTitleHeight + infoRowHeight;
  textX = blockX + companyNameWidth + margin;
  addText(
    root,
    parentID,
    textX,
    textY,
    labelWidth - 2 * margin,
    textHeight,
    "DRAWN DATE",
    8,
    true,
    "middle"
  );

  textX = blockX + companyNameWidth + labelWidth + margin;
  addText(
    root,
    parentID,
    textX,
    textY,
    infoColumnWidth - labelWidth - 2 * margin,
    textHeight,
    params.dateDrawn,
    8,
    false,
    "middle"
  );

  // Reviewed by and review date.
  drawLine(
    root,
    parentID,
    blockX + companyNameWidth + infoColumnWidth + labelWidth,
    blockY + drawingTitleHeight,
    blockX + companyNameWidth + infoColumnWidth + labelWidth,
    blockY + drawingTitleHeight + infoRowHeight * 2
  );

  textX = blockX + companyNameWidth + infoColumnWidth + margin;
  textY = blockY + drawingTitleHeight;
  addText(
    root,
    parentID,
    textX,
    textY,
    labelWidth - 2 * margin,
    textHeight,
    "REVIEWED",
    8,
    true,
    "middle"
  );

  textX = blockX + companyNameWidth + infoColumnWidth + labelWidth + margin;
  addText(
    root,
    parentID,
    textX,
    textY,
    infoColumnWidth - labelWidth - 2 * margin,
    textHeight,
    params.reviewedBy,
    8,
    false,
    "middle"
  );

  textY = blockY + drawingTitleHeight + infoRowHeight;
  textX = blockX + companyNameWidth + infoColumnWidth + margin;
  addText(
    root,
    parentID,
    textX,
    textY,
    labelWidth - 2 * margin,
    textHeight,
    "REVIEWED DATE",
    8,
    true,
    "middle"
  );

  textX = blockX + companyNameWidth + infoColumnWidth + labelWidth + margin;
  addText(
    root,
    parentID,
    textX,
    textY,
    infoColumnWidth - labelWidth - 2 * margin,
    textHeight,
    params.reviewDate,
    8,
    false,
    "middle"
  );

  // Page size, sheet number, revision.
  drawLine(
    root,
    parentID,
    blockX + companyNameWidth + 2 * infoColumnWidth + labelWidth,
    blockY + drawingTitleHeight,
    blockX + companyNameWidth + 2 * infoColumnWidth + labelWidth,
    blockY + drawingTitleHeight + infoRowHeight * 2
  );

  textX = blockX + companyNameWidth + 2 * infoColumnWidth + margin;
  textY = blockY + drawingTitleHeight;
  addText(
    root,
    parentID,
    textX,
    textY,
    labelWidth - 2 * margin,
    textHeight,
    "SIZE",
    8,
    true,
    "middle"
  );

  textX = blockX + companyNameWidth + 2 * infoColumnWidth + labelWidth + margin;
  addText(
    root,
    parentID,
    textX,
    textY,
    infoColumnWidth - labelWidth - 2 * margin,
    textHeight,
    params.pageSize,
    8,
    false,
    "middle"
  );

  textY = blockY + drawingTitleHeight + infoRowHeight;
  textX = blockX + companyNameWidth + 2 * infoColumnWidth + margin;
  addText(
    root,
    parentID,
    textX,
    textY,
    labelWidth - 2 * margin,
    textHeight,
    "SHEET:",
    8,
    true,
    "middle"
  );

  textX = blockX + companyNameWidth + 2 * infoColumnWidth + labelWidth + margin;
  addText(
    root,
    parentID,
    textX,
    textY,
    infoColumnWidth - labelWidth - 2 * margin,
    textHeight,
    params.sheetNumber,
    8,
    false,
    "middle"
  );
}
