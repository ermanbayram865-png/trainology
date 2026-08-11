export type CalibrationEntry = {
  date: string;
  weightKg: number;
  cycleNote?: string;
  note?: string;
};

export type CalibrationDataQuality = "missing" | "partial" | "sufficient";
export type CalibrationDirection = "insufficient" | "down" | "up" | "stable";

export type CalibrationSummary = {
  entries: readonly CalibrationEntry[];
  completedDays: number;
  observationDays: number;
  progress: number;
  dataQuality: CalibrationDataQuality;
  stageMessage: string;
  firstSevenAverage: number | null;
  firstSevenCount: number;
  lastSevenAverage: number | null;
  lastSevenCount: number;
  direction: CalibrationDirection;
  directionMessage: string;
  rapidLossCaution: boolean;
};

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DAY_IN_MILLISECONDS = 86_400_000;
const CALIBRATION_WINDOW_DAYS = 28;

export function normalizeCalibrationEntries(value: unknown): CalibrationEntry[] {
  if (!Array.isArray(value)) return [];

  const byDate = new Map<string, CalibrationEntry>();

  for (const item of value) {
    if (!isRecord(item)) continue;

    const date = typeof item.date === "string" ? item.date : "";
    const weightKg = typeof item.weightKg === "number" ? item.weightKg : Number.NaN;

    if (!isValidIsoDate(date) || !Number.isFinite(weightKg) || weightKg < 25 || weightKg > 400) {
      continue;
    }

    const cycleNote = cleanOptionalText(item.cycleNote, 120);
    const note = cleanOptionalText(item.note, 280);

    byDate.set(date, {
      date,
      weightKg,
      ...(cycleNote ? { cycleNote } : {}),
      ...(note ? { note } : {}),
    });
  }

  return [...byDate.values()].sort((left, right) => left.date.localeCompare(right.date));
}

export function upsertCalibrationEntry(
  currentEntries: readonly CalibrationEntry[],
  entry: CalibrationEntry,
): CalibrationEntry[] {
  return normalizeCalibrationEntries([
    ...currentEntries.filter((current) => current.date !== entry.date),
    entry,
  ]);
}

export function removeCalibrationEntry(
  currentEntries: readonly CalibrationEntry[],
  date: string,
): CalibrationEntry[] {
  return normalizeCalibrationEntries(currentEntries.filter((entry) => entry.date !== date));
}

/**
 * Summarizes only the latest 28-calendar-day window. A "sufficient" result
 * therefore requires one valid entry on every day of that window; 28 records
 * spread across a longer history cannot masquerade as 28 days of observation.
 * The 14/28 stages and first/last seven-day comparison are transparent product
 * heuristics, not validated clinical thresholds or a TDEE measurement.
 */
