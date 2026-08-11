import type { ActivityProfile, EnergyGoal } from "./types";
import type { StorageLike } from "./storage";

export const ENERGY_LAB_HANDOFF_KEY = "trainology.energy-lab.macro-handoff.v1";

export type EnergyLabMacroHandoff = {
  version: 1;
  createdAt: string;
  rawTargetKcal: number;
  displayTargetKcal: number;
  goal: EnergyGoal;
  weightKg: number;
  activityProfile: ActivityProfile;
};

export function writeEnergyLabHandoff(
  storage: StorageLike,
  value: Omit<EnergyLabMacroHandoff, "version" | "createdAt">,
): EnergyLabMacroHandoff {
  const handoff: EnergyLabMacroHandoff = {
    version: 1,
    createdAt: new Date().toISOString(),
    rawTargetKcal: value.rawTargetKcal,
    displayTargetKcal: value.displayTargetKcal,
    goal: value.goal,
    weightKg: value.weightKg,
    activityProfile: value.activityProfile,
  };

  storage.setItem(ENERGY_LAB_HANDOFF_KEY, JSON.stringify(handoff));
  return handoff;
}

export function readEnergyLabHandoff(
  storage: Pick<StorageLike, "getItem">,
): EnergyLabMacroHandoff | null {
  try {
    const rawValue = storage.getItem(ENERGY_LAB_HANDOFF_KEY);
    if (!rawValue) return null;
    const value: unknown = JSON.parse(rawValue);
    if (!isRecord(value) || value.version !== 1) return null;

    if (
      typeof value.createdAt !== "string" ||
      !Number.isFinite(Date.parse(value.createdAt)) ||
      !isFinitePositiveNumber(value.rawTargetKcal) ||
      !isFinitePositiveNumber(value.displayTargetKcal) ||
      !isFinitePositiveNumber(value.weightKg) ||
      !isEnergyGoal(value.goal) ||
      !isActivityProfile(value.activityProfile)
    ) {
      return null;
    }

    return {
      version: 1,
      createdAt: value.createdAt,
      rawTargetKcal: value.rawTargetKcal,
      displayTargetKcal: value.displayTargetKcal,
      goal: value.goal,
      weightKg: value.weightKg,
      activityProfile: value.activityProfile,
    };
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isFinitePositiveNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function isEnergyGoal(value: unknown): value is EnergyGoal {
  return value === "maintain" || value === "lose" || value === "gain";
}

function isActivityProfile(value: unknown): value is ActivityProfile {
  return (
    value === "inactive" ||
    value === "lowActive" ||
    value === "active" ||
    value === "veryActive"
  );
}
