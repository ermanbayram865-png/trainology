export type OneRepMaxEstimate = {
  estimatedOneRepMax: number;
};

export function calculateEpleyOneRepMax(
  weight: number,
  repetitions: number,
): OneRepMaxEstimate {
  const estimatedOneRepMax = weight * (1 + repetitions / 30);

  return {
    estimatedOneRepMax: Math.round(estimatedOneRepMax * 10) / 10,
  };
}
