"use client";

import { useState } from "react";

import CalculatorForm from "@/components/calculators/CalculatorForm";
import CalculatorLayout from "@/components/calculators/CalculatorLayout";
import CalculatorResultCard from "@/components/calculators/CalculatorResultCard";
import CalculatorSection from "@/components/calculators/CalculatorSection";
import CTAButton from "@/components/ui/CTAButton";
import {
  calculateHealthyWeightRange,
  validateCalculatorField,
  type CalculatorField,
  type CalculatorFormValues,
  type CalculatorValidationErrors,
  type HealthyWeightRange,
} from "@/lib/calculators";

const healthyWeightFields: readonly CalculatorField[] = [
  {
    name: "height",
    label: "Boy",
    type: "number",
    unit: "cm",
    placeholder: "Örneğin 170",
    required: true,
    min: 100,
    max: 250,
    step: 0.1,
  },
];

const initialValues: CalculatorFormValues = {
  height: "",
};

export default function HealthyWeightCalculatorPage() {
  const [values, setValues] = useState<CalculatorFormValues>(initialValues);
  const [errors, setErrors] = useState<CalculatorValidationErrors>({});
  const [result, setResult] = useState<HealthyWeightRange | null>(null);

  function handleFieldChange(name: string, value: CalculatorFormValues[string]) {
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: undefined }));
    setResult(null);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const field = healthyWeightFields[0];
    const error = validateCalculatorField(field, values.height);
    const nextErrors = error ? { height: error } : {};

    setErrors(nextErrors);

    if (error) {
      return;
    }

    setResult(calculateHealthyWeightRange(Number(values.height)));
  }

  return (
    <CalculatorLayout
      title="Vücut Kitle İndeksi (BMI) ve Ağırlık Aralığı"
      seoPath="/calculators/healthy-weight"
      description="Boyuna göre BMI temelli genel ağırlık referans aralığını incele."
      info={
        <p>
          Bu araç tek bir hedef kilo önermez. Sonuç, boy uzunluğuna göre genel Vücut Kitle İndeksi (Body Mass Index / BMI) referans aralığından türetilir.
        </p>
      }
      disclaimer="Bu değer genel bir referanstır. Vücut kompozisyonu, kas kütlesi, yaş, cinsiyet ve bireysel hedefler sonucu değiştirebilir."
    >
      <div className="grid gap-8 xl:grid-cols-2 xl:items-start">
        <CalculatorSection
          title="Bilgilerin"
          description="Tahmini aralığı görmek için boyunu gir."
        >
          <CalculatorForm
            fields={healthyWeightFields}
            values={values}
            errors={errors}
            onChange={handleFieldChange}
            onSubmit={handleSubmit}
            className="lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-4 lg:space-y-0"
          >
            <CTAButton type="submit" className="w-full">
              Ağırlık Aralığını Hesapla
            </CTAButton>
          </CalculatorForm>
        </CalculatorSection>

        {result ? (
          <CalculatorResultCard
            title="BMI Referansına Göre Ağırlık Aralığın"
            description={`${values.height} cm boy için BMI temelli genel bir referans aralığı.`}
            results={[
              {
                title: "BMI ve ağırlık aralığı",
                value: `${result.minimumWeight}–${result.maximumWeight}`,
                unit: "kg",
                color: "gold",
                explanation: "BMI 18,5–24,9 genel referans aralığından türetildi.",
              },
            ]}
          />
        ) : (
          <CalculatorSection
            title="Sonucun"
            description="Boyunu girdikten sonra genel referans aralığın burada görünecek."
            className="min-h-full"
          >
            <p className="text-sm leading-6 text-neutral-500">
              Sonucun tek bir hedef kilo değil, genel bir referans aralığı olarak sunulacak.
            </p>
          </CalculatorSection>
        )}
      </div>
    </CalculatorLayout>
  );
}
