export const PAPER_SIZE = "A3";
export const BORDER_WIDTH = 20; // 10/100ths of an inch.
export const FRAME_WIDTH = 4 * BORDER_WIDTH; // Reference frame thickness.
export const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ";

export enum PAPER_SIZES {
  A1 = "A1",
  A2 = "A2",
  A3 = "A3",
  A4 = "A4",
}

// Dimensions have units of 1/100th of an inch.
const MM_TO_HUNDREDTHS_OF_INCH = (1 / 25.4) * 100;

type GridConfig = {
  rows: number;
  cols: number;
};

// https://cadsetterout.com/drawing-standards/grid-reference-frame/
export const SHEET_CONFIGS: Record<
  PAPER_SIZES,
  { width: number; height: number; grid: GridConfig }
> = {
  [PAPER_SIZES.A1]: {
    width: 841 * MM_TO_HUNDREDTHS_OF_INCH,
    height: 594 * MM_TO_HUNDREDTHS_OF_INCH,
    grid: { rows: 12, cols: 16 },
  },
  [PAPER_SIZES.A2]: {
    width: 594 * MM_TO_HUNDREDTHS_OF_INCH,
    height: 420 * MM_TO_HUNDREDTHS_OF_INCH,
    grid: { rows: 8, cols: 12 },
  },
  [PAPER_SIZES.A3]: {
    width: 420 * MM_TO_HUNDREDTHS_OF_INCH,
    height: 297 * MM_TO_HUNDREDTHS_OF_INCH,
    grid: { rows: 6, cols: 8 },
  },
  [PAPER_SIZES.A4]: {
    width: 297 * MM_TO_HUNDREDTHS_OF_INCH,
    height: 210 * MM_TO_HUNDREDTHS_OF_INCH,
    grid: { rows: 4, cols: 6 },
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

export const AUTHOR_BOX = {
  title: "DOCUMENT TITLE",
  author: "AUTHOR NAME",
  date: "YYYY-MM-DD",
};
