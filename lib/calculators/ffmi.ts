export type FFMIClassification = "Düşük" | "Ortalama" | "İyi gelişmiş" | "Yüksek";

export type FFMIAnalysis = {
  fatMass: number;
  leanBodyMass: number;
  ffmi: number;
  classification: FFMIClassification;
};

function roundToOneDecimal(value: number) {
  return Math.round(value * 10) / 10;
}

export function classifyFFMI(ffmi: number): FFMIClassification {
  if (ffmi < 18) {
    return "Düşük";
  }

  if (ffmi < 22) {
    return "Ortalama";
  }

  if (ffmi < 25) {
    return "İyi gelişmiş";
  }

  return "Yüksek";
}

export function calculateFFMI({
  height,
  weight,
  bodyFatPercentage,
}: {
  height: number;
  weight: number;
  bodyFatPercentage: number;
}): FFMIAnalysis {
  const fatMass = weight * (bodyFatPercentage / 100);
  const leanBodyMass = weight - fatMass;
  const heightInMeters = height / 100;
  const ffmi = leanBodyMass / heightInMeters ** 2;

  return {
    fatMass: roundToOneDecimal(fatMass),
    leanBodyMass: roundToOneDecimal(leanBodyMass),
    ffmi: roundToOneDecimal(ffmi),
    classification: classifyFFMI(ffmi),
  };
}
