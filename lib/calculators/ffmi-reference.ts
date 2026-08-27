import type { BodyFatMeasurementMethod } from "./ffmi";

export const FFMI_REFERENCE_SEXES = ["men", "women"] as const;
export const FFMI_REFERENCE_METRICS = ["FFMI", "FMI"] as const;
export const FFMI_REFERENCE_BANDS = [
  "below_p5",
  "p5_p10",
  "p10_p25",
  "p25_p50",
  "p50_p75",
  "p75_p90",
  "p90_p95",
  "p95_or_above",
] as const;

export type FFMIReferenceSex = (typeof FFMI_REFERENCE_SEXES)[number];
export type FFMIReferenceMetric = (typeof FFMI_REFERENCE_METRICS)[number];
export type FFMIReferenceBand = (typeof FFMI_REFERENCE_BANDS)[number];
export type FFMIReferenceConfidence = "matched" | "approximate" | "unavailable";

export type FFMIReferenceRow = Readonly<{
  datasetId: "kim_2026_knhanes_ix_ffmi_fmi_v1";
  country: "KR";
  population: "KNHANES IX 2022–2023 Korean noninstitutionalized civilian population";
  measurementMethod: "direct segmental multifrequency BIA";
  device: "InBody 970";
  sex: FFMIReferenceSex;
  ageMin: number;
  ageMax: number;
  metric: FFMIReferenceMetric;
  p5: number;
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  p95: number;
  sourceLocation: "section 3.2 table 2";
}>;

export const FFMI_REFERENCE_METADATA = Object.freeze({
  datasetId: "kim_2026_knhanes_ix_ffmi_fmi_v1",
  country: "KR",
  population:
    "KNHANES IX 2022–2023 Korean noninstitutionalized civilian population",
  measurementMethod: "direct segmental multifrequency BIA",
  device: "InBody 970",
  publication: "Kim et al. 2026",
  citation:
    "Kim H, Hong YH, Jang YC, et al. National Reference Values of FFMI and FMI Using Body Composition Chart in Korean Adults. Nutrients. 2026;18(8):1170.",
  doi: "10.3390/nu18081170",
  pmid: "42074983",
  sourceLocation: "section 3.2 table 2",
  displayLabel: "KNHANES IX · Kore yetişkin referansı · InBody 970 BIA · 2022–2023",
} as const);

const ROW_METADATA = {
  datasetId: FFMI_REFERENCE_METADATA.datasetId,
  country: FFMI_REFERENCE_METADATA.country,
  population: FFMI_REFERENCE_METADATA.population,
  measurementMethod: FFMI_REFERENCE_METADATA.measurementMethod,
  device: FFMI_REFERENCE_METADATA.device,
  sourceLocation: FFMI_REFERENCE_METADATA.sourceLocation,
} as const;

function referenceRow(
  sex: FFMIReferenceSex,
  ageMin: number,
  ageMax: number,
  metric: FFMIReferenceMetric,
  p5: number,
  p10: number,
  p25: number,
  p50: number,
  p75: number,
  p90: number,
  p95: number,
): FFMIReferenceRow {
  return Object.freeze({
    ...ROW_METADATA,
    sex,
    ageMin,
    ageMax,
    metric,
    p5,
    p10,
    p25,
    p50,
    p75,
    p90,
    p95,
  });
}

