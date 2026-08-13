import { calculateBodyMassIndex, calculateCalorieRequirement, calculateHealthyWeightRange, calculateMacroDistribution, type ActivityLevel, type Goal } from "@/lib/calculators";
import type { AnalysisActivityLevel, AnalysisInput, AnalysisResult } from "@/types/analysis";

const calorieActivity: Record<AnalysisActivityLevel, ActivityLevel> = { low: "light", moderate: "moderate", high: "active" };

function bmiCategory(bmi: number) { if (bmi < 18.5) return "Düşük aralık"; if (bmi < 25) return "Genel referans aralığı"; if (bmi < 30) return "Yüksek aralık"; return "Daha yüksek aralık"; }
function target(goal: Goal) { if (goal === "gain") return { label: "Kas kazanımı", message: "Mevcut verileriniz, küçük ve sürdürülebilir bir enerji fazlası ile yeterli protein alımını destekleyen bir yaklaşım için uygundur." }; if (goal === "lose") return { label: "Yağ kaybı", message: "Kontrollü enerji açığı ve düzenli direnç antrenmanı, kas kütlesini koruma açısından birlikte değerlendirilmelidir." }; return { label: "Kilo koruma", message: "Mevcut bakım kaloriniz civarında istikrarlı beslenme ve düzenli aktivite, ağırlığı korumaya yardımcı olabilir." }; }
function activitySummary(weeklyTrainingDays?: number, dailySteps?: number) { const parts: string[] = []; if (weeklyTrainingDays) parts.push(`Haftada ${weeklyTrainingDays} antrenman günü girdiniz; sürdürülebilirlik ve toparlanma birlikte izlenmelidir.`); if (dailySteps) parts.push(`Günlük ortalama ${dailySteps.toLocaleString("tr-TR")} adım girdiniz; günlük hareket düzeyi toplam enerji harcamasını destekleyebilir.`); return { weeklyTrainingDays, dailySteps, message: parts.length ? parts.join(" ") : undefined }; }

export function calculateHealthSnapshot(input: AnalysisInput): AnalysisResult {
  const calorie = calculateCalorieRequirement({ gender: input.gender, age: input.age, height: input.height, weight: input.weight, activityLevel: calorieActivity[input.activityLevel], goal: input.goal });
  const macro = calculateMacroDistribution({ calories: calorie.recommendedCalories, weight: input.weight, goal: input.goal, activityLevel: input.activityLevel });
  const bmi = calculateBodyMassIndex(input.weight, input.height);
  const targetRange = input.goal === "lose" ? calorie.fatLoss : input.goal === "gain" ? calorie.muscleGain : undefined;
  return { body: { bmi, bmiCategory: bmiCategory(bmi), healthyWeightRange: calculateHealthyWeightRange(input.height) }, nutrition: { maintenanceCalories: calorie.tdee, targetCalories: calorie.recommendedCalories, targetRange, dailyProtein: macro.protein, proteinPerKg: macro.proteinPerKg, macro }, activity: activitySummary(input.weeklyTrainingDays, input.dailySteps), target: target(input.goal) };
}
