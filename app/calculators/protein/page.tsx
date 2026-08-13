"use client";

import { useState } from "react";

import CalculatorForm from "@/components/calculators/CalculatorForm";
import CalculatorLayout from "@/components/calculators/CalculatorLayout";
import CalculatorResultCard from "@/components/calculators/CalculatorResultCard";
import CalculatorSection from "@/components/calculators/CalculatorSection";
import CTAButton from "@/components/ui/CTAButton";
import {
  calculateProteinRequirement,
  PROTEIN_GOALS,
  PROTEIN_TRAINING_PROFILES,
  SCOPE_RISK_OPTIONS,
  validateCalculatorField,
  type CalculatorField,
  type CalculatorFormValues,
  type CalculatorResult,
  type CalculatorValidationErrors,
  type ProteinGoal,
  type ProteinRequirement,
  type ProteinTrainingProfile,
} from "@/lib/calculators";

const proteinFields: readonly CalculatorField[] = [
  {
    name: "ageYears",
    label: "Yaş",
    type: "number",
    unit: "yıl",
    placeholder: "Örneğin 30",
    required: true,
    min: 0,
    max: 120,
    step: 1,
  },
  {
    name: "weightKg",
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
    name: "trainingProfile",
    label: "Antrenman profili",
    type: "radio",
    options: PROTEIN_TRAINING_PROFILES,
    required: true,
  },
  {
    name: "goal",
    label: "Hedef (isteğe bağlı)",
    type: "select",
    helperText: "Hedef seçimi tek başına protein katsayısını değiştirmez.",
    options: PROTEIN_GOALS,
  },
  {
    name: "scopeRisk",
    label: "Bu genel protein hesaplayıcısının kapsamı dışında bir durum var mı?",
    type: "radio",
    helperText:
      "Gebelik/emzirme; böbrek veya karaciğer hastalığı; obezite tanısı; klinik protein kısıtlaması veya klinik beslenme tedavisi; yeme bozukluğu ya da REDs şüphesi.",
    options: SCOPE_RISK_OPTIONS,
    required: true,
  },
];

const initialValues: CalculatorFormValues = {
  ageYears: "",
  weightKg: "",
  trainingProfile: "",
  goal: "",
  scopeRisk: "",
};

function roundedGrams(value: number) {
  return Math.round(value).toLocaleString("tr-TR");
}

function resultMetrics(result: ProteinRequirement): readonly CalculatorResult[] {
  if (result.type === "PRI_REFERENCE") {
    return [
      {
        title: result.label,
        value: `Yaklaşık ${roundedGrams(result.dailyGrams)}`,
        unit: "g/gün",
        color: "gold",
        explanation:
          "EFSA’nın sağlıklı yetişkinler için nüfus düzeyindeki protein yeterlilik referansıdır. Kişisel optimum veya kesin hedef değildir.",
      },
      {
        title: "Kullanılan referans",
        value: "0,83",
        unit: "g/kg/gün",
        color: "neutral",
      },
    ];
  }

  if (result.type === "PRACTICAL_RANGE") {
    const isOlderAdultRange = result.lowGPerKg === 1;
    return [
      {
        title: result.label,
        value: `Yaklaşık ${roundedGrams(result.lowDailyGrams)}–${roundedGrams(result.highDailyGrams)}`,
        unit: "g/gün",
        color: "gold",
        explanation: isOlderAdultRange
          ? "Sağlıklı ileri yaş için kılavuz temelli pratik aralıktır. Gereksinim fiziksel aktivite ve sağlık durumuna göre değişebilir."
          : "Sağlıklı ve düzenli egzersiz yapan yetişkinler için spor beslenmesi literatürüyle uyumlu pratik aralıktır.",
      },
      {
        title: "Kullanılan aralık",
        value: `${result.lowGPerKg.toLocaleString("tr-TR")}–${result.highGPerKg.toLocaleString("tr-TR")}`,
        unit: "g/kg/gün",
        color: "neutral",
        explanation:
          result.certainty === "conditional" && !isOlderAdultRange
            ? "Bu sonuç sağlıklı ve egzersiz yapan yetişkinler için koşullu bir pratik aralıktır; ileri yaşın kesin gereksinimi değildir."
            : undefined,
      },
    ];
  }

  if (result.type === "RESISTANCE_RANGE") {
    return [
      {
        title: "Direnç antrenmanı için pratik aralık",
        value: `Yaklaşık ${roundedGrams(result.lowDailyGrams)}–${roundedGrams(result.highDailyGrams)}`,
        unit: "g/gün",
        color: "gold",
        explanation:
          "Sağlıklı ve düzenli egzersiz yapan yetişkinler için spor beslenmesi literatürüyle uyumlu pratik aralıktır.",
      },
      {
        title: result.anchorLabel,
        value: `Yaklaşık ${roundedGrams(result.anchorDailyGrams)}`,
        unit: "g/gün",
        color: "success",
        explanation:
          "Bu başlangıç noktası kişisel optimum, minimum veya zorunlu eşik değildir.",
      },
      {
        title: "Kullanılan aralık",
        value: "1,4–2,0",
        unit: "g/kg/gün",
        color: "neutral",
        explanation:
          result.certainty === "conditional"
            ? "Bu sonuç sağlıklı ve egzersiz yapan yetişkinler için koşullu bir pratik aralıktır; ileri yaşın kesin gereksinimi değildir."
            : undefined,
      },
    ];
  }

  return [];
}

