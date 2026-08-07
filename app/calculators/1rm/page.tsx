"use client";

import { useState } from "react";

import CalculatorForm from "@/components/calculators/CalculatorForm";
import CalculatorLayout from "@/components/calculators/CalculatorLayout";
import CalculatorResultCard from "@/components/calculators/CalculatorResultCard";
import CalculatorSection from "@/components/calculators/CalculatorSection";
import CTAButton from "@/components/ui/CTAButton";
import {
  calculateEpleyOneRepMax,
  ONE_REP_MAX_EXERCISES,
  validateCalculatorField,
  type CalculatorField,
  type CalculatorFormValues,
  type CalculatorValidationErrors,
  type OneRepMaxEstimate,
} from "@/lib/calculators";

const oneRepMaxFields: readonly CalculatorField[] = [
  {
    name: "exercise",
    label: "Egzersiz",
    type: "select",
    options: ONE_REP_MAX_EXERCISES,
    required: true,
  },
  {
    name: "weight",
    label: "Kullanılan ağırlık",
    type: "number",
    unit: "kg",
    placeholder: "Örneğin 100",
    required: true,
    min: 1,
    max: 500,
    step: 0.5,
  },
  {
    name: "repetitions",
    label: "Tekrar sayısı",
    type: "number",
    unit: "rep",
    placeholder: "Örneğin 5",
    required: true,
    min: 1,
    max: 20,
    step: 1,
  },
];

const initialValues: CalculatorFormValues = {
  exercise: "",
  weight: "",
  repetitions: "",
};

function getExerciseLabel(value: string) {
  return ONE_REP_MAX_EXERCISES.find((exercise) => exercise.value === value)?.label ?? value;
}

export default function OneRepMaxCalculatorPage() {
  const [values, setValues] = useState<CalculatorFormValues>(initialValues);
  const [errors, setErrors] = useState<CalculatorValidationErrors>({});
  const [result, setResult] = useState<OneRepMaxEstimate | null>(null);

  function handleFieldChange(name: string, value: CalculatorFormValues[string]) {
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: undefined }));
    setResult(null);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: CalculatorValidationErrors = {};

    for (const field of oneRepMaxFields) {
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
      calculateEpleyOneRepMax(
        Number(values.weight),
        Number(values.repetitions),
      ),
    );
  }

  const selectedExercise = getExerciseLabel(String(values.exercise));

  return (
    <CalculatorLayout
      title="1RM Hesaplayıcı"
      description="Bir harekette kaldırdığın ağırlık ve tekrar sayısından tahmini maksimum gücünü hesapla."
      info={
        <>
          <p>
            1RM, bir hareket için tek tekrar yapabileceğin en yüksek yükü ifade eder. Antrenman programlamasında yükleri yüzde olarak planlamak için kullanılabilir.
          </p>
          <p className="mt-3">
            Submaksimal bir setten tahmin yapmak, her zaman gerçek maksimum denemesi yapmadan performans takibi sağlamaya yardımcı olabilir.
          </p>
        </>
      }
      references={
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/16937972/"
              target="_blank"
              rel="noreferrer"
              className="text-[#C9A14A] underline-offset-4 hover:underline"
            >
              Prediction of one repetition maximum strength from multiple repetition maximum testing
            </a>
          </li>
          <li>
            <a
              href="https://www.hprc-online.org/physical-fitness/training-performance/what-one-rep-max"
              target="_blank"
              rel="noreferrer"
              className="text-[#C9A14A] underline-offset-4 hover:underline"
            >
              NSCA strength testing guidance
            </a>
          </li>
        </ul>
      }
      disclaimer="Bu hesaplama tahmini bir 1RM değeri sağlar. Gerçek maksimum performans; teknik, hareket deneyimi, ekipman ve günlük performans durumuna göre değişebilir."
    >
      <div className="grid gap-8 xl:grid-cols-2 xl:items-start">
        <CalculatorSection
          title="Set Bilgilerin"
          description="Tahmini maksimum gücünü hesaplamak için hareketini, yükünü ve tekrar sayını gir."
        >
          <CalculatorForm
            fields={oneRepMaxFields}
            values={values}
            errors={errors}
            onChange={handleFieldChange}
            onSubmit={handleSubmit}
          >
            <CTAButton type="submit" className="w-full">
              Tahmini 1RM Hesapla
            </CTAButton>
          </CalculatorForm>
        </CalculatorSection>

        {result ? (
          <CalculatorResultCard
            title="Performans Analizin"
            description="Epley formülü ile hesaplanan tahmini maksimum güç değerin."
            results={[
              {
                title: "Tahmini 1RM",
                value: result.estimatedOneRepMax.toFixed(1),
                unit: "kg",
                color: "gold",
                explanation: "Bu değer tahmini maksimum gücünü gösterir.",
              },
              {
                title: "Kullanılan Ağırlık",
                value: String(values.weight),
                unit: "kg",
                color: "neutral",
              },
              {
                title: "Tekrar Sayısı",
                value: String(values.repetitions),
                unit: "rep",
                color: "neutral",
              },
              {
                title: "Egzersiz",
                value: selectedExercise,
                color: "success",
              },
              {
                title: "Formül Yöntemi",
                value: "Epley",
                color: "neutral",
                explanation: "Ağırlık × (1 + tekrar / 30)",
              },
            ]}
          />
        ) : (
          <CalculatorSection
            title="Performans Analizin"
            description="Set bilgilerini girip hesapla butonuna bastığında tahmini 1RM değerin burada görünecek."
            className="min-h-full"
          >
            <p className="text-sm leading-6 text-neutral-500">
              Gerçek 1RM performansı teknik, deneyim, yorgunluk ve ekipman gibi faktörlerden etkilenebilir.
            </p>
          </CalculatorSection>
        )}
      </div>
    </CalculatorLayout>
  );
}