export const FFMI_REFERENCE_DATA: readonly FFMIReferenceRow[] = Object.freeze([
  referenceRow("men", 20, 29, "FFMI", 15.5, 16.3, 17.4, 18.6, 20.0, 21.5, 22.4),
  referenceRow("men", 30, 39, "FFMI", 16.1, 16.7, 17.8, 19.0, 20.3, 21.5, 22.5),
  referenceRow("men", 40, 49, "FFMI", 16.2, 16.7, 17.9, 19.0, 20.2, 21.5, 22.4),
  referenceRow("men", 50, 59, "FFMI", 16.1, 16.7, 17.6, 18.7, 19.8, 20.7, 21.5),
  referenceRow("men", 60, 69, "FFMI", 15.6, 16.0, 17.0, 18.1, 19.3, 20.1, 20.6),
  referenceRow("men", 70, 80, "FFMI", 14.8, 15.4, 16.3, 17.4, 18.4, 19.2, 19.6),
  referenceRow("women", 20, 29, "FFMI", 12.7, 13.1, 13.8, 14.7, 15.8, 17.1, 18.2),
  referenceRow("women", 30, 39, "FFMI", 13.3, 13.6, 14.3, 15.2, 16.2, 17.5, 18.6),
  referenceRow("women", 40, 49, "FFMI", 13.3, 13.7, 14.6, 15.4, 16.4, 17.8, 18.6),
  referenceRow("women", 50, 59, "FFMI", 13.6, 14.0, 14.7, 15.5, 16.6, 17.6, 18.3),
  referenceRow("women", 60, 69, "FFMI", 13.6, 14.1, 14.9, 15.8, 16.6, 17.6, 18.2),
  referenceRow("women", 70, 80, "FFMI", 13.5, 14.0, 14.6, 15.5, 16.5, 17.2, 17.7),
  referenceRow("men", 20, 29, "FMI", 2.5, 3.0, 4.1, 5.4, 7.7, 10.0, 12.0),
  referenceRow("men", 30, 39, "FMI", 3.0, 3.6, 4.6, 6.0, 7.7, 9.8, 11.4),
  referenceRow("men", 40, 49, "FMI", 3.3, 3.9, 5.0, 6.3, 7.8, 9.5, 10.8),
  referenceRow("men", 50, 59, "FMI", 3.4, 4.1, 4.9, 6.0, 7.4, 8.9, 10.1),
  referenceRow("men", 60, 69, "FMI", 3.1, 3.7, 4.8, 5.9, 7.1, 8.4, 9.3),
  referenceRow("men", 70, 80, "FMI", 3.2, 3.9, 5.0, 6.1, 7.4, 8.9, 9.7),
  referenceRow("women", 20, 29, "FMI", 4.0, 4.4, 5.2, 6.5, 8.6, 11.1, 13.0),
  referenceRow("women", 30, 39, "FMI", 4.0, 4.4, 5.4, 6.9, 8.9, 11.5, 13.3),
  referenceRow("women", 40, 49, "FMI", 4.1, 4.6, 5.7, 7.1, 8.9, 11.0, 12.7),
  referenceRow("women", 50, 59, "FMI", 4.7, 5.3, 6.5, 7.8, 9.5, 11.1, 12.5),
  referenceRow("women", 60, 69, "FMI", 4.8, 5.5, 6.8, 8.1, 9.7, 11.4, 12.6),
  referenceRow("women", 70, 80, "FMI", 5.0, 5.8, 7.0, 8.5, 10.2, 11.7, 12.8),
]);

export const FFMI_REFERENCE_BAND_LABELS: Readonly<Record<FFMIReferenceBand, string>> =
  Object.freeze({
    below_p5: "P5’in altında",
    p5_p10: "P5–P10 aralığında",
    p10_p25: "P10–P25 aralığında",
    p25_p50: "P25–P50 aralığında",
    p50_p75: "P50–P75 aralığında",
    p75_p90: "P75–P90 aralığında",
    p90_p95: "P90–P95 aralığında",
    p95_or_above: "P95 veya üzerinde",
  });

export function isFFMIReferenceSex(value: unknown): value is FFMIReferenceSex {
  return FFMI_REFERENCE_SEXES.some((sex) => sex === value);
}

export function getFFMIReferenceRow(
  ageYears: number,
  sex: FFMIReferenceSex,
  metric: FFMIReferenceMetric,
): FFMIReferenceRow | undefined {
  if (!Number.isInteger(ageYears) || ageYears < 20 || ageYears > 80) return undefined;

  return FFMI_REFERENCE_DATA.find(
    (row) =>
      row.sex === sex &&
      row.metric === metric &&
      ageYears >= row.ageMin &&
      ageYears <= row.ageMax,
  );
}

export function getReferenceBand(
  value: number,
  reference: FFMIReferenceRow,
): FFMIReferenceBand {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError("Reference value must be finite and greater than zero.");
  }

  if (value < reference.p5) return "below_p5";
  if (value < reference.p10) return "p5_p10";
  if (value < reference.p25) return "p10_p25";
  if (value < reference.p50) return "p25_p50";
  if (value < reference.p75) return "p50_p75";
  if (value < reference.p90) return "p75_p90";
  if (value < reference.p95) return "p90_p95";
  return "p95_or_above";
}

