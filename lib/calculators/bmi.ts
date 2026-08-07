export function calculateBodyMassIndex(weight: number, heightInCentimeters: number): number {
  const heightInMeters = heightInCentimeters / 100;

  return Math.round((weight / heightInMeters ** 2) * 10) / 10;
}
