"use client";

import { useState } from "react";

import CalculatorForm from "@/components/calculators/CalculatorForm";
import CalculatorLayout from "@/components/calculators/CalculatorLayout";
import CalculatorResultCard from "@/components/calculators/CalculatorResultCard";
import CalculatorSection from "@/components/calculators/CalculatorSection";
import CTAButton from "@/components/ui/CTAButton";
import {
  calculateProteinRequirement,
  DEFAULT_PROTEIN_ACTIVITY_LEVEL,
  DEFAULT_PROTEIN_GOAL,
  PROTEIN_ACTIVITY_LEVELS,
  PROTEIN_GOALS,
  validateCalculatorField,
  type CalculatorField,
  type CalculatorFormValues,
  type CalculatorValidationErrors,
  type ProteinActivityLevel,
  type ProteinGoal,
  type ProteinRequirement,
} from "@/lib/calculators";

const proteinFields: readonly CalculatorField[] = [
  {
    name: "weight",
    label: "Kilo",
    type: "number",
    unit: "kg",
    placeholder: "Örneğin 70",
    helperText: "Güncel vücut ağırlığını gir.",
    required: true,
    min: 25,
    max: 400,
    step: 0.1,
  },
  {
    name: "activityLevel",
    label: "Aktivite seviyesi",
    type: "select",
    options: PROTEIN_ACTIVITY_LEVELS,
    required: true,
  },
  {
    name: "goal",
    label: "Hedefin",
    type: "radio",
    options: PROTEIN_GOALS,
    required: true,
  },
];

const initialValues: CalculatorFormValues = {
  weight: "",
  activityLevel: DEFAULT_PROTEIN_ACTIVITY_LEVEL,
  goal: DEFAULT_PROTEIN_GOAL,
};

function getOptionLabel(
  options: readonly { label: string; value: string }[],
  value: string,
) {
  return options.find((option) => option.value === value)?.label ?? value;
}

export default function ProteinCalculatorPage() {
  const [values, setValues] = useState<CalculatorFormValues>(initialValues);
  const [errors, setErrors] = useState<CalculatorValidationErrors>({});
  const [result, setResult] = useState<ProteinRequirement | null>(null);

  function handleFieldChange(name: string, value: CalculatorFormValues[string]) {
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: undefined }));
    setResult(null);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: CalculatorValidationErrors = {};

    for (const field of proteinFields) {
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
      calculateProteinRequirement(
        Number(values.weight),
        values.goal as ProteinGoal,
        values.activityLevel as ProteinActivityLevel,
      ),
    );
  }

  const selectedGoal = getOptionLabel(PROTEIN_GOALS, String(values.goal));

  return (
    <CalculatorLayout
      title="Protein Hesaplayıcı"
      description="Hedefin ve aktivite seviyene göre günlük protein ihtiyacını hesapla."
      info={
        <>
          <p>
            Protein, kas protein sentezini destekler ve gün içine yayılan toplam protein alımı aktif bireylerde önem taşır.
          </p>
          <p className="mt-3">
            Öneriler; hedef, antrenman yükü, enerji alımı ve bireysel özelliklere göre değişebilir.
          </p>
        </>
      }
      references={
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/28642676/"
              target="_blank"
              rel="noreferrer"
              className="text-[#C9A14A] underline-offset-4 hover:underline"
            >
              International Society of Sports Nutrition (ISSN) — Position Stand: Protein and Exercise
            </a>
          </li>
        </ul>
      }
      disclaimer="Bu hesaplama genel bilimsel öneriler temel alınarak hazırlanmıştır. Bireysel ihtiyaçlar kişisel özelliklere göre değişebilir."
    >
      <div className="grid gap-8 xl:grid-cols-2 xl:items-start">
        <CalculatorSection
          title="Bilgilerin"
          description="Sonucunu kişiselleştirmek için aşağıdaki alanları doldur."
        >
          <CalculatorForm
            fields={proteinFields}
            values={values}
            errors={errors}
            onChange={handleFieldChange}
            onSubmit={handleSubmit}
          >
            <CTAButton type="submit" className="w-full">
              Protein İhtiyacını Hesapla
            </CTAButton>
          </CalculatorForm>
        </CalculatorSection>

        {result ? (
          <CalculatorResultCard
            title="Protein Sonucun"
            description="Öneri, seçtiğin hedef ve aktivite seviyesine göre hesaplandı."
            results={[
              {
                title: "Önerilen Günlük Protein",
                value: result.dailyProtein,
                unit: "g / gün",
                color: "gold",
                explanation: `${selectedGoal} hedefin için önerilen günlük miktar.`,
              },
              {
                title: "Kullanılan Aralık",
                value: `${result.range.min}–${result.range.max}`,
                unit: "g/kg/gün",
                color: "neutral",
                explanation: "Hedefine karşılık gelen bilimsel öneri aralığı.",
              },
              {
                title: "Kilo Başına Protein",
                value: result.proteinPerKg.toFixed(1),
                unit: "g/kg/gün",
                color: "success",
                explanation: "Aktivite seviyene göre aralık içinden seçilen değer.",
              },
            ]}
          />
        ) : (
          <CalculatorSection
            title="Protein Sonucun"
            description="Bilgilerini girip hesapla butonuna bastığında günlük protein önerin burada görünecek."
            className="min-h-full"
          >
            <p className="text-sm leading-6 text-neutral-500">
              Sonuç; kilo, aktivite seviyesi ve hedef seçimine göre oluşturulur.
            </p>
          </CalculatorSection>
        )}
      </div>
    </CalculatorLayout>
  );
}
