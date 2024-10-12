// draw.ts

import { getUuid } from "./utils";
import { AXIS_GEOM, DEFAULT_GEOM, AUTHOR_BOX } from "./constants";
import { getDims } from "./utils";

export function drawGridLabels(
  root: any,
  parent_id: string,
  row_coords: [number, number][],
  col_coords: [number, number][]
) {
  let row_axis_number = 0;
  let col_axis_letter = "A";
  let letter_iteration = 1;
  let number_iteration = 1;

  row_coords.forEach(([x, y]) => {
    const mx_cell = root.ele("mxCell", {
      id: getUuid(),
      value: row_axis_number.toString(),
      style: "text;html=1;align=center;verticalAlign=middle;fontSize=12",
      vertex: "1",
      parent: parent_id,
    });

    mx_cell.ele("mxGeometry", {
      x: x.toString(),
      y: y.toString(),
      ...AXIS_GEOM,
    });

    if (number_iteration % 2 === 0) {
      row_axis_number += 1;
    }
    number_iteration += 1;
  });

  col_coords.forEach(([x, y]) => {
    const mx_cell = root.ele("mxCell", {
      id: getUuid(),
      value: col_axis_letter,
      style: "text;html=1;align=center;verticalAlign=middle;fontSize=12",
      vertex: "1",
      parent: parent_id,
    });

    mx_cell.ele("mxGeometry", {
      x: x.toString(),
      y: y.toString(),
      ...AXIS_GEOM,
    });

    if (letter_iteration % 2 === 0) {
      col_axis_letter = String.fromCharCode(col_axis_letter.charCodeAt(0) + 1);
    }
    letter_iteration += 1;
  });
}

export function drawAuthorBox(root: any, parent_id: string) {
  const [WIDTH, HEIGHT, BORDER] = getDims();
  const inner_border = BORDER * 4;

  const detail_box_height = HEIGHT / 10;
  const detail_box_width = WIDTH / 4;
  const logo_box_width = detail_box_width / 2.5;

  const text_row_height = detail_box_height / 3;

  const logo_box_pos_x = WIDTH - inner_border - detail_box_width;
  const logo_box_pos_y = HEIGHT - inner_border - detail_box_height;

  const text_box_pos_x =
    WIDTH - inner_border - detail_box_width + logo_box_width;
  const text_box_pos_y = HEIGHT - inner_border - detail_box_height;

  const logo_box = {
    width: logo_box_width.toString(),
    height: detail_box_height.toString(),
    as: "geometry",
  };
  const text_box = {
    width: (detail_box_width - logo_box_width).toString(),
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
      style:
        "text;whiteSpace=wrap;html=1;align=center;verticalAlign=middle;fontSize=14;strokeColor=default;fillColor=default;fontFamily=Lucida Console;",
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
  grid: boolean = false
) {
  const TARGET = {
    as: "targetPoint",
  };
  const SOURCE = {
    as: "sourcePoint",
  };

  const style = grid
    ? "endArrow=none;dashed=0;html=1;rounded=0;"
    : "endArrow=none;dashed=0;html=1;rounded=0;";

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
    drawLine(root, parent_id, x1, y1, x2, y2, true);
  });
}
