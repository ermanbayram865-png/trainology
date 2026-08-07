"use client";

import { useState } from "react";

import CalculatorForm from "@/components/calculators/CalculatorForm";
import CalculatorLayout from "@/components/calculators/CalculatorLayout";
import CalculatorResultCard from "@/components/calculators/CalculatorResultCard";
import CalculatorSection from "@/components/calculators/CalculatorSection";
import CTAButton from "@/components/ui/CTAButton";
import {
  calculateCalorieRequirement,
  CALORIE_ACTIVITY_LEVELS,
  CALORIE_GENDERS,
  CALORIE_GOALS,
  DEFAULT_CALORIE_ACTIVITY_LEVEL,
  DEFAULT_CALORIE_GENDER,
  DEFAULT_CALORIE_GOAL,
  validateCalculatorField,
  type ActivityLevel,
  type CalculatorField,
  type CalculatorFormValues,
  type CalculatorValidationErrors,
  type CalorieGender,
  type CalorieRequirement,
  type Goal,
} from "@/lib/calculators";

const calorieFields: readonly CalculatorField[] = [
  {
    name: "gender",
    label: "Cinsiyet",
    type: "radio",
    options: CALORIE_GENDERS,
    required: true,
  },
  {
    name: "age",
    label: "Yaş",
    type: "number",
    unit: "yıl",
    placeholder: "Örneğin 30",
    required: true,
    min: 15,
    max: 100,
    step: 1,
  },
  {
    name: "height",
    label: "Boy",
    type: "number",
    unit: "cm",
    placeholder: "Örneğin 175",
    required: true,
    min: 100,
    max: 250,
    step: 1,
  },
  {
    name: "weight",
    label: "Kilo",
    type: "number",
    unit: "kg",
    placeholder: "Örneğin 70",
    required: true,
    min: 30,
    max: 300,
    step: 0.1,
  },
  {
    name: "activityLevel",
    label: "Aktivite seviyesi",
    type: "select",
    options: CALORIE_ACTIVITY_LEVELS,
    required: true,
  },
  {
    name: "goal",
    label: "Hedefin",
    type: "radio",
    options: CALORIE_GOALS,
    required: true,
  },
];

const initialValues: CalculatorFormValues = {
  gender: DEFAULT_CALORIE_GENDER,
  age: "",
  height: "",
  weight: "",
  activityLevel: DEFAULT_CALORIE_ACTIVITY_LEVEL,
  goal: DEFAULT_CALORIE_GOAL,
};

function getOptionLabel(
  options: readonly { label: string; value: string }[],
  value: string,
) {
  return options.find((option) => option.value === value)?.label ?? value;
}

