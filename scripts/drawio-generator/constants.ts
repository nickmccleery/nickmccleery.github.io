// https://cadsetterout.com/drawing-standards/grid-reference-frame/

export const BORDER_WIDTH = 10; // 10/100ths of an inch.
export const FRAME_WIDTH = 30; // Reference frame thickness.
export const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ";
export const TEXT_STYLE =
  "text;html=1;align=center;verticalAlign=middle;fontSize=14;fontFamily=Monospace;";
export const TEXT_STYLE_TITLEBLOCK =
  TEXT_STYLE + "whiteSpace=wrap;strokeColor=default;fillColor=default;";

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

// Also note that Draw.io paper sizes seem broadly wrong—they're always a
// wee bit out. We should use the metric dimensions and convert, but just
// use the Draw.io values so we're aligned. See:
// https://github.com/jgraph/drawio/blob/acd938b1e42cff3be3b629e6239cdec9a9baddcc/src/main/webapp/js/grapheditor/Editor.js#L2320

export const SHEET_CONFIGS: Record<
  PAPER_SIZES,
  { width: number; height: number; grid: GridConfig }
> = {
  [PAPER_SIZES.A1]: {
    width: 3300,
    height: 2339,
    grid: { rows: 12, cols: 16 },
  },
  [PAPER_SIZES.A2]: {
    width: 2336,
    height: 1654,
    grid: { rows: 8, cols: 12 },
  },
  [PAPER_SIZES.A3]: {
    width: 1654,
    height: 1169,
    grid: { rows: 6, cols: 8 },
  },
  [PAPER_SIZES.A4]: {
    width: 1169,
    height: 827,
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
