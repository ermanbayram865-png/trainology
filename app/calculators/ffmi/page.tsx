"use client";

import { useState } from "react";

import CalculatorForm from "@/components/calculators/CalculatorForm";
import CalculatorLayout from "@/components/calculators/CalculatorLayout";
import CalculatorResultCard from "@/components/calculators/CalculatorResultCard";
import CalculatorSection from "@/components/calculators/CalculatorSection";
import CTAButton from "@/components/ui/CTAButton";
import {
  calculateFFMI,
  validateCalculatorField,
  type CalculatorField,
  type CalculatorFormValues,
  type CalculatorValidationErrors,
  type FFMIAnalysis,
} from "@/lib/calculators";

const ffmiFields: readonly CalculatorField[] = [
  {
    name: "height",
    label: "Boy",
    type: "number",
    unit: "cm",
    placeholder: "Örneğin 175",
    required: true,
    min: 100,
    max: 250,
    step: 1,
  },
  {
    name: "weight",
    label: "Kilo",
    type: "number",
    unit: "kg",
    placeholder: "Örneğin 75",
    required: true,
    min: 30,
    max: 300,
    step: 0.1,
  },
  {
    name: "bodyFatPercentage",
    label: "Vücut yağ oranı",
    type: "number",
    unit: "%",
    placeholder: "Örneğin 18",
    helperText: "Mümkünse aynı ölçüm yöntemiyle düzenli takip yap.",
    required: true,
    min: 3,
    max: 60,
    step: 0.1,
  },
];

const initialValues: CalculatorFormValues = {
  height: "",
  weight: "",
  bodyFatPercentage: "",
};

export default function FFMICalculatorPage() {
  const [values, setValues] = useState<CalculatorFormValues>(initialValues);
  const [errors, setErrors] = useState<CalculatorValidationErrors>({});
  const [result, setResult] = useState<FFMIAnalysis | null>(null);

  function handleFieldChange(name: string, value: CalculatorFormValues[string]) {
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: undefined }));
    setResult(null);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: CalculatorValidationErrors = {};

    for (const field of ffmiFields) {
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
      calculateFFMI({
        height: Number(values.height),
        weight: Number(values.weight),
        bodyFatPercentage: Number(values.bodyFatPercentage),
      }),
    );
  }

  return (
    <CalculatorLayout
      title="FFMI Hesaplayıcı"
      seoPath="/calculators/ffmi"
      description="Boyun, kilon ve yağ oranına göre yağsız vücut kütleni ve FFMI değerini incele."
      info={
        <>
          <p>
            FFMI, yağsız vücut kütlesini boya göre normalize eden bir vücut kompozisyon göstergesidir.
          </p>
          <p className="mt-3">
            BMI yalnızca kilo ve boyu değerlendirirken FFMI, yağsız kütleyi de dikkate alır. Bu nedenle vücut kompozisyonunu tek başına kilodan daha ayrıntılı incelemeye yardımcı olabilir.
          </p>
        </>
      }
      references={
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/7496846/"
              target="_blank"
              rel="noreferrer"
              className="text-[#C9A14A] underline-offset-4 hover:underline"
            >
              Kouri EM et al. — Fat-free mass index in users and nonusers of anabolic-androgenic steroids
            </a>
          </li>
          <li>
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/12806211/"
              target="_blank"
              rel="noreferrer"
              className="text-[#C9A14A] underline-offset-4 hover:underline"
            >
              Body composition assessment literature
            </a>
          </li>
        </ul>
      }
      disclaimer="FFMI, vücut kompozisyonunu değerlendirmek için kullanılan genel bir göstergedir. Sonuçlar ölçüm yöntemi, genetik faktörler ve antrenman geçmişine göre değişebilir."
    >
      <div className="grid gap-8 xl:grid-cols-2 xl:items-start">
        <CalculatorSection
          title="Bilgilerin"
          description="Vücut kompozisyon analizini oluşturmak için aşağıdaki alanları doldur."
        >
          <CalculatorForm
            fields={ffmiFields}
            values={values}
            errors={errors}
            onChange={handleFieldChange}
            onSubmit={handleSubmit}
          >
            <CTAButton type="submit" className="w-full">
              FFMI Değerini Hesapla
            </CTAButton>
          </CalculatorForm>
        </CalculatorSection>

        {result ? (
          <CalculatorResultCard
            title="Vücut Kompozisyon Analizin"
            description="FFMI değeri, yağsız vücut kütleni boyuna göre değerlendirir."
            results={[
              {
                title: "FFMI Değerin",
                value: result.ffmi.toFixed(1),
                color: "gold",
                explanation: `${result.classification} genel sınıflandırması. Kesin değerlendirme değildir.`,
              },
              {
                title: "Yağsız Vücut Kütlesi",
                value: result.leanBodyMass.toFixed(1),
                unit: "kg",
                color: "success",
                explanation: "Toplam ağırlıktan tahmini yağ kütlesi çıkarılarak hesaplanır.",
              },
              {
                title: "Yağ Kütlesi",
                value: result.fatMass.toFixed(1),
                unit: "kg",
                color: "warning",
                explanation: "Girdiğin yağ oranına göre tahmini değer.",
              },
              {
                title: "Boy",
                value: String(values.height),
                unit: "cm",
                color: "neutral",
              },
              {
                title: "Kilo",
                value: String(values.weight),
                unit: "kg",
                color: "neutral",
              },
              {
                title: "Vücut Yağ Oranı",
                value: String(values.bodyFatPercentage),
                unit: "%",
                color: "neutral",
              },
            ]}
          />
        ) : (
          <CalculatorSection
            title="Vücut Kompozisyon Analizin"
            description="Bilgilerini girip hesapla butonuna bastığında FFMI, yağsız kütle ve yağ kütlesi sonuçların burada görünecek."
            className="min-h-full"
          >
            <p className="text-sm leading-6 text-neutral-500">
              Genel FFMI sınıflandırması: düşük 18 altı, ortalama 18–22, iyi gelişmiş 22–25 ve yüksek 25 üzeri.
            </p>
          </CalculatorSection>
        )}
      </div>
    </CalculatorLayout>
  );
}
