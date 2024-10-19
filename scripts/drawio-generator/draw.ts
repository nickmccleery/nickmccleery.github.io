import { getUuid } from "./utils";
import {
  AXIS_GEOM,
  DEFAULT_GEOM,
  AUTHOR_BOX,
  ALPHABET,
  TEXT_STYLE,
  TEXT_STYLE_TITLEBLOCK,
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

export function drawTitleBlock(
  root: any,
  parent_id: string,
  width: number,
  height: number,
  border: number
) {
  const widthInnerBorder = border * 4;

  const heightDetailBox = height / 10;
  const widthDetailBox = width / 4;
  const widthLogoBox = widthDetailBox / 2.5;

  const text_row_height = heightDetailBox / 3;

  const logo_box_pos_x = width - widthInnerBorder - widthDetailBox;
  const logo_box_pos_y = height - widthInnerBorder - heightDetailBox;

  const text_box_pos_x =
    width - widthInnerBorder - widthDetailBox + widthLogoBox;
  const text_box_pos_y = height - widthInnerBorder - heightDetailBox;

  const logo_box = {
    width: widthLogoBox.toString(),
    height: heightDetailBox.toString(),
    as: "geometry",
  };
  const text_box = {
    width: (widthDetailBox - widthLogoBox).toString(),
    height: text_row_height.toString(),
    as: "geometry",
  };

  const mx_cell = root.ele("mxCell", {
    id: getUuid(),
    value: "",
    style: "whiteSpace=wrap;html=1;",
    vertex: "1",
    parent: parent_id,
  });
  mx_cell.ele("mxGeometry", {
    x: logo_box_pos_x.toString(),
    y: logo_box_pos_y.toString(),
    ...logo_box,
  });

  const labels = [AUTHOR_BOX.title, AUTHOR_BOX.author, AUTHOR_BOX.date];

  for (let i = 0; i < 3; i++) {
    const mx_cell = root.ele("mxCell", {
      id: getUuid(),
      value: labels[i],
      style: TEXT_STYLE_TITLEBLOCK,
      vertex: "1",
      parent: parent_id,
    });
    mx_cell.ele("mxGeometry", {
      x: text_box_pos_x.toString(),
      y: (text_box_pos_y + i * text_row_height).toString(),
      ...text_box,
    });
  }
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