export default function ProteinCalculatorPage() {
  const [values, setValues] = useState<CalculatorFormValues>(initialValues);
  const [errors, setErrors] = useState<CalculatorValidationErrors>({});
  const [result, setResult] = useState<ProteinRequirement | null>(null);

  function handleFieldChange(name: string, value: CalculatorFormValues[string]) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setResult(null);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: CalculatorValidationErrors = {};

    for (const field of proteinFields) {
      const error = validateCalculatorField(field, values[field.name]);
      if (error) nextErrors[field.name] = error;
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const nextResult = calculateProteinRequirement({
      ageYears: Number(values.ageYears),
      weightKg: Number(values.weightKg),
      trainingProfile: values.trainingProfile as ProteinTrainingProfile,
      goal: values.goal ? (values.goal as ProteinGoal) : undefined,
      scopeRisk: values.scopeRisk === "true",
    });

    if (nextResult.type === "VALIDATION_ERROR") {
      setErrors({ [nextResult.field]: nextResult.message });
      return;
    }

    setResult(nextResult);
  }

  const blockedResult =
    result?.type === "NO_NUMERIC_RESULT"
      ? result.reason === "under_18"
        ? {
            title: "Bu hesaplayıcı yetişkinler için tasarlanmıştır.",
            text: "18 yaş altında protein referansları yaşa ve gelişim dönemine göre değiştiği için bu araç sayısal sonuç üretmez.",
          }
        : {
            title: "Genel hesaplayıcının kapsamı dışında",
            text: "Belirttiğiniz durumda protein hedefi sağlık durumu ve bireysel koşullara göre değişebilir. Bu nedenle bu genel araç sayısal hedef üretmez.",
          }
      : null;

  return (
    <CalculatorLayout
      title="Protein İhtiyacı"
      seoPath="/calculators/protein"
      description="Yaş, vücut ağırlığı ve antrenman profiline göre yetişkinler için protein referansını veya pratik aralığı incele."
      info={
        <p>
          Hedef seçimi tek başına katsayıyı değiştirmez. Sonuçlar sağlıklı yetişkinler için nüfus referansı veya koşula bağlı pratik aralık olarak sunulur.
        </p>
      }
      references={
        <div className="space-y-3">
          <p>EFSA NDA (2012) · ISSN/Jäger et al. (2017) · Morton et al. (2018) · ESPEN/Volkert et al. (2022)</p>
          <details>
            <summary className="cursor-pointer font-medium text-[#C9A14A]">Kaynak ayrıntılarını aç</summary>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li><a className="underline-offset-4 hover:underline" href="https://doi.org/10.2903/j.efsa.2012.2557" target="_blank" rel="noreferrer">EFSA NDA — DOI: 10.2903/j.efsa.2012.2557</a></li>
              <li><a className="underline-offset-4 hover:underline" href="https://doi.org/10.1186/s12970-017-0177-8" target="_blank" rel="noreferrer">Jäger et al. — DOI: 10.1186/s12970-017-0177-8</a></li>
              <li><a className="underline-offset-4 hover:underline" href="https://doi.org/10.1136/bjsports-2017-097608" target="_blank" rel="noreferrer">Morton et al. — DOI: 10.1136/bjsports-2017-097608</a></li>
              <li><a className="underline-offset-4 hover:underline" href="https://doi.org/10.1016/j.clnu.2022.01.024" target="_blank" rel="noreferrer">Volkert et al. — DOI: 10.1016/j.clnu.2022.01.024</a></li>
            </ul>
          </details>
        </div>
      }
      disclaimer="Bu araç yalnız genel yetişkin referansları sunar; kişisel optimumu veya klinik protein hedefini belirlemez."
    >
      <div className="grid gap-8 xl:grid-cols-2 xl:items-start">
        <CalculatorSection title="Bilgilerin" description="Tüm zorunlu alanları açıkça yanıtla.">
          <CalculatorForm fields={proteinFields} values={values} errors={errors} onChange={handleFieldChange} onSubmit={handleSubmit}>
            <CTAButton type="submit" className="w-full">Protein Referansını Gör</CTAButton>
          </CalculatorForm>
        </CalculatorSection>

        {result && result.type !== "NO_NUMERIC_RESULT" && result.type !== "VALIDATION_ERROR" ? (
          <CalculatorResultCard title="Protein Sonucun" description="Gram değerleri ekranda en yakın tam sayıya yuvarlanmıştır." results={resultMetrics(result)} />
        ) : blockedResult ? (
          <CalculatorSection title={blockedResult.title} description={blockedResult.text} className="border-amber-300/30" >
            <p className="text-sm leading-6 text-neutral-500">Sayısal sonuç gösterilmedi.</p>
          </CalculatorSection>
        ) : (
          <CalculatorSection title="Protein Sonucun" description="Bilgilerini girdikten sonra uygun referans veya pratik aralık burada görünecek." className="min-h-full">
            <p className="text-sm leading-6 text-neutral-500">Sonuç yaklaşık değerlerle ve kapsam bilgisiyle birlikte sunulur.</p>
          </CalculatorSection>
        )}
      </div>
    </CalculatorLayout>
  );
}
