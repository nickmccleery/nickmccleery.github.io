import { linspace } from "./utils";
import { AXIS_GEOM, CENTERMARK_WIDTH } from "./constants";

export function computeGrid(
  width: number,
  height: number,
  nRows: number,
  nCols: number,
  border: number,
  frameWidth: number
): [number, number, number, number][] {
  const xStart = border;
  const xEnd = width - border;
  const yStart = border;
  const yEnd = height - border;

  const nLinesVertical = nCols + 1;
  const nLinesHorizontal = nRows + 1;

  const xVerticalLines = linspace(
    xStart + frameWidth,
    xEnd - frameWidth,
    nLinesVertical
  );

  const yHorizontalLines = linspace(
    yStart + frameWidth,
    yEnd - frameWidth,
    nLinesHorizontal
  );

  const coords: [number, number, number, number][] = [];

  // For our left and right-most we draw a full height line. For all
  // intermediate lines, we draw a line that is frameWidth tall at
  // the top and bottom.
  xVerticalLines.forEach((x, i) => {
    if (i === 0 || i === xVerticalLines.length - 1) {
      coords.push([x, yStart, x, yEnd]);
    } else {
      coords.push([x, yStart, x, yStart + frameWidth]);
      coords.push([x, yEnd, x, yEnd - frameWidth]);
    }
  });

  // As above but for horizontal lines.
  yHorizontalLines.forEach((y, i) => {
    if (i === 0 || i === yHorizontalLines.length - 1) {
      coords.push([xStart, y, xEnd, y]);
    } else {
      coords.push([xStart, y, xStart + frameWidth, y]);
      coords.push([xEnd, y, xEnd - frameWidth, y]);
    }
  });

  return coords;
}

export function computeCenterLines(
  width: number,
  height: number,
  border: number,
  frameWidth: number
): [number, number, number, number][] {
  // Get centers.
  const xCenter = width / 2;
  const yCenter = height / 2;

  // Handle vertical center marks.
  const xStartLeft = border + frameWidth;
  const xEndLeft = border + frameWidth + CENTERMARK_WIDTH;
  const xStartRight = width - border - frameWidth - CENTERMARK_WIDTH;
  const xEndRight = width - border - frameWidth;

  // Handle horizontal center marks.
  const yStartTop = border;
  const yEndTop = border + frameWidth + CENTERMARK_WIDTH;
  const yStartBottom = height - border - frameWidth - CENTERMARK_WIDTH;
  const yEndBottom = height - border;

  return [
    [xStartLeft, yCenter, xEndLeft, yCenter],
    [xStartRight, yCenter, xEndRight, yCenter],
    [xCenter, yStartTop, xCenter, yEndTop],
    [xCenter, yStartBottom, xCenter, yEndBottom],
  ];
}

export function computeGridLabelCoordinates(
  width: number,
  height: number,
  nRows: number,
  nCols: number,
  border: number,
  frameWidth: number
): [[number, number][], [number, number][]] {
  const widthTextBox = parseInt(AXIS_GEOM.width);
  const heightTextBox = parseInt(AXIS_GEOM.height);

  const widthRegion = width - 2 * border - 2 * frameWidth;
  const heightRegion = height - 2 * border - 2 * frameWidth;
  const xStart = border;
  const xEnd = width - border;
  const yStart = border;
  const yEnd = height - border;

  // We're just labelling the rows and columns, so no fencepost issues.
  const nLinesVertical = nCols;
  const nLinesHorizontal = nRows;

  // Get cell width/height.
  const sizeColCell = widthRegion / nLinesVertical;
  const sizeRowCell = heightRegion / nLinesHorizontal;

  // Get the centers for the X (top/bottom).
  const yAxisGridOffset = sizeRowCell / 2;
  const xAxisGridOffset = sizeColCell / 2;

  const xFirst = xStart + frameWidth + xAxisGridOffset;
  const xLast = xEnd - xAxisGridOffset - frameWidth;

  const xPositionTopBottomAxes = linspace(xFirst, xLast, nLinesVertical);
  const yPositionTopAxis = border + frameWidth / 2 - heightTextBox / 2;
  const yPositionBottomAxis = yEnd - frameWidth / 2 - heightTextBox / 2;

  // Get the centers for the Y (left/right).
  const yFirst = yStart + frameWidth + yAxisGridOffset;
  const yLast = yEnd - yAxisGridOffset - frameWidth;

  const yPositionLeftRightAxes = linspace(yFirst, yLast, nLinesHorizontal);
  const xPositionLeftAxis = border + frameWidth / 2 - widthTextBox / 2;
  const xPositionRightAxis = xEnd - frameWidth / 2 - widthTextBox / 2;

  // Get offsets for the label boxes.
  const heightLabel = parseInt(AXIS_GEOM.height);
  const widthLabel = parseInt(AXIS_GEOM.width);

  const xAxisLabelOffset = widthLabel / 2;
  const yAxisLabelOffset = heightLabel / 2;

  // Compute.
  const coordsTopBottomAxes: [number, number][] = [];
  const coordsLeftRightAxes: [number, number][] = [];

  xPositionTopBottomAxes.forEach((x) => {
    coordsTopBottomAxes.push([x - xAxisLabelOffset, yPositionTopAxis]);
    coordsTopBottomAxes.push([x - xAxisLabelOffset, yPositionBottomAxis]);
  });

  yPositionLeftRightAxes.forEach((y) => {
    coordsLeftRightAxes.push([xPositionLeftAxis, y - yAxisLabelOffset]);
    coordsLeftRightAxes.push([xPositionRightAxis, y - yAxisLabelOffset]);
  });

  return [coordsTopBottomAxes, coordsLeftRightAxes];
}