export function summarizeCalibration(value: unknown): CalibrationSummary {
  const entries = calibrationWindow(normalizeCalibrationEntries(value));
  const completedDays = entries.length;
  const observationDays = calendarSpanDays(entries);
  const firstDate = entries[0]?.date;
  const lastDate = entries.at(-1)?.date;
  const firstWindow = entries.filter((entry) =>
    firstDate ? daysBetween(firstDate, entry.date) < 7 : false,
  );
  const lastWindow = entries.filter((entry) =>
    lastDate ? daysBetween(entry.date, lastDate) < 7 : false,
  );
  const firstSevenAverage = firstWindow.length > 0 ? average(firstWindow) : null;
  const lastSevenAverage = lastWindow.length > 0 ? average(lastWindow) : null;
  const comparableSevenDayWindows =
    observationDays >= 14 && firstWindow.length === 7 && lastWindow.length === 7;

  const dataQuality: CalibrationDataQuality =
    completedDays === CALIBRATION_WINDOW_DAYS && observationDays === CALIBRATION_WINDOW_DAYS
      ? "sufficient"
      : completedDays >= 14 && observationDays >= 14
        ? "partial"
        : "missing";

  const stageMessage =
    dataQuality === "sufficient"
      ? "Kalibrasyon için daha güçlü veri oluştu. Son 28 takvim gününde günlük kayıtlar tamamlandı; bu yine de enerji ihtiyacını ölçmez."
      : dataQuality === "partial"
        ? "İlk trend oluşuyor. Bu süre gerçek bakım kalorinizi kesin olarak belirlemek için yeterli değildir."
        : "Henüz yeterli trend verisi yok.";

  let direction: CalibrationDirection = "insufficient";
  let directionMessage =
    "Yönsel karşılaştırma için en az 14 takvim gününe yayılan, ilk ve son yedi günün her birinde geçerli kayıt gerekir.";

  if (comparableSevenDayWindows && firstSevenAverage !== null && lastSevenAverage !== null) {
    const displayedDifference = Math.round((lastSevenAverage - firstSevenAverage) * 10) / 10;
    const differenceLabel = Math.abs(displayedDifference).toLocaleString("tr-TR", {
      maximumFractionDigits: 1,
      minimumFractionDigits: 1,
    });

    if (displayedDifference < 0) {
      direction = "down";
      directionMessage = `İlk ve son yedi takvim gününün ortalamaları arasında ${differenceLabel} kg aşağı yönlü fark var. Bu, mevcut koşullardaki ağırlık seyrini gösterir; enerji ihtiyacını ölçmez.`;
    } else if (displayedDifference > 0) {
      direction = "up";
      directionMessage = `İlk ve son yedi takvim gününün ortalamaları arasında ${differenceLabel} kg yukarı yönlü fark var. Bu sonuç tek başına enerji ihtiyacını ölçmez.`;
    } else {
      direction = "stable";
      directionMessage =
        "İlk ve son yedi takvim gününün ortalamaları, 0,1 kg gösterim çözünürlüğünde farklı değil. Bu, ağırlığın kesin olarak sabit olduğunu veya bakım kalorisini kanıtlamaz.";
    }
  }

  const lossFraction =
    firstSevenAverage && lastSevenAverage
      ? (firstSevenAverage - lastSevenAverage) / firstSevenAverage
      : 0;
  const rapidLossCaution = Boolean(
    dataQuality === "sufficient" &&
      comparableSevenDayWindows &&
      lossFraction - 0.04 > 1e-9,
  );

  return {
    entries,
    completedDays,
    observationDays,
    progress: Math.min(completedDays / CALIBRATION_WINDOW_DAYS, 1),
    dataQuality,
    stageMessage,
    firstSevenAverage,
    firstSevenCount: firstWindow.length,
    lastSevenAverage,
    lastSevenCount: lastWindow.length,
    direction,
    directionMessage,
    rapidLossCaution,
  };
}

function calibrationWindow(entries: readonly CalibrationEntry[]): CalibrationEntry[] {
  const latestDate = entries.at(-1)?.date;
  if (!latestDate) return [];

  const windowStart = addDays(latestDate, -(CALIBRATION_WINDOW_DAYS - 1));
  return entries.filter((entry) => entry.date >= windowStart && entry.date <= latestDate);
}

function calendarSpanDays(entries: readonly CalibrationEntry[]): number {
  const firstDate = entries[0]?.date;
  const lastDate = entries.at(-1)?.date;
  if (!firstDate || !lastDate) return 0;
  return daysBetween(firstDate, lastDate) + 1;
}

function daysBetween(earlierDate: string, laterDate: string): number {
  return Math.round(
    (Date.parse(`${laterDate}T00:00:00Z`) - Date.parse(`${earlierDate}T00:00:00Z`)) /
      DAY_IN_MILLISECONDS,
  );
}

function addDays(date: string, amount: number): string {
  return new Date(Date.parse(`${date}T00:00:00Z`) + amount * DAY_IN_MILLISECONDS)
    .toISOString()
    .slice(0, 10);
}

function average(entries: readonly CalibrationEntry[]): number {
  return entries.reduce((sum, entry) => sum + entry.weightKg, 0) / entries.length;
}

function isValidIsoDate(value: string): boolean {
  if (!DATE_PATTERN.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function cleanOptionalText(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const cleaned = value.trim().slice(0, maxLength);
  return cleaned || undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
