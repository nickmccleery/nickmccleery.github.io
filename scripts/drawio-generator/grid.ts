// grid.ts

import { linspace } from "./utils";
import { GRID, PAPER_SIZE, AXIS_GEOM } from "./constants";
import { getDims } from "./utils";

export function computeGrid(): [number, number, number, number][] {
  const [WIDTH, HEIGHT, BORDER] = getDims();
  const x_start = BORDER;
  const x_end = WIDTH - BORDER;
  const y_start = BORDER;
  const y_end = HEIGHT - BORDER;
  const axis_border = 4 * BORDER;

  const grid = GRID[PAPER_SIZE];
  const n_rows = grid.n_rows;
  const n_cols = grid.n_cols;

  const n_lines_vert = n_cols;
  const axis_border_end_x = WIDTH - axis_border;
  const vertical_x_positions = linspace(
    axis_border,
    axis_border_end_x,
    n_lines_vert
  );

  const n_lines_horz = n_rows;
  const axis_border_end_y = HEIGHT - axis_border;
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
      coords.push([x, y_start, x, y_start + axis_border - BORDER]);
      coords.push([x, y_end, x, y_end - axis_border + BORDER]);
    }
  });

  horizontal_y_positions.forEach((y, i) => {
    if (i === 0 || i === vertical_x_positions.length - 1) {
      coords.push([x_start, y, x_end, y]);
    } else {
      coords.push([x_start, y, x_start + axis_border - BORDER, y]);
      coords.push([x_end, y, x_end - axis_border + BORDER, y]);
    }
  });

  return coords;
}

export function computeGridLabelCoordinates(): [
  [number, number][],
  [number, number][]
] {
  const [WIDTH, HEIGHT, BORDER] = getDims();
  const grid = GRID[PAPER_SIZE];
  const n_rows = grid.n_rows;
  const n_cols = grid.n_cols;

  const text_box_w = parseInt(AXIS_GEOM.width);
  const text_box_h = parseInt(AXIS_GEOM.height);

  const stage_width = WIDTH - 2 * BORDER - 6 * BORDER;
  const stage_height = HEIGHT - 2 * BORDER - 6 * BORDER;
  const x_start = BORDER;
  const x_end = WIDTH - BORDER;
  const y_start = BORDER;
  const y_end = HEIGHT - BORDER;
  const height_of_axis_label = parseInt(AXIS_GEOM.height);
  const width_of_axis_label = parseInt(AXIS_GEOM.width);
  const axis_border_start = 3 * BORDER;
  const axis_border_end = axis_border_start;

  const size_of_col_cell = stage_width / (n_cols - 1);
  const size_of_rows_cell = stage_height / (n_rows - 1);

  const pos_y_axis = size_of_col_cell / 2;
  const pos_letter_x_axis = width_of_axis_label / 2;
  const pos_x_axis = size_of_rows_cell / 2;
  const x_first = x_start + axis_border_start + pos_y_axis;
  const x_last = x_end - pos_y_axis - axis_border_end;
  const n_lines_vert = n_cols - 1;
  const x_axis_pos = linspace(x_first, x_last, n_lines_vert);
  const top_axis = 0;
  const bottom_axis = HEIGHT - text_box_h;

  const pos_num_y_axis = height_of_axis_label / 2;
  const y_first = y_start + axis_border_start + pos_x_axis;
  const y_last = y_end - pos_x_axis - axis_border_end;
  const n_lines_horz = n_rows - 1;
  const y_axis_pos = linspace(y_first, y_last, n_lines_horz);
  const left_axis = 0;
  const right_axis = WIDTH - text_box_w;

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
