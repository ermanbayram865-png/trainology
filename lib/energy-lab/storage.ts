import {
  normalizeCalibrationEntries,
  type CalibrationEntry,
} from "./calibration";

export const CALIBRATION_STORAGE_KEY = "trainology.energy-lab.calibration.v1";

export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function readCalibrationEntries(storage: StorageLike): CalibrationEntry[] {
  try {
    const rawValue = storage.getItem(CALIBRATION_STORAGE_KEY);
    if (!rawValue) return [];
    return normalizeCalibrationEntries(JSON.parse(rawValue));
  } catch {
    return [];
  }
}

export function writeCalibrationEntries(
  storage: StorageLike,
  entries: readonly CalibrationEntry[],
): CalibrationEntry[] {
  const normalized = normalizeCalibrationEntries(entries);
  storage.setItem(CALIBRATION_STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

export function clearCalibrationEntries(storage: StorageLike): void {
  storage.removeItem(CALIBRATION_STORAGE_KEY);
}