export type FFMIReferenceComparison = Readonly<{
  ageYears: number;
  sex: FFMIReferenceSex;
  ageMin: number;
  ageMax: number;
  ffmi: Readonly<{ value: number; band: FFMIReferenceBand }>;
  fmi: Readonly<{ value: number; band: FFMIReferenceBand }>;
  metadata: typeof FFMI_REFERENCE_METADATA;
}>;

export type FFMIReferenceComparisonResult =
  | { type: "SUCCESS"; comparison: FFMIReferenceComparison }
  | {
      type: "UNAVAILABLE";
      reason:
        | "unsupported_measurement_method"
        | "unsupported_age"
        | "invalid_reference_category"
        | "invalid_numeric_input";
    };

export type FFMISourceSpecificInterpretationResult =
  | {
      type: "SUCCESS";
      confidence: Exclude<FFMIReferenceConfidence, "unavailable">;
      comparison: FFMIReferenceComparison;
    }
  | {
      type: "UNAVAILABLE";
      confidence: "unavailable";
      reason:
        | "unsupported_measurement_method"
        | "unsupported_age"
        | "invalid_reference_category"
        | "invalid_numeric_input";
    };

export function getFFMIReferenceConfidence(
  measurementMethod: unknown,
): FFMIReferenceConfidence {
  if (measurementMethod === "bia_smart_scale") return "matched";
  if (measurementMethod === "dexa" || measurementMethod === "skinfold") {
    return "approximate";
  }
  return "unavailable";
}

function buildFFMIReferenceComparison(input: {
  ageYears: unknown;
  sex: unknown;
  ffmi: unknown;
  fmi: unknown;
}): FFMIReferenceComparisonResult {
  if (!isFFMIReferenceSex(input.sex)) {
    return { type: "UNAVAILABLE", reason: "invalid_reference_category" };
  }
  if (
    typeof input.ageYears !== "number" ||
    !Number.isInteger(input.ageYears) ||
    input.ageYears < 20 ||
    input.ageYears > 80
  ) {
    return { type: "UNAVAILABLE", reason: "unsupported_age" };
  }
  if (
    typeof input.ffmi !== "number" ||
    !Number.isFinite(input.ffmi) ||
    input.ffmi <= 0 ||
    typeof input.fmi !== "number" ||
    !Number.isFinite(input.fmi) ||
    input.fmi <= 0
  ) {
    return { type: "UNAVAILABLE", reason: "invalid_numeric_input" };
  }

  const ffmiReference = getFFMIReferenceRow(input.ageYears, input.sex, "FFMI");
  const fmiReference = getFFMIReferenceRow(input.ageYears, input.sex, "FMI");
  if (!ffmiReference || !fmiReference) {
    return { type: "UNAVAILABLE", reason: "unsupported_age" };
  }

  return {
    type: "SUCCESS",
    comparison: Object.freeze({
      ageYears: input.ageYears,
      sex: input.sex,
      ageMin: ffmiReference.ageMin,
      ageMax: ffmiReference.ageMax,
      ffmi: Object.freeze({
        value: input.ffmi,
        band: getReferenceBand(input.ffmi, ffmiReference),
      }),
      fmi: Object.freeze({
        value: input.fmi,
        band: getReferenceBand(input.fmi, fmiReference),
      }),
      metadata: FFMI_REFERENCE_METADATA,
    }),
  };
}

export function interpretWithFFMISourceReference(input: {
  ageYears: unknown;
  sex: unknown;
  measurementMethod: unknown;
  ffmi: unknown;
  fmi: unknown;
}): FFMISourceSpecificInterpretationResult {
  const confidence = getFFMIReferenceConfidence(input.measurementMethod);
  if (confidence === "unavailable") {
    return {
      type: "UNAVAILABLE",
      confidence,
      reason: "unsupported_measurement_method",
    };
  }

  const result = buildFFMIReferenceComparison(input);
  if (result.type !== "SUCCESS") {
    return { ...result, confidence: "unavailable" };
  }

  return { ...result, confidence };
}

export function compareWithFFMIReference(input: {
  ageYears: unknown;
  sex: unknown;
  measurementMethod: BodyFatMeasurementMethod;
  ffmi: unknown;
  fmi: unknown;
}): FFMIReferenceComparisonResult {
  if (input.measurementMethod !== "bia_smart_scale") {
    return { type: "UNAVAILABLE", reason: "unsupported_measurement_method" };
  }
  return buildFFMIReferenceComparison(input);
}
