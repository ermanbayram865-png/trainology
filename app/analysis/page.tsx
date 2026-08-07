"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";
import {
  calculateBodyMassIndex,
  calculateCalorieRequirement,
  calculateProteinRequirement,
  validateCalculatorField,
  type ActivityLevel,
  type CalculatorField,
  type CalorieGender,
  type CalorieRequirement,
  type Goal,
  type ProteinActivityLevel,
  type ProteinGoal,
  type ProteinRequirement,
} from "@/lib/calculators";

type AnalysisGoal = "gain" | "lose" | "maintain" | "performance";
type AnalysisActivityLevel = "low" | "moderate" | "high";

type AnalysisValues = {
  age: string;
  gender: CalorieGender;
  height: string;
  weight: string;
  goal: AnalysisGoal;
  activityLevel: AnalysisActivityLevel;
};

type AnalysisResult = {
  bmi: number;
  calorie: CalorieRequirement;
  protein: ProteinRequirement;
};

const numericFields: readonly CalculatorField[] = [
  { name: "age", label: "Yaş", type: "number", required: true, min: 15, max: 100 },
  { name: "height", label: "Boy", type: "number", required: true, min: 100, max: 250 },
  { name: "weight", label: "Kilo", type: "number", required: true, min: 30, max: 300 },
];

const initialValues: AnalysisValues = {
  age: "",
  gender: "female",
  height: "",
  weight: "",
  goal: "maintain",
  activityLevel: "moderate",
};

const goalLabels: Record<AnalysisGoal, string> = {
  gain: "Kas kazanımı",
  lose: "Yağ kaybı",
  maintain: "Kilo koruma",
  performance: "Performans",
};

const calorieGoals: Record<AnalysisGoal, Goal> = {
  gain: "gain",
  lose: "lose",
  maintain: "maintain",
  performance: "maintain",
};

const proteinGoals: Record<AnalysisGoal, ProteinGoal> = {
  gain: "muscleGain",
  lose: "fatLoss",
  maintain: "generalHealth",
  performance: "generalHealth",
};

const calorieActivityLevels: Record<AnalysisActivityLevel, ActivityLevel> = {
  low: "light",
  moderate: "moderate",
  high: "active",
};

const proteinActivityLevels: Record<AnalysisActivityLevel, ProteinActivityLevel> = {
  low: "low",
  moderate: "moderate",
  high: "active",
};

export default function AnalysisPage() {
  const [values, setValues] = useState<AnalysisValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [result, setResult] = useState<AnalysisResult | null>(null);

  function updateValue<Key extends keyof AnalysisValues>(key: Key, value: AnalysisValues[Key]) {
    setValues((currentValues) => ({ ...currentValues, [key]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [key]: undefined }));
    setResult(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: Record<string, string | undefined> = {};

    for (const field of numericFields) {
      const error = validateCalculatorField(field, values[field.name as keyof AnalysisValues]);

      if (error) {
        nextErrors[field.name] = error;
      }
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const age = Number(values.age);
    const height = Number(values.height);
    const weight = Number(values.weight);

    setResult({
      bmi: calculateBodyMassIndex(weight, height),
      calorie: calculateCalorieRequirement({
        gender: values.gender,
        age,
        height,
        weight,
        activityLevel: calorieActivityLevels[values.activityLevel],
        goal: calorieGoals[values.goal],
      }),
      protein: calculateProteinRequirement(
        weight,
        proteinGoals[values.goal],
        proteinActivityLevels[values.activityLevel],
      ),
    });
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Section contentClassName="space-y-12">
        <PageHeader
          badge={<Badge variant="gold">Ücretsiz araç</Badge>}
          title="Ücretsiz Fitness Analizi"
          description="Vücut bilgilerin ve hedeflerine göre temel fitness değerlendirmesi oluştur."
        />

        <div className="grid items-start gap-8 xl:grid-cols-2">
          <Card
            title="Bilgilerin"
            description="Temel analizini oluşturmak için aşağıdaki alanları doldur."
            variant="subtle"
          >
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-3">
                {[
                  { key: "age", label: "Yaş", placeholder: "30" },
                  { key: "height", label: "Boy (cm)", placeholder: "175" },
                  { key: "weight", label: "Kilo (kg)", placeholder: "70" },
                ].map((field) => (
                  <div key={field.key}>
                    <Input
                      label={field.label}
                      value={values[field.key as "age" | "height" | "weight"]}
                      placeholder={field.placeholder}
                      onChange={(value) => updateValue(field.key as "age" | "height" | "weight", value)}
                    />
                    {errors[field.key] && (
                      <p className="mt-2 text-sm text-amber-300">{errors[field.key]}</p>
                    )}
                  </div>
                ))}
              </div>

              <label className="block">
                <span className="mb-2 block text-lg font-medium">Cinsiyet</span>
                <select
                  value={values.gender}
                  onChange={(event) => updateValue("gender", event.target.value as CalorieGender)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-4 text-white outline-none transition focus:border-[#C9A14A]"
                >
                  <option value="female">Kadın</option>
                  <option value="male">Erkek</option>
                </select>
              </label>

              <fieldset>
                <legend className="mb-3 text-lg font-medium">Hedef</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(Object.keys(goalLabels) as AnalysisGoal[]).map((goal) => (
                    <label key={goal} className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-900 p-4 transition hover:border-[#C9A14A]/60">
                      <input
                        type="radio"
                        name="goal"
                        value={goal}
                        checked={values.goal === goal}
                        onChange={() => updateValue("goal", goal)}
                        className="accent-[#C9A14A]"
                      />
                      <span>{goalLabels[goal]}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="block">
                <span className="mb-2 block text-lg font-medium">Aktivite seviyesi</span>
                <select
                  value={values.activityLevel}
                  onChange={(event) => updateValue("activityLevel", event.target.value as AnalysisActivityLevel)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-4 text-white outline-none transition focus:border-[#C9A14A]"
                >
                  <option value="low">Düşük</option>
                  <option value="moderate">Orta</option>
                  <option value="high">Yüksek</option>
                </select>
              </label>

              <Button type="submit">Analizini Oluştur</Button>
            </form>
          </Card>

          {result ? (
            <Card
              title="Temel Fitness Analizin"
              description={`${goalLabels[values.goal]} hedefin ve aktivite seviyene göre oluşturuldu.`}
              variant="gold"
            >
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm text-neutral-400">BMI</p>
                  <p className="mt-2 text-3xl font-semibold text-[#C9A14A]">{result.bmi}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm text-neutral-400">Günlük kalori ihtiyacı</p>
                  <p className="mt-2 text-3xl font-semibold text-[#C9A14A]">{result.calorie.recommendedCalories}</p>
                  <p className="mt-1 text-sm text-neutral-400">kcal / gün</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm text-neutral-400">Protein önerisi</p>
                  <p className="mt-2 text-3xl font-semibold text-[#C9A14A]">{result.protein.dailyProtein}</p>
                  <p className="mt-1 text-sm text-neutral-400">g / gün</p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <Card href="/articles/gunluk-protein-ihtiyaci" title="Protein Rehberi" variant="subtle" className="p-5" />
                <Card href="/calculators/calorie" title="Kalori Hesaplayıcı" variant="subtle" className="p-5" />
                <Card href="/articles" title="Bilimsel Makaleler" variant="subtle" className="p-5" />
              </div>
            </Card>
          ) : (
            <Card
              title="Sonucun burada görünecek"
              description="BMI, tahmini günlük kalori ihtiyacı ve protein önerin formu tamamladığında gösterilecek."
              variant="subtle"
            />
          )}
        </div>
      </Section>
    </main>
  );
}
