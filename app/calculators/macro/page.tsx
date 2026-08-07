"use client";

import { useState } from "react";

import CalculatorForm from "@/components/calculators/CalculatorForm";
import CalculatorLayout from "@/components/calculators/CalculatorLayout";
import CalculatorResultCard from "@/components/calculators/CalculatorResultCard";
import CalculatorSection from "@/components/calculators/CalculatorSection";
import CTAButton from "@/components/ui/CTAButton";
import {
  calculateMacroDistribution,
  CALORIE_GOALS,
  DEFAULT_CALORIE_GOAL,
  DEFAULT_MACRO_ACTIVITY_LEVEL,
  DEFAULT_MACRO_PROTEIN_PREFERENCE,
  MACRO_ACTIVITY_LEVELS,
  MACRO_PROTEIN_PREFERENCES,
  validateCalculatorField,
  type CalculatorField,
  type CalculatorFormValues,
  type CalculatorValidationErrors,
  type Goal,
  type MacroActivityLevel,
  type MacroDistribution,
  type MacroProteinPreference,
} from "@/lib/calculators";

const macroFields: readonly CalculatorField[] = [
  {
    name: "calories",
    label: "Günlük kalori",
    type: "number",
    unit: "kcal",
    placeholder: "Örneğin 2400",
    helperText: "Mevcut kalori hedefini veya koruma kalorini gir.",
    required: true,
    min: 1000,
    max: 8000,
    step: 1,
  },
  {
    name: "goal",
    label: "Hedefin",
    type: "radio",
    options: CALORIE_GOALS,
    required: true,
  },
  {
    name: "proteinPreference",
    label: "Protein tercihi",
    type: "radio",
    options: MACRO_PROTEIN_PREFERENCES,
    required: true,
  },
  {
    name: "activityLevel",
    label: "Aktivite seviyesi",
    type: "select",
    options: MACRO_ACTIVITY_LEVELS,
    required: true,
  },
];

const initialValues: CalculatorFormValues = {
  calories: "",
  goal: DEFAULT_CALORIE_GOAL,
  proteinPreference: DEFAULT_MACRO_PROTEIN_PREFERENCE,
  activityLevel: DEFAULT_MACRO_ACTIVITY_LEVEL,
};

function getOptionLabel(
  options: readonly { label: string; value: string }[],
  value: string,
) {
  return options.find((option) => option.value === value)?.label ?? value;
}

export default function MacroCalculatorPage() {
  const [values, setValues] = useState<CalculatorFormValues>(initialValues);
  const [errors, setErrors] = useState<CalculatorValidationErrors>({});
  const [result, setResult] = useState<MacroDistribution | null>(null);

  function handleFieldChange(name: string, value: CalculatorFormValues[string]) {
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: undefined }));
    setResult(null);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: CalculatorValidationErrors = {};

    for (const field of macroFields) {
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
      calculateMacroDistribution({
        calories: Number(values.calories),
        goal: values.goal as Goal,
        proteinPreference: values.proteinPreference as MacroProteinPreference,
        activityLevel: values.activityLevel as MacroActivityLevel,
      }),
    );
  }

  const selectedGoal = getOptionLabel(CALORIE_GOALS, String(values.goal));
  const selectedPreference = getOptionLabel(
    MACRO_PROTEIN_PREFERENCES,
    String(values.proteinPreference),
  );

  return (
    <CalculatorLayout
      title="Macro Hesaplayıcı"
      description="Günlük kalori hedefin, amacın ve tercihlerin için önerilen makro dağılımını incele."
      info={
        <>
          <p>
            Makrolar protein, karbonhidrat ve yağdan oluşur. Protein doku onarımını destekler; karbonhidrat antrenman performansına enerji sağlar; yağlar hormon ve genel sağlık için gereklidir.
          </p>
          <p className="mt-3">
            Tek bir doğru makro oranı yoktur. Bu araç, vücut ağırlığı girişi olmadan kalori yüzdesi yaklaşımıyla başlangıç önerisi sunar.
          </p>
        </>
      }
      references={
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/28630601/"
              target="_blank"
              rel="noreferrer"
              className="text-[#C9A14A] underline-offset-4 hover:underline"
            >
              International Society of Sports Nutrition (ISSN) — Position Stand: Diets and Body Composition
            </a>
          </li>
          <li>
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/19225360/"
              target="_blank"
              rel="noreferrer"
              className="text-[#C9A14A] underline-offset-4 hover:underline"
            >
              ACSM — Nutrition and Athletic Performance
            </a>
          </li>
        </ul>
      }
      disclaimer="Makro dağılımları hedef, antrenman hacmi, tercih ve bireysel ihtiyaçlara göre değişebilir. Bu araç genel bilimsel öneriler temel alınarak hazırlanmıştır."
    >
      <div className="grid gap-8 xl:grid-cols-2 xl:items-start">
        <CalculatorSection
          title="Bilgilerin"
          description="Makro önerini oluşturmak için günlük kalori hedefini ve tercihlerini seç."
        >
          <CalculatorForm
            fields={macroFields}
            values={values}
            errors={errors}
            onChange={handleFieldChange}
            onSubmit={handleSubmit}
          >
            <CTAButton type="submit" className="w-full">
              Makro Dağılımını Hesapla
            </CTAButton>
          </CalculatorForm>
        </CalculatorSection>

        {result ? (
          <CalculatorResultCard
            title="Günlük Makro Dağılımın"
            description="Sonuçlar, kalori yüzdesi yaklaşımıyla oluşturulmuş başlangıç önerisidir."
            results={[
              {
                title: "Protein",
                value: result.protein,
                unit: "g / gün",
                color: "gold",
                explanation: `%${result.proteinPercentage} kalori — ${selectedPreference} tercih.`,
              },
              {
                title: "Karbonhidrat",
                value: result.carbohydrates,
                unit: "g / gün",
                color: "success",
                explanation: `%${result.carbohydratePercentage} kalori — kalan enerji miktarı.`,
              },
              {
                title: "Yağ",
                value: result.fat,
                unit: "g / gün",
                color: "warning",
                explanation: `%${result.fatPercentage} kalori — aktivite seviyene göre.`,
              },
              {
                title: "Toplam Kalori",
                value: String(values.calories),
                unit: "kcal / gün",
                color: "neutral",
                explanation: "Günlük makro dağılımı için kullanılan değer.",
              },
              {
                title: "Kullanılan Yaklaşım",
                value: "Kalori yüzdesi",
                color: "neutral",
                explanation: `${selectedGoal} hedefi ve ${selectedPreference.toLowerCase()} tercihi dikkate alınır.`,
              },
            ]}
          />
        ) : (
          <CalculatorSection
            title="Günlük Makro Dağılımın"
            description="Bilgilerini girip hesapla butonuna bastığında protein, karbonhidrat ve yağ önerilerin burada görünecek."
            className="min-h-full"
          >
            <p className="text-sm leading-6 text-neutral-500">
              Gram sonuçları, protein ve karbonhidrat için 4 kcal/g; yağ için 9 kcal/g dönüşümüyle hesaplanır.
            </p>
          </CalculatorSection>
        )}
      </div>
    </CalculatorLayout>
  );
}
