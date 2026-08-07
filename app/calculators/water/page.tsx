"use client";

import { useState } from "react";

import CalculatorForm from "@/components/calculators/CalculatorForm";
import CalculatorLayout from "@/components/calculators/CalculatorLayout";
import CalculatorResultCard from "@/components/calculators/CalculatorResultCard";
import CalculatorSection from "@/components/calculators/CalculatorSection";
import CTAButton from "@/components/ui/CTAButton";
import {
  calculateWaterRequirement,
  validateCalculatorField,
  WATER_ACTIVITY_LEVELS,
  type CalculatorField,
  type CalculatorFormValues,
  type CalculatorValidationErrors,
  type WaterActivityLevel,
  type WaterRequirement,
} from "@/lib/calculators";

const waterFields: readonly CalculatorField[] = [
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
    options: WATER_ACTIVITY_LEVELS,
    required: true,
  },
];

const initialValues: CalculatorFormValues = {
  weight: "",
  activityLevel: "moderate",
};

export default function WaterCalculatorPage() {
  const [values, setValues] = useState<CalculatorFormValues>(initialValues);
  const [errors, setErrors] = useState<CalculatorValidationErrors>({});
  const [result, setResult] = useState<WaterRequirement | null>(null);

  function handleFieldChange(name: string, value: CalculatorFormValues[string]) {
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: undefined }));
    setResult(null);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: CalculatorValidationErrors = {};

    for (const field of waterFields) {
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
      calculateWaterRequirement(
        Number(values.weight),
        values.activityLevel as WaterActivityLevel,
      ),
    );
  }

  return (
    <CalculatorLayout
      title="Su İhtiyacı Hesaplayıcı"
      description="Vücut ağırlığın ve aktivite seviyene göre günlük tahmini su ihtiyacını genel bilgilendirme amacıyla incele."
      info={
        <p>
          Bu araç, 30–35 ml/kg/gün temel aralığını aktivite seviyene göre küçük bir ayarlamayla sunar. Günlük ihtiyaç koşullara göre değişebilir.
        </p>
      }
      disclaimer="Bu hesaplama genel bilgilendirme amaçlı bir tahmindir. Su ihtiyacı; iklim, terleme, egzersiz süresi, beslenme ve bireysel faktörlere göre değişebilir."
    >
      <div className="grid gap-8 xl:grid-cols-2 xl:items-start">
        <CalculatorSection
          title="Bilgilerin"
          description="Günlük tahmini su ihtiyacını görmek için bilgilerini gir."
        >
          <CalculatorForm
            fields={waterFields}
            values={values}
            errors={errors}
            onChange={handleFieldChange}
            onSubmit={handleSubmit}
          >
            <CTAButton type="submit" className="w-full">
              Su İhtiyacını Hesapla
            </CTAButton>
          </CalculatorForm>
        </CalculatorSection>

        {result ? (
          <CalculatorResultCard
            title="Günlük Tahmini Su İhtiyacın"
            description="Bu aralık, seçtiğin aktivite seviyesiyle birlikte genel bir başlangıç tahmini sunar."
            results={[
              {
                title: "Tahmini günlük su ihtiyacı",
                value: `${result.minimumLiters}–${result.maximumLiters}`,
                unit: "litre / gün",
                color: "gold",
                explanation: "Genel 30–35 ml/kg/gün yaklaşımına göre hesaplandı.",
              },
            ]}
          />
        ) : (
          <CalculatorSection
            title="Sonucun"
            description="Bilgilerini girdikten sonra tahmini günlük su ihtiyacın burada görünecek."
            className="min-h-full"
          >
            <p className="text-sm leading-6 text-neutral-500">
              Sonucun genel bir tahmin olarak sunulacak.
            </p>
          </CalculatorSection>
        )}
      </div>
    </CalculatorLayout>
  );
}
