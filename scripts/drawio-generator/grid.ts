// grid.ts

import { linspace } from "./utils";
import { AXIS_GEOM } from "./constants";

export function computeGrid(
  width: number,
  height: number,
  border: number,
  nRows: number,
  nCols: number
): [number, number, number, number][] {
  const x_start = border;
  const x_end = width - border;
  const y_start = border;
  const y_end = height - border;
  const axis_border = 4 * border;

  const n_lines_vert = nCols;
  const axis_border_end_x = width - axis_border;
  const vertical_x_positions = linspace(
    axis_border,
    axis_border_end_x,
    n_lines_vert
  );

  const n_lines_horz = nRows;
  const axis_border_end_y = height - axis_border;
  const horizontal_y_positions = linspace(
    axis_border,
    axis_border_end_y,
    n_lines_horz
  );

  const coords: [number, number, number, number][] = [];

  vertical_x_positions.forEach((x, i) => {
    if (i === 0 || i === vertical_x_positions.length - 1) {
      coords.push([x, y_start, x, y_end]);
    } else {
      coords.push([x, y_start, x, y_start + axis_border - border]);
      coords.push([x, y_end, x, y_end - axis_border + border]);
    }
  });

  horizontal_y_positions.forEach((y, i) => {
    if (i === 0 || i === horizontal_y_positions.length - 1) {
      coords.push([x_start, y, x_end, y]);
    } else {
      coords.push([x_start, y, x_start + axis_border - border, y]);
      coords.push([x_end, y, x_end - axis_border + border, y]);
    }
  });

  return coords;
}

export function computeGridLabelCoordinates(
  width: number,
  height: number,
  border: number,
  nRows: number,
  nCols: number
): [[number, number][], [number, number][]] {
  const text_box_w = parseInt(AXIS_GEOM.width);
  const text_box_h = parseInt(AXIS_GEOM.height);

  const stage_width = width - 2 * border - 6 * border;
  const stage_height = height - 2 * border - 6 * border;
  const x_start = border;
  const x_end = width - border;
  const y_start = border;
  const y_end = height - border;
  const height_of_axis_label = parseInt(AXIS_GEOM.height);
  const width_of_axis_label = parseInt(AXIS_GEOM.width);
  const axis_border_start = 3 * border;
  const axis_border_end = axis_border_start;

  const size_of_col_cell = stage_width / (nCols - 1);
  const size_of_rows_cell = stage_height / (nRows - 1);

  const pos_y_axis = size_of_col_cell / 2;
  const pos_letter_x_axis = width_of_axis_label / 2;
  const pos_x_axis = size_of_rows_cell / 2;
  const x_first = x_start + axis_border_start + pos_y_axis;
  const x_last = x_end - pos_y_axis - axis_border_end;
  const n_lines_vert = nCols - 1;
  const x_axis_pos = linspace(x_first, x_last, n_lines_vert);
  const top_axis = 0;
  const bottom_axis = height - text_box_h;

  const pos_num_y_axis = height_of_axis_label / 2;
  const y_first = y_start + axis_border_start + pos_x_axis;
  const y_last = y_end - pos_x_axis - axis_border_end;
  const n_lines_horz = nRows - 1;
  const y_axis_pos = linspace(y_first, y_last, n_lines_horz);
  const left_axis = 0;
  const right_axis = width - text_box_w;

  const axis_x_coords: [number, number][] = [];
  const axis_y_coords: [number, number][] = [];

  x_axis_pos.forEach((x) => {
    axis_x_coords.push([x - pos_letter_x_axis, top_axis]);
    axis_x_coords.push([x - pos_letter_x_axis, bottom_axis]);
  });

  y_axis_pos.forEach((y) => {
    axis_y_coords.push([left_axis, y - pos_num_y_axis]);
    axis_y_coords.push([right_axis, y - pos_num_y_axis]);
  });

  return [axis_x_coords, axis_y_coords];
}
