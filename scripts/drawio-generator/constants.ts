// constants.ts

export const PAPER_SIZE = "A3";

export const DIMS = {
  A3: {
    width: 1654,
    height: 1169,
    border: 10,
  },
  A4: {
    width: 1169,
    height: 827,
    border: 10,
  },
};

export const AUTHOR_BOX = {
  title: "DOCUMENT TITLE",
  author: "AUTHOR NAME",
  date: "YYYY-MM-DD",
};

export const GRID = {
  A3: {
    n_rows: 10,
    n_cols: 10,
  },
  A4: {
    n_rows: 5,
    n_cols: 5,
  },
};

export const DEFAULT_GEOM = {
  width: "50",
  height: "50",
  relative: "1",
  as: "geometry",
};

export const AXIS_GEOM = {
  width: "50",
  height: "50",
  as: "geometry",
};
