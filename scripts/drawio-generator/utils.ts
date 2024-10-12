// utils.ts

import { v4 as uuidv4 } from "uuid";
import { DIMS, PAPER_SIZE } from "./constants";

export function getUtcTimestamp(): string {
  const now = new Date().toISOString();
  return now.replace(/\.\d{3}Z$/, "Z");
}

export function getUuid(): string {
  return uuidv4();
}

export function getDims(): [number, number, number] {
  const activeDims = DIMS[PAPER_SIZE];
  return [activeDims.width, activeDims.height, activeDims.border];
}

export function linspace(start: number, stop: number, num: number): number[] {
  if (num === 1) {
    return [start];
  }
  const step = (stop - start) / (num - 1);
  return Array.from({ length: num }, (_, i) => start + step * i);
}
