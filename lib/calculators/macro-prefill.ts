export const MACRO_CALORIE_PREFILL_MIN = 1000;
export const MACRO_CALORIE_PREFILL_MAX = 8000;

export function isValidMacroCaloriePrefill(value: number): boolean {
  return (
    Number.isInteger(value) &&
    value >= MACRO_CALORIE_PREFILL_MIN &&
    value <= MACRO_CALORIE_PREFILL_MAX
  );
}

export function parseMacroCaloriePrefill(value: string | null): string {
  if (value === null || value.trim() === "") return "";
  const calories = Number(value);
  return isValidMacroCaloriePrefill(calories) ? String(calories) : "";
}

export function getMacroCalorieHandoffHref(value: number): string | null {
  return isValidMacroCaloriePrefill(value)
    ? `/calculators/macro?calories=${value}`
    : null;
}
