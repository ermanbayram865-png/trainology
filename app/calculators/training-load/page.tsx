"use client";

import { useState } from "react";

import CalculatorForm from "@/components/calculators/CalculatorForm";
import CalculatorLayout from "@/components/calculators/CalculatorLayout";
import CalculatorResultCard from "@/components/calculators/CalculatorResultCard";
import CalculatorSection from "@/components/calculators/CalculatorSection";
import CTAButton from "@/components/ui/CTAButton";
import {
  calculateTrainingLoad,
  formatKilograms,
  type CalculatorField,
  type CalculatorFormValues,
  type CalculatorValidationErrors,
  type TrainingLoadCalculation,
} from "@/lib/calculators";

const trainingLoadFields: readonly CalculatorField[] = [
  {
    name: "oneRepMax",
    label: "1RM değeri",
    type: "number",
    unit: "kg",
    placeholder: "Örneğin 100",
    helperText: "Bildiğin veya tahmin ettiğin 1RM değerini gir.",
    required: true,
    min: 0.1,
    max: 1000,
    step: 0.1,
  },
  {
    name: "percentage",
    label: "Hedef yüzde",
    type: "number",
    unit: "%1RM",
    placeholder: "Örneğin 75",
    helperText:
      "%1–100 arasında, 0,5'lik adımlarla bir değer gir. Bu araç hangi yüzdeyi kullanman gerektiğine karar vermez.",
    required: true,
    min: 1,
    max: 100,
    step: 0.5,
  },
];

const presetPercentages = [50, 60, 70, 75, 80, 85, 90, 95] as const;

const initialValues: CalculatorFormValues = {
  oneRepMax: "",
  percentage: "",
};

function parseInput(value: CalculatorFormValues[string]): number | null {
  return typeof value === "string" && value.trim() !== "" ? Number(value) : null;
}

export default function TrainingLoadCalculatorPage() {
  const [values, setValues] = useState<CalculatorFormValues>(initialValues);
  const [errors, setErrors] = useState<CalculatorValidationErrors>({});
  const [result, setResult] = useState<TrainingLoadCalculation | null>(null);

  function handleFieldChange(name: string, value: CalculatorFormValues[string]) {
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: undefined }));
    setResult(null);
  }

  function handleReset() {
    setValues(initialValues);
    setErrors({});
    setResult(null);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const calculation = calculateTrainingLoad({
      oneRepMaxKg: parseInput(values.oneRepMax),
      percentage: parseInput(values.percentage),
    });

    if (calculation.type === "VALIDATION_ERROR") {
      setErrors(
        Object.fromEntries(
          calculation.errors.map((error) => [
            error.field === "oneRepMaxKg" ? "oneRepMax" : "percentage",
            error.message,
          ]),
        ),
      );
      setResult(null);
      return;
    }

    setErrors({});
    setResult(calculation);
  }

  return (
    <CalculatorLayout
      title="%1RM Antrenman Yükü"
      seoPath="/calculators/training-load"
      description="1RM değerinin seçtiğin yüzdesinin kaç kilogram ettiğini hesapla."
      info={
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Nasıl hesaplanıyor?</h2>
          <p>Antrenman yükü = 1RM × hedef yüzde / 100.</p>
          <p>
            Bu matematiksel dönüşüm hangi yüzdeyi seçmen gerektiğini belirlemez ve belirli bir
            tekrar sayısını garanti etmez.
          </p>
        </div>
      }
      references={
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/37792272/"
              target="_blank"
              rel="noreferrer"
              className="text-[#C9A14A] underline-offset-4 hover:underline"
            >
              %1RM ile tekrar kapasitesindeki bireysel ve egzersizler arası değişkenlik
            </a>
          </li>
          <li>
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/17194239/"
              target="_blank"
              rel="noreferrer"
              className="text-[#C9A14A] underline-offset-4 hover:underline"
            >
              Farklı egzersizlerde %1RM ve tekrar sayısı ilişkisi
            </a>
          </li>
        </ul>
      }
      disclaimer="Hesaplanan yük kişisel antrenman önerisi veya egzersize uygunluk değerlendirmesi değildir."
    >
      <div className="grid min-w-0 gap-8 xl:grid-cols-2 xl:items-start">
        <CalculatorSection
          title="Yük bilgilerin"
          description="1RM değerini ve dönüştürmek istediğin yüzdeyi gir."
        >
          <CalculatorForm
            fields={trainingLoadFields}
            values={values}
            errors={errors}
            onChange={handleFieldChange}
            onSubmit={handleSubmit}
          >
            <div>
              <p className="mb-3 text-sm font-medium text-neutral-300">Hazır yüzde seçenekleri</p>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                {presetPercentages.map((percentage) => (
                  <button
                    key={percentage}
                    type="button"
                    aria-pressed={values.percentage === String(percentage)}
                    onClick={() => handleFieldChange("percentage", String(percentage))}
                    className="min-h-11 rounded-lg border border-zinc-700 bg-zinc-900 px-2 text-sm font-medium text-neutral-200 transition hover:border-[#C9A14A] hover:text-[#C9A14A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A14A] aria-pressed:border-[#C9A14A] aria-pressed:bg-[#C9A14A]/10 aria-pressed:text-[#D6B25E]"
                  >
                    %{percentage}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs leading-5 text-neutral-500">
                Bunlar yalnızca hızlı giriş seçenekleridir; antrenman önerisi değildir.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <CTAButton type="submit" className="w-full">
                Antrenman yükünü hesapla
              </CTAButton>
              <CTAButton type="button" variant="secondary" className="w-full" onClick={handleReset}>
                Sıfırla
              </CTAButton>
            </div>
          </CalculatorForm>
        </CalculatorSection>

        <div aria-live="polite" aria-atomic="true" className="min-w-0">
          {result ? (
            <div className="space-y-5">
              <CalculatorResultCard
                title="Hesaplanan yük"
                description="Seçtiğin yüzdeye karşılık gelen yaklaşık çalışma ağırlığı."
                results={[
                  {
                    title: "Yaklaşık antrenman yükü",
                    value: formatKilograms(result.rawLoadKg, 2),
                    unit: "kg",
                    color: "gold",
                  },
                  {
                    title: "Kullanılan 1RM",
                    value: formatKilograms(result.inputOneRepMaxKg, 1),
                    unit: "kg",
                    color: "neutral",
                  },
                  {
                    title: "Kullanılan yüzde",
                    value: `%${new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 1 }).format(result.percentage)}`,
                    color: "neutral",
                  },
                ]}
              />

              <div className="rounded-2xl border border-white/10 bg-white/[.025] p-5">
                <p className="text-sm leading-6 text-neutral-300">
                  {formatKilograms(result.inputOneRepMaxKg, 1)} kg × %{new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 1 }).format(result.percentage)} = {formatKilograms(result.rawLoadKg, 2)} kg
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-400">
                  {result.warnings.map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                  <li>Bu araç tekrar sayısı reçetesi vermez.</li>
                </ul>
              </div>

              <CTAButton href="/calculators/1rm" variant="secondary" className="w-full">
                1RM&apos;ini bilmiyor musun? 1RM Hesaplayıcı ile tahmin et →
              </CTAButton>
            </div>
          ) : (
            <CalculatorSection title="Hesaplanan yük" className="min-h-full">
              <p className="text-sm leading-6 text-neutral-400">
                1RM değerini ve kullanmak istediğin yüzdeyi gir.
              </p>
            </CalculatorSection>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}
