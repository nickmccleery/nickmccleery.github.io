import { v4 as uuidv4 } from "uuid";

export function getUtcTimestamp(): string {
  const now = new Date().toISOString();
  return now.replace(/\.\d{3}Z$/, "Z");
}

export function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getUuid(): string {
  return uuidv4();
}

export function linspace(start: number, stop: number, num: number): number[] {
  if (num === 1) {
    return [start];
  }
  const step = (stop - start) / (num - 1);
  return Array.from({ length: num }, (_, i) => start + step * i);
}