export default function CalorieCalculatorPage() {
  const [values, setValues] = useState<CalculatorFormValues>(initialValues);
  const [errors, setErrors] = useState<CalculatorValidationErrors>({});
  const [result, setResult] = useState<CalorieRequirement | null>(null);

  function handleFieldChange(name: string, value: CalculatorFormValues[string]) {
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: undefined }));
    setResult(null);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: CalculatorValidationErrors = {};

    for (const field of calorieFields) {
      const error = validateCalculatorField(field, values[field.name]);

      if (error) {
        nextErrors[field.name] = error;
      }
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setResult(
      calculateCalorieRequirement({
        gender: values.gender as CalorieGender,
        age: Number(values.age),
        height: Number(values.height),
        weight: Number(values.weight),
        activityLevel: values.activityLevel as ActivityLevel,
        goal: values.goal as Goal,
      }),
    );
  }

  const selectedGoal = getOptionLabel(CALORIE_GOALS, String(values.goal));

  return (
    <CalculatorLayout
      title="Kalori Hesaplayıcı"
      seoPath="/calculators/calorie"
      description="Mifflin–St Jeor denklemi ve aktivite seviyene göre günlük enerji ihtiyacını analiz et."
      info={
        <>
          <p>
            BMR, vücudunun tam dinlenme halindeyken temel işlevleri için harcadığı tahmini enerjidir.
          </p>
          <p className="mt-3">
            TDEE, BMR değerinin günlük aktivite düzeyinle birlikte değerlendirilmiş halidir. Kalori dengesi, kilo koruma, yağ kaybı ve kas kazanımı hedeflerini etkiler.
          </p>
        </>
      }
      references={
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/2305711/"
              target="_blank"
              rel="noreferrer"
              className="text-[#C9A14A] underline-offset-4 hover:underline"
            >
              Mifflin MD et al. — A new predictive equation for resting energy expenditure in healthy individuals
            </a>
          </li>
          <li>
            <a
              href="https://acsm.org/education-resources/pronouncements-scientific-communications/position-stands/"
              target="_blank"
              rel="noreferrer"
              className="text-[#C9A14A] underline-offset-4 hover:underline"
            >
              American College of Sports Medicine (ACSM) — Position Stands
            </a>
          </li>
        </ul>
      }
      disclaimer="Bu hesaplama genel bilimsel denklemler temel alınarak hazırlanmıştır. Bireysel metabolizma, sağlık durumu ve yaşam koşulları farklılık gösterebilir."
    >
      <div className="grid gap-8 xl:grid-cols-2 xl:items-start">
        <CalculatorSection
          title="Bilgilerin"
          description="Enerji ihtiyacını tahmin etmek için aşağıdaki alanları doldur."
        >
          <CalculatorForm
            fields={calorieFields}
            values={values}
            errors={errors}
            onChange={handleFieldChange}
            onSubmit={handleSubmit}
          >
            <CTAButton type="submit" className="w-full">
              Günlük Enerji İhtiyacını Hesapla
            </CTAButton>
          </CalculatorForm>
        </CalculatorSection>

        {result ? (
          <CalculatorResultCard
            title="Enerji Analizin"
            description="Öneriler, seçtiğin hedef ve aktivite seviyesine göre oluşturuldu."
            results={[
              {
                title: "Günlük Enerji İhtiyacın",
                value: result.recommendedCalories,
                unit: "kcal / gün",
                color: "gold",
                explanation: `${selectedGoal} hedefin için günlük öneri.`,
              },
              {
                title: "Bazal Metabolizma (BMR)",
                value: result.bmr,
                unit: "kcal / gün",
                color: "neutral",
                explanation: "Tam dinlenme halindeki tahmini enerji harcaman.",
              },
              {
                title: "Günlük Kalori İhtiyacı (TDEE)",
                value: result.tdee,
                unit: "kcal / gün",
                color: "success",
                explanation: "Aktivite düzeyin dahil tahmini günlük enerji ihtiyacın.",
              },
              {
                title: "Yağ Kaybı Kalorisi",
                value: `${result.fatLoss.min}–${result.fatLoss.max}`,
                unit: "kcal / gün",
                color: "warning",
                explanation: "TDEE değerinden günlük 300–500 kcal daha düşük aralık.",
              },
              {
                title: "Kas Kazanımı Kalorisi",
                value: `${result.muscleGain.min}–${result.muscleGain.max}`,
                unit: "kcal / gün",
                color: "success",
                explanation: "TDEE değerine günlük 200–400 kcal eklenen aralık.",
              },
            ]}
          />
        ) : (
          <CalculatorSection
            title="Enerji Analizin"
            description="Bilgilerini girip hesapla butonuna bastığında BMR, TDEE ve hedef aralıkların burada görünecek."
            className="min-h-full"
          >
            <p className="text-sm leading-6 text-neutral-500">
              Sonuçlar; cinsiyet, yaş, boy, kilo, aktivite seviyesi ve hedef seçimine göre oluşturulur.
            </p>
          </CalculatorSection>
        )}
      </div>
    </CalculatorLayout>
  );
}
