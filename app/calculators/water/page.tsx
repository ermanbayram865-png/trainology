"use client";

import { useState } from "react";

import CalculatorForm from "@/components/calculators/CalculatorForm";
import CalculatorLayout from "@/components/calculators/CalculatorLayout";
import CalculatorResultCard from "@/components/calculators/CalculatorResultCard";
import CalculatorSection from "@/components/calculators/CalculatorSection";
import CTAButton from "@/components/ui/CTAButton";
import {
  calculateWaterRequirement,
  EFSA_ADULT_REFERENCE_CATEGORIES,
  SCOPE_RISK_OPTIONS,
  validateCalculatorField,
  type CalculatorField,
  type CalculatorFormValues,
  type CalculatorValidationErrors,
  type EfsaAdultReferenceCategory,
  type WaterRequirement,
} from "@/lib/calculators";

const waterFields: readonly CalculatorField[] = [
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
    name: "efsaAdultReferenceCategory",
    label: "EFSA yetişkin referans kategorisi",
    type: "select",
    helperText:
      "EFSA, yetişkin kadın ve erkek referans kategorileri için farklı toplam su AI değerleri yayımlar. Bu seçim yalnız hangi EFSA referansının gösterileceğini belirler.",
    options: EFSA_ADULT_REFERENCE_CATEGORIES,
    required: true,
  },
  {
    name: "scopeRisk",
    label: "Bu genel su alımı referansının kapsamı dışında bir durum var mı?",
    type: "radio",
    helperText:
      "Gebelik/emzirme; böbrek veya kalp hastalığı; sıvı kısıtlaması; sıvı dengesini etkileyen ilaç kullanımı veya akut kusma/ishal/ateş.",
    options: SCOPE_RISK_OPTIONS,
    required: true,
  },
];

const initialValues: CalculatorFormValues = {
  ageYears: "",
  efsaAdultReferenceCategory: "",
  scopeRisk: "",
};

function liters(value: number) {
  return value.toLocaleString("tr-TR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

export default function WaterCalculatorPage() {
  const [values, setValues] = useState<CalculatorFormValues>(initialValues);
  const [errors, setErrors] = useState<CalculatorValidationErrors>({});
  const [result, setResult] = useState<WaterRequirement | null>(null);

  function handleFieldChange(name: string, value: CalculatorFormValues[string]) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setResult(null);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: CalculatorValidationErrors = {};

    for (const field of waterFields) {
      const error = validateCalculatorField(field, values[field.name]);
      if (error) nextErrors[field.name] = error;
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const nextResult = calculateWaterRequirement({
      ageYears: Number(values.ageYears),
      efsaAdultReferenceCategory:
        values.efsaAdultReferenceCategory as EfsaAdultReferenceCategory,
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
            text: "Bu sürüm yalnız Trainology’nin yetişkin kullanıcı kapsamı için hazırlanmıştır.",
          }
        : {
            title: "Genel su alımı referansının kapsamı dışında",
            text: "Belirttiğiniz durumda sıvı dengesi sağlık durumu, ilaçlar veya akut kayıplardan etkilenebilir. Bu nedenle bu genel araç sayısal sonuç üretmez.",
          }
      : null;

  return (
    <CalculatorLayout
      title="Toplam Su Alımı Referansı"
      seoPath="/calculators/water"
      description="EFSA’nın sağlıklı yetişkinler için toplam su yeterli alım referansını incele."
      info={
        <div className="space-y-3">
          <p>Bu araç kişisel hidrasyon ihtiyacını hesaplamaz; seçtiğin EFSA yetişkin kategorisinin nüfus düzeyindeki toplam su referansını gösterir.</p>
          <p>Uzun süreli veya yüksek terlemeli egzersizde bu günlük referans egzersiz sıvı planının yerine geçmez. Aşırı sıvı tüketimi de riskli olabilir.</p>
        </div>
      }
      references={
        <div className="space-y-3">
          <p>EFSA NDA (2010) · NATA/McDermott et al. (2017) · EAH Consensus/Hew-Butler et al. (2015)</p>
          <details>
            <summary className="cursor-pointer font-medium text-[#C9A14A]">Kaynak ayrıntılarını aç</summary>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li><a className="underline-offset-4 hover:underline" href="https://doi.org/10.2903/j.efsa.2010.1459" target="_blank" rel="noreferrer">EFSA NDA — DOI: 10.2903/j.efsa.2010.1459</a></li>
              <li><a className="underline-offset-4 hover:underline" href="https://doi.org/10.4085/1062-6050-52.9.02" target="_blank" rel="noreferrer">McDermott et al. — DOI: 10.4085/1062-6050-52.9.02</a></li>
              <li><a className="underline-offset-4 hover:underline" href="https://doi.org/10.1097/JSM.0000000000000221" target="_blank" rel="noreferrer">Hew-Butler et al. — DOI: 10.1097/JSM.0000000000000221</a></li>
            </ul>
          </details>
        </div>
      }
      disclaimer="Bu referans kişisel kesin ihtiyaç veya yalnız içmeniz gereken saf su miktarı değildir."
    >
      <div className="grid gap-8 xl:grid-cols-2 xl:items-start">
        <CalculatorSection title="Bilgilerin" description="Referans kategorisini ve kapsam durumunu açıkça seç.">
          <CalculatorForm fields={waterFields} values={values} errors={errors} onChange={handleFieldChange} onSubmit={handleSubmit}>
            <CTAButton type="submit" className="w-full">Toplam Su Referansını Gör</CTAButton>
          </CalculatorForm>
        </CalculatorSection>

        {result?.type === "TOTAL_WATER_AI" ? (
          <CalculatorResultCard
            title="Toplam Su Alımı Referansı (AI)"
            description="EFSA’nın sağlıklı yetişkinler için nüfus düzeyindeki yeterli alım referansıdır. Yiyeceklerdeki suyu, içme suyunu ve diğer içeceklerden gelen suyu birlikte kapsar; kişisel kesin ihtiyaç veya yalnız içmeniz gereken saf su miktarı değildir."
            results={[{
              title: "Toplam su alımı referansı",
              value: liters(result.litersPerDay),
              unit: "L/gün",
              color: "gold",
              explanation: "Yiyecek, içme suyu ve diğer içeceklerden gelen toplam suyu kapsar.",
            }]}
          />
        ) : blockedResult ? (
          <CalculatorSection title={blockedResult.title} description={blockedResult.text} className="border-amber-300/30">
            <p className="text-sm leading-6 text-neutral-500">Sayısal sonuç gösterilmedi.</p>
          </CalculatorSection>
        ) : (
          <CalculatorSection title="Toplam Su Alımı Referansı (AI)" description="Bilgilerini girdikten sonra yetişkin referansı burada görünecek." className="min-h-full">
            <p className="text-sm leading-6 text-neutral-500">Başlangıçta hiçbir referans kategorisi seçili değildir.</p>
          </CalculatorSection>
        )}
      </div>
    </CalculatorLayout>
  );
}
