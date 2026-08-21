"use client";

import { useState } from "react";

import CalculatorForm from "@/components/calculators/CalculatorForm";
import CalculatorLayout from "@/components/calculators/CalculatorLayout";
import CalculatorResultCard from "@/components/calculators/CalculatorResultCard";
import CalculatorSection from "@/components/calculators/CalculatorSection";
import CTAButton from "@/components/ui/CTAButton";
import {
  calculateOneRepMax,
  formatKilograms,
  type CalculatorField,
  type CalculatorFormValues,
  type CalculatorValidationErrors,
  type OneRepMaxCalculation,
} from "@/lib/calculators";

const oneRepMaxFields: readonly CalculatorField[] = [
  {
    name: "weight",
    label: "Kaldırılan ağırlık",
    type: "number",
    unit: "kg",
    placeholder: "Örneğin 100",
    helperText: "Set boyunca kullandığın toplam ağırlığı gir.",
    required: true,
    min: 0.1,
    max: 1000,
    step: 0.1,
  },
  {
    name: "repetitions",
    label: "Tekrar sayısı",
    type: "number",
    placeholder: "Örneğin 5",
    helperText:
      "1–10 arasında tamamladığın tekrar sayısını gir. Daha düşük tekrar sayıları genellikle daha güvenilir tahmin sağlar.",
    required: true,
    min: 1,
    max: 10,
    step: 1,
  },
];

const initialValues: CalculatorFormValues = {
  weight: "",
  repetitions: "",
};

function parseInput(value: CalculatorFormValues[string]): number | null {
  return typeof value === "string" && value.trim() !== "" ? Number(value) : null;
}

export default function OneRepMaxCalculatorPage() {
  const [values, setValues] = useState<CalculatorFormValues>(initialValues);
  const [errors, setErrors] = useState<CalculatorValidationErrors>({});
  const [result, setResult] = useState<OneRepMaxCalculation | null>(null);

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

    const calculation = calculateOneRepMax({
      weightKg: parseInput(values.weight),
      repetitions: parseInput(values.repetitions),
    });

    if (calculation.type === "VALIDATION_ERROR") {
      setErrors(
        Object.fromEntries(
          calculation.errors.map((error) => [
            error.field === "weightKg" ? "weight" : "repetitions",
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
      title="1RM Hesaplayıcı"
      seoPath="/calculators/1rm"
      description="Kaldırdığın ağırlık ve tamamladığın tekrar sayısından yaklaşık tek tekrar maksimumunu tahmin et."
      info={
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Nasıl hesaplanıyor?</h2>
          <p>
            1 tekrarda kaldırılan yük doğrudan gösterilir. 2–10 tekrar için Lombardi
            denklemi kullanılır: 1RM = ağırlık × tekrar^0,10.
          </p>
          <p>
            Bu bir tahmindir; farklı denklemlerin doğruluğu egzersiz ve popülasyona göre
            değişebilir. Lombardi, Trainology&apos;nin v1 ürün yöntemidir ve evrensel olarak en
            doğru formül olduğu iddia edilmez.
          </p>
        </div>
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
              Tekrar temelli 1RM tahmini ve tekrar sınırı
            </a>
          </li>
          <li>
            <a
              href="https://journal.iusca.org/index.php/Journal/article/view/327"
              target="_blank"
              rel="noreferrer"
              className="text-[#C9A14A] underline-offset-4 hover:underline"
            >
              1RM denklemlerinin güncel karşılaştırması
            </a>
          </li>
        </ul>
      }
      disclaimer="Bu araç egzersize uygunluk değerlendirmesi veya kişisel antrenman reçetesi değildir. Sonuç, maksimal deneme yapman gerektiği anlamına gelmez."
    >
      <div className="grid min-w-0 gap-8 xl:grid-cols-2 xl:items-start">
        <CalculatorSection
          title="Set bilgilerin"
          description="Tahmin için kaldırdığın toplam ağırlığı ve tamamladığın tekrar sayısını gir."
        >
          <CalculatorForm
            fields={oneRepMaxFields}
            values={values}
            errors={errors}
            onChange={handleFieldChange}
            onSubmit={handleSubmit}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <CTAButton type="submit" className="w-full">
                Hesapla
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
                title="Tahmini 1RM"
                description={
                  result.calculationMethod === "direct"
                    ? "Tek tekrar girişi doğrudan kaldırılan yüke eşitlendi."
                    : "Lombardi denklemiyle hesaplanan yaklaşık 1RM değeri."
                }
                results={[
                  {
                    title: "Tahmini 1RM",
                    value: formatKilograms(result.rawEstimatedOneRepMaxKg, 1),
                    unit: "kg",
                    color: "gold",
                    explanation: "Görünür sonuç bir ondalık basamağa yuvarlanır.",
                  },
                  {
                    title: "Girdi özeti",
                    value: `${formatKilograms(result.inputWeightKg, 1)} kg × ${result.repetitions} tekrar`,
                    color: "neutral",
                  },
                  {
                    title: "Yöntem",
                    value: result.calculationMethod === "direct" ? "Doğrudan yük" : "Lombardi",
                    color: "neutral",
                    explanation:
                      result.calculationMethod === "direct"
                        ? "1 tekrar için formül uygulanmaz."
                        : "Ağırlık × tekrar^0,10",
                  },
                ]}
              />

              <div className="rounded-2xl border border-amber-300/20 bg-amber-300/[.04] p-5">
                <h3 className="font-semibold text-amber-200">Belirsizlik ve güvenlik</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-300">
                  {result.warnings.map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                  <li>Bu sonuç egzersize uygunluk değerlendirmesi veya kişisel antrenman reçetesi değildir.</li>
                </ul>
              </div>

              <CTAButton href="/calculators/training-load" variant="secondary" className="w-full">
                Bu 1RM ile antrenman ağırlığını hesapla →
              </CTAButton>
            </div>
          ) : (
            <CalculatorSection title="Tahmini 1RM" className="min-h-full">
              <p className="text-sm leading-6 text-neutral-400">
                Ağırlık ve tekrar sayısını girerek tahmini 1RM değerini hesaplayabilirsin.
              </p>
            </CalculatorSection>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}
