import { linspace } from "./utils";
import { AXIS_GEOM } from "./constants";

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

  const nLinesVertical = nCols;
  const nLinesHorizontal = nRows;

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

  // Typical fencepost problem would warrant n+1 vertical lines, but we have a
  // border already - so we can work with n-1.
  const nLinesVertical = nCols - 1;
  const nLinesHorizontal = nRows - 1;

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
