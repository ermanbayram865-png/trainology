"use client";

import { useEffect, useState } from "react";

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
  MACRO_ACTIVITY_LEVELS,
  validateCalculatorField,
  type CalculatorField,
  type CalculatorFormValues,
  type CalculatorValidationErrors,
  type Goal,
  type MacroActivityLevel,
  type MacroDistribution,
} from "@/lib/calculators";
import {
  readEnergyLabHandoff,
  type EnergyLabMacroHandoff,
} from "@/lib/energy-lab/handoff";

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
    name: "weight",
    label: "Kilo",
    type: "number",
    unit: "kg",
    placeholder: "Örneğin 70",
    helperText:
      "Protein önerisi, Protein Hesaplayıcı ile aynı kilo başına kuralları kullanır.",
    required: true,
    min: 25,
    max: 400,
    step: 0.1,
  },
  {
    name: "goal",
    label: "Hedefin",
    type: "radio",
    options: CALORIE_GOALS,
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
  weight: "",
  goal: DEFAULT_CALORIE_GOAL,
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
  const [energyLabHandoff, setEnergyLabHandoff] =
    useState<EnergyLabMacroHandoff | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    if (searchParams.get("source") !== "energy-lab") {
      return;
    }

    try {
      const handoff = readEnergyLabHandoff(window.sessionStorage);

      if (!handoff) {
        return;
      }

      let cancelled = false;

      queueMicrotask(() => {
        if (cancelled) return;

        setEnergyLabHandoff(handoff);
        setValues((currentValues) => ({
          ...currentValues,
          calories: String(handoff.displayTargetKcal),
          weight: String(handoff.weightKg),
          goal: handoff.goal,
        }));
      });

      return () => {
        cancelled = true;
      };
    } catch {
      // Session storage can be unavailable in restricted browser contexts.
    }
  }, []);

  function handleFieldChange(name: string, value: CalculatorFormValues[string]) {
    const handoffChanged =
      energyLabHandoff &&
      ((name === "calories" &&
        String(value) !== String(energyLabHandoff.displayTargetKcal)) ||
        (name === "weight" &&
          String(value) !== String(energyLabHandoff.weightKg)) ||
        (name === "goal" && value !== energyLabHandoff.goal));

    if (handoffChanged) {
      setEnergyLabHandoff(null);
    }

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

    const caloriesForCalculation = energyLabHandoff
      ? energyLabHandoff.rawTargetKcal
      : Number(values.calories);

    try {
      setResult(
        calculateMacroDistribution({
          calories: caloriesForCalculation,
          weight: Number(values.weight),
          goal: values.goal as Goal,
          activityLevel: values.activityLevel as MacroActivityLevel,
        }),
      );
    } catch (error) {
      setResult(null);
      setErrors((currentErrors) => ({
        ...currentErrors,
        calories:
          error instanceof RangeError
            ? error.message
            : "Makro dağılımı bu bilgilerle hesaplanamadı.",
      }));
    }
  }

  const selectedGoal = getOptionLabel(CALORIE_GOALS, String(values.goal));
  const selectedActivity = getOptionLabel(
    MACRO_ACTIVITY_LEVELS,
    String(values.activityLevel),
  );

  return (
    <CalculatorLayout
      title="Makro Planlayıcı"
      seoPath="/calculators/macro"
      description="Günlük kalori hedefin, vücut ağırlığın ve amacın için önerilen makro dağılımını incele."
      info={
        <>
          <p>
            Makrolar protein, karbonhidrat ve yağdan oluşur. Protein doku onarımını destekler; karbonhidrat antrenman performansına enerji sağlar; yağlar hormon ve genel sağlık için gereklidir.
          </p>
          <p className="mt-3">
            Protein miktarı, Protein Hesaplayıcı ile aynı kilo başına protein motorundan gelir. Yağ aktiviteye göre başlangıç payı olarak ayrılır; karbonhidrat kalan enerjiden hesaplanır.
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
          description="Makro önerini oluşturmak için günlük kalori hedefini, kilonu ve aktivite düzeyini gir."
        >
          {energyLabHandoff && (
            <div
              role="status"
              className="mb-8 rounded-2xl border border-[#C9A14A]/25 bg-[#C9A14A]/[0.07] p-4 text-sm leading-6 text-neutral-300"
            >
              <p className="font-semibold text-[#D6B25E]">
                Energy Lab hedefin aktarıldı
              </p>
              <p className="mt-1">
                Energy Lab’den kalori hedefin, hedef türün ve kilo bilgin aktarıldı.
                Formda yaklaşık{" "}
                {energyLabHandoff.displayTargetKcal.toLocaleString("tr-TR")} kcal/gün
                gösterilir. Makro hesabı, Energy Lab’in yuvarlanmamış iç hedefiyle
                yapılır.
              </p>
            </div>
          )}

          <CalculatorForm
            fields={macroFields}
            values={values}
            errors={errors}
            onChange={handleFieldChange}
            onSubmit={handleSubmit}
          >
            <CTAButton type="submit" className="w-full">
              Makrolarını Planla
            </CTAButton>
          </CalculatorForm>
        </CalculatorSection>

        {result ? (
          <CalculatorResultCard
            title="Günlük Makro Dağılımın"
            description="Protein önerisi ortak Protein Hesaplayıcı motorundan, diğer makrolar kalan enerji dağılımından oluşturulur."
            results={[
              {
                title: "Protein",
                value: result.protein,
                unit: "g / gün",
                color: "gold",
                explanation: `${result.proteinPerKg.toFixed(1)} g/kg/gün · yaklaşık %${result.proteinPercentage} enerji.`,
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
                value: energyLabHandoff
                  ? energyLabHandoff.displayTargetKcal.toLocaleString("tr-TR")
                  : String(values.calories),
                unit: "kcal / gün",
                color: "neutral",
                explanation: energyLabHandoff
                  ? "Energy Lab'de gösterilen yuvarlanmış hedef. Hesaplama aktarımın tam hassasiyetli iç değeriyle yapılır."
                  : "Günlük makro dağılımı için kullanılan değer.",
              },
              {
                title: "Kullanılan Yaklaşım",
                value: "Ortak protein motoru",
                color: "neutral",
                explanation: `${selectedGoal} hedefi ve ${selectedActivity.toLocaleLowerCase("tr-TR")} aktivite düzeyi dikkate alınır.`,
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
