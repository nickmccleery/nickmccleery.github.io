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

enum VerticalAlign {
  Top = "top",
  Middle = "middle",
  Bottom = "bottom",
}

enum HorizontalAlign {
  Left = "left",
  Center = "center",
  Right = "right",
}

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
  verticalAlign: VerticalAlign = VerticalAlign.Middle,
  horizontalAlign: HorizontalAlign = HorizontalAlign.Left,
  spacingTop: number = 0,
  spacingLeft: number = 0
) {
  let cellStyle = `${TEXT_STYLE_TITLEBLOCK};align=${horizontalAlign};verticalAlign=${verticalAlign};fontSize=${fontSize};${
    isBold ? "fontStyle=1;" : ""
  }`;

  if (spacingTop !== 0) {
    cellStyle += `spacingTop=${spacingTop};`;
  }

  if (spacingLeft !== 0) {
    cellStyle += `spacingLeft=${spacingLeft};`;
  }

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
  // Constants for labels.
  const LABELS = {
    DRAWN_BY: "DRAWN BY:",
    DRAWN_DATE: "DRAWN DATE:",
    REVIEWED_BY: "REVIEWED BY:",
    REVIEWED_DATE: "REVIEWED DATE:",
    SIZE: "SIZE:",
    SHEET: "SHEET:",
  };

  // Dimensions and layout.
  const BLOCK_WIDTH = 650;
  const BLOCK_HEIGHT = 150;
  const MARGIN = 5;

  const COMPANY_NAME_WIDTH = BLOCK_WIDTH * 0.3;
  const DRAWING_TITLE_HEIGHT = BLOCK_HEIGHT / 2;
  const INFO_ROW_HEIGHT = BLOCK_HEIGHT / 4;

  // Font sizes.
  const SIZE_TITLE = 16;
  const SIZE_LABEL = 6;
  const SIZE_FIELD = 10;

  // Additional constants.
  const LABEL_OFFSET = -3;

  // Calculate the position of the title block.
  const blockX = sheetWidth - BORDER_WIDTH - FRAME_WIDTH - BLOCK_WIDTH;
  const blockY = sheetHeight - BORDER_WIDTH - FRAME_WIDTH - BLOCK_HEIGHT;

  // Draw the main outline of the title block.
  drawRectangle(root, parentID, blockX, blockY, BLOCK_WIDTH, BLOCK_HEIGHT);

  // Draw internal lines.
  drawLine(
    root,
    parentID,
    blockX + COMPANY_NAME_WIDTH,
    blockY,
    blockX + COMPANY_NAME_WIDTH,
    blockY + BLOCK_HEIGHT
  );
  drawLine(
    root,
    parentID,
    blockX + COMPANY_NAME_WIDTH,
    blockY + DRAWING_TITLE_HEIGHT,
    blockX + BLOCK_WIDTH,
    blockY + DRAWING_TITLE_HEIGHT
  );
  drawLine(
    root,
    parentID,
    blockX + COMPANY_NAME_WIDTH,
    blockY + DRAWING_TITLE_HEIGHT + INFO_ROW_HEIGHT,
    blockX + BLOCK_WIDTH,
    blockY + DRAWING_TITLE_HEIGHT + INFO_ROW_HEIGHT
  );

  const infoColumnWidth = (BLOCK_WIDTH - COMPANY_NAME_WIDTH) / 3;
  drawLine(
    root,
    parentID,
    blockX + COMPANY_NAME_WIDTH + infoColumnWidth,
    blockY + DRAWING_TITLE_HEIGHT,
    blockX + COMPANY_NAME_WIDTH + infoColumnWidth,
    blockY + BLOCK_HEIGHT
  );
  drawLine(
    root,
    parentID,
    blockX + COMPANY_NAME_WIDTH + 2 * infoColumnWidth,
    blockY + DRAWING_TITLE_HEIGHT,
    blockX + COMPANY_NAME_WIDTH + 2 * infoColumnWidth,
    blockY + BLOCK_HEIGHT
  );

  // Add text with intermediate position variables.
  let textX, textY, textWidth, textHeight;

  // Company name.
  textX = blockX + MARGIN;
  textY = blockY + MARGIN;
  textWidth = COMPANY_NAME_WIDTH - 2 * MARGIN;
  textHeight = BLOCK_HEIGHT - 2 * MARGIN;
  addText(
    root,
    parentID,
    textX,
    textY,
    textWidth,
    textHeight,
    params.companyName,
    SIZE_TITLE,
    true,
    VerticalAlign.Middle,
    HorizontalAlign.Center
  );

  // Drawing title.
  textX = blockX + COMPANY_NAME_WIDTH + MARGIN;
  textY = blockY + MARGIN;
  textWidth = BLOCK_WIDTH - COMPANY_NAME_WIDTH - 2 * MARGIN;
  textHeight = DRAWING_TITLE_HEIGHT - 2 * MARGIN;
  addText(
    root,
    parentID,
    textX,
    textY,
    textWidth,
    textHeight,
    params.drawingTitle,
    SIZE_TITLE,
    true,
    VerticalAlign.Middle,
    HorizontalAlign.Center
  );

  // Author and date.
  textX = blockX + COMPANY_NAME_WIDTH + MARGIN;
  textY = blockY + DRAWING_TITLE_HEIGHT;
  textWidth = infoColumnWidth - 2 * MARGIN;
  textHeight = INFO_ROW_HEIGHT;
  addText(
    root,
    parentID,
    textX,
    textY,
    textWidth,
    textHeight,
    LABELS.DRAWN_BY,
    SIZE_LABEL,
    true,
    VerticalAlign.Top,
    HorizontalAlign.Left,
    LABEL_OFFSET
  );

  addText(
    root,
    parentID,
    textX,
    textY,
    textWidth,
    textHeight,
    params.authorName,
    SIZE_FIELD,
    false,
    VerticalAlign.Middle,
    HorizontalAlign.Left
  );

  textY = blockY + DRAWING_TITLE_HEIGHT + INFO_ROW_HEIGHT;
  addText(
    root,
    parentID,
    textX,
    textY,
    textWidth,
    textHeight,
    LABELS.DRAWN_DATE,
    SIZE_LABEL,
    true,
    VerticalAlign.Top,
    HorizontalAlign.Left,
    LABEL_OFFSET
  );
  addText(
    root,
    parentID,
    textX,
    textY,
    textWidth,
    textHeight,
    params.dateDrawn,
    SIZE_FIELD,
    false,
    VerticalAlign.Middle,
    HorizontalAlign.Left
  );

  // Reviewed by and review date.
  textX = blockX + COMPANY_NAME_WIDTH + infoColumnWidth + MARGIN;
  textY = blockY + DRAWING_TITLE_HEIGHT;
  addText(
    root,
    parentID,
    textX,
    textY,
    textWidth,
    textHeight,
    LABELS.REVIEWED_BY,
    SIZE_LABEL,
    true,
    VerticalAlign.Top,
    HorizontalAlign.Left,
    LABEL_OFFSET
  );
  addText(
    root,
    parentID,
    textX,
    textY,
    textWidth,
    textHeight,
    params.reviewedBy,
    SIZE_FIELD,
    false,
    VerticalAlign.Middle,
    HorizontalAlign.Left
  );

  textY = blockY + DRAWING_TITLE_HEIGHT + INFO_ROW_HEIGHT;
  addText(
    root,
    parentID,
    textX,
    textY,
    textWidth,
    textHeight,
    LABELS.REVIEWED_DATE,
    SIZE_LABEL,
    true,
    VerticalAlign.Top,
    HorizontalAlign.Left,
    LABEL_OFFSET
  );
  addText(
    root,
    parentID,
    textX,
    textY,
    textWidth,
    textHeight,
    params.reviewDate,
    SIZE_FIELD,
    false,
    VerticalAlign.Middle,
    HorizontalAlign.Left
  );

  // Page size, sheet number.
  textX = blockX + COMPANY_NAME_WIDTH + 2 * infoColumnWidth + MARGIN;
  textY = blockY + DRAWING_TITLE_HEIGHT;
  addText(
    root,
    parentID,
    textX,
    textY,
    textWidth,
    textHeight,
    LABELS.SIZE,
    SIZE_LABEL,
    true,
    VerticalAlign.Top,
    HorizontalAlign.Left,
    LABEL_OFFSET
  );
  addText(
    root,
    parentID,
    textX,
    textY,
    textWidth,
    textHeight,
    params.pageSize,
    SIZE_FIELD,
    false,
    VerticalAlign.Middle,
    HorizontalAlign.Left
  );

  textY = blockY + DRAWING_TITLE_HEIGHT + INFO_ROW_HEIGHT;
  addText(
    root,
    parentID,
    textX,
    textY,
    textWidth,
    textHeight,
    LABELS.SHEET,
    SIZE_LABEL,
    true,
    VerticalAlign.Top,
    HorizontalAlign.Left,
    LABEL_OFFSET
  );
  addText(
    root,
    parentID,
    textX,
    textY,
    textWidth,
    textHeight,
    params.sheetNumber,
    SIZE_FIELD,
    false,
    VerticalAlign.Middle,
    HorizontalAlign.Left
  );
}
