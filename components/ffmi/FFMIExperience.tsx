"use client";

import { ArrowRight, Check, ChevronDown, Info, Pencil, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  FieldError,
  MethodologyDisclosure,
  ReferencePanel,
  referenceInputClasses,
} from "@/components/calculators/ReferenceToolUI";
import {
  calculateFFMI,
  formatFFMIDisplayValue,
  type BodyFatMeasurementMethod,
  type FFMIReferenceSex,
  type FFMISuccess,
} from "@/lib/calculators";
import FFMIReferenceComparator from "@/components/ffmi/FFMIReferenceComparator";

type FFMIForm = {
  heightCm: string;
  weightKg: string;
  bodyFatPercentage: string;
  ageYears: string;
  referenceSex: FFMIReferenceSex | "";
  measurementMethod: BodyFatMeasurementMethod | "";
  standardAdultScope: boolean;
};

const initialForm: FFMIForm = {
  heightCm: "",
  weightKg: "",
  bodyFatPercentage: "",
  ageYears: "",
  referenceSex: "",
  measurementMethod: "",
  standardAdultScope: false,
};

const measurementOptions = [
  {
    value: "dexa",
    label: "DEXA Taraması",
    description: "Profesyonel vücut kompozisyon ölçümü",
  },
  {
    value: "bia_smart_scale",
    label: "Akıllı Tartı / BIA",
    description: "Elektriksel ölçüm yapan tartı veya cihaz",
  },
  {
    value: "skinfold",
    label: "Deri Kıvrımı Ölçümü",
    description: "Kaliper ile yapılan ölçüm",
  },
  {
    value: "visual_estimate",
    label: "Görsel Tahmin",
    description: "Görünüşe bakarak yaklaşık tahmin",
  },
  {
    value: "other_unknown",
    label: "Diğer / Bilmiyorum",
    description: "Ölçüm yönteminden emin değilsen",
  },
] as const satisfies readonly {
  value: BodyFatMeasurementMethod;
  label: string;
  description: string;
}[];

function validateForm(form: FFMIForm) {
  const errors: Record<string, string> = {};
  const heightCm = Number(form.heightCm);
  const weightKg = Number(form.weightKg);
  const bodyFatPercentage = Number(form.bodyFatPercentage);
  const ageYears = Number(form.ageYears);

  if (!form.heightCm || !Number.isFinite(heightCm) || heightCm < 100 || heightCm > 250) {
    errors.heightCm = "Boy 100–250 cm arasında olmalıdır.";
  }
  if (!form.weightKg || !Number.isFinite(weightKg) || weightKg < 30 || weightKg > 300) {
    errors.weightKg = "Kilo 30–300 kg arasında olmalıdır.";
  }
  if (
    !form.bodyFatPercentage ||
    !Number.isFinite(bodyFatPercentage) ||
    bodyFatPercentage < 3 ||
    bodyFatPercentage > 60
  ) {
    errors.bodyFatPercentage = "Vücut yağ oranı %3–60 arasında olmalıdır.";
  }
  if (form.ageYears && (!Number.isInteger(ageYears) || ageYears < 18)) {
    errors.ageYears = "Yaşı 18 veya üzeri tam yıl olarak gir.";
  }
  if (form.ageYears && !form.referenceSex) {
    errors.referenceSex = "Araştırma karşılaştırması için bir referans seç.";
  }
  if (!form.ageYears && form.referenceSex) {
    errors.ageYears = "Araştırma karşılaştırması için yaşını gir.";
  }
  if (!form.measurementMethod) {
    errors.measurementMethod = "Vücut yağ oranını nasıl ölçtüğünü seç.";
  }
  if (!form.standardAdultScope) {
    errors.standardAdultScope = "Sayısal sonuç için genel yetişkin kapsamını onayla.";
  }

  return { errors, heightCm, weightKg, bodyFatPercentage, ageYears };
}

export default function FFMIExperience() {
  const [form, setForm] = useState<FFMIForm>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<FFMISuccess | null>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (result) resultHeadingRef.current?.focus();
  }, [result]);

  function updateForm<K extends keyof FFMIForm>(key: K, value: FFMIForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateForm(form);
    setErrors(validation.errors);

    if (Object.keys(validation.errors).length > 0) return;

    const nextResult = calculateFFMI({
      heightCm: validation.heightCm,
      weightKg: validation.weightKg,
      bodyFatPercentage: validation.bodyFatPercentage,
      measurementMethod: form.measurementMethod as BodyFatMeasurementMethod,
      standardAdultScope: form.standardAdultScope,
    });

    if (nextResult.type !== "SUCCESS") {
      setErrors({ form: "Bu bilgilerle sayısal sonuç üretilemedi." });
      return;
    }

    setResult(nextResult);
  }

  function startNewCalculation() {
    setForm(initialForm);
    setErrors({});
    setResult(null);
  }

  return (
    <ReferencePanel className="[@media(min-width:1024px)_and_(max-height:850px)]:!px-4 [@media(min-width:1024px)_and_(max-height:850px)]:!py-2">
      {result === null ? (
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid gap-3 lg:grid-cols-3 [@media(min-width:1024px)_and_(max-height:850px)]:gap-2.5">
            <NumericField
              id="ffmi-height"
              label="Boy"
              unit="cm"
              value={form.heightCm}
              min={100}
              max={250}
              step={0.1}
              placeholder="175"
              error={errors.heightCm}
              onChange={(value) => updateForm("heightCm", value)}
            />
            <NumericField
              id="ffmi-weight"
              label="Kilo"
              unit="kg"
              value={form.weightKg}
              min={30}
              max={300}
              step={0.1}
              placeholder="75"
              error={errors.weightKg}
              onChange={(value) => updateForm("weightKg", value)}
            />
            <NumericField
              id="ffmi-body-fat"
              label="Vücut Yağ Oranı"
              unit="%"
              value={form.bodyFatPercentage}
              min={3}
              max={60}
              step={0.1}
              placeholder="18"
              error={errors.bodyFatPercentage}
              onChange={(value) => updateForm("bodyFatPercentage", value)}
            />
          </div>

          <details className="mt-1.5 rounded-xl border border-[#11283a]/10 bg-white px-3.5 py-0.5 [@media(min-width:1024px)_and_(max-height:850px)]:mt-1 [@media(min-width:1024px)_and_(max-height:850px)]:py-0">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-xs font-bold text-[#6a5429] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38] [&::-webkit-details-marker]:hidden">
              Yağ oranını nasıl öğrenebilirim?
              <ChevronDown aria-hidden="true" className="size-4" />
            </summary>
            <p className="border-t border-[#11283a]/8 pt-2 text-xs leading-5 text-[#657581]">
              DEXA, BIA / akıllı tartı, deri kıvrımı ölçümü veya görsel tahmin gibi yöntemler
              kullanılabilir. Hiçbiri burada kesin gerçek kabul edilmez; sonuç
              girdiğin yağ oranının doğruluğundan etkilenir. Yağ oranını bilmiyorsan
              araç senin adına bir değer tahmin etmez.
            </p>
          </details>

          <fieldset className="mt-3 [@media(min-width:1024px)_and_(max-height:850px)]:mt-2">
            <legend className="text-sm font-bold text-[#102536]">
              Yorumlama bilgileri <span className="font-normal text-[#71808b]">(isteğe bağlı)</span>
            </legend>
            <p className="mt-0.5 text-xs leading-5 text-[#657581] [@media(min-width:1024px)_and_(max-height:850px)]:leading-4">
              Yaş ve referans seçimi yalnız araştırma karşılaştırmasında kullanılır;
              FFMI hesabını değiştirmez.
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] [@media(min-width:1024px)_and_(max-height:850px)]:mt-1.5">
              <NumericField
                id="ffmi-age"
                label="Yaş"
                unit="yıl"
                value={form.ageYears}
                min={18}
                step={1}
                placeholder="30"
                error={errors.ageYears}
                required={false}
                onChange={(value) => updateForm("ageYears", value)}
              />
              <fieldset
                aria-invalid={Boolean(errors.referenceSex)}
                aria-describedby={errors.referenceSex ? "ffmi-reference-sex-error" : undefined}
              >
                <legend className="text-sm font-bold">Referans kategorisi</legend>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  {(
                    [
                      ["men", "Erkek referansı"],
                      ["women", "Kadın referansı"],
                    ] as const
                  ).map(([value, label]) => {
                    const selected = form.referenceSex === value;
                    return (
                      <label
                        key={value}
                        data-selected={selected}
                        className="calculator-choice flex min-h-11 cursor-pointer items-center gap-2 px-3 text-sm font-bold"
                      >
                        <input
                          type="radio"
                          name="referenceSex"
                          value={value}
                          checked={selected}
                          onChange={() => updateForm("referenceSex", value)}
                          className="size-4 accent-[#9f7b38]"
                        />
                        {label}
                      </label>
                    );
                  })}
                </div>
                {errors.referenceSex && (
                  <FieldError id="ffmi-reference-sex-error">{errors.referenceSex}</FieldError>
                )}
              </fieldset>
            </div>
          </fieldset>

          <fieldset
            className="mt-3 [@media(min-width:1024px)_and_(max-height:850px)]:mt-2"
            aria-invalid={Boolean(errors.measurementMethod)}
            aria-describedby={errors.measurementMethod ? "measurement-method-error" : undefined}
          >
            <legend className="text-sm font-bold text-[#102536]">
              Vücut yağ oranını nasıl ölçtün?
            </legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-5 [@media(min-width:1024px)_and_(max-height:850px)]:mt-1.5">
              {measurementOptions.map((option) => {
                const selected = form.measurementMethod === option.value;
                return (
                  <label
                    key={option.value}
                    data-selected={selected}
                    className="calculator-choice flex min-h-14 cursor-pointer items-start gap-1.5 px-2.5 py-2 text-xs leading-4 [@media(min-width:1024px)_and_(max-height:850px)]:min-h-11 [@media(min-width:1024px)_and_(max-height:850px)]:py-1.5"
                  >
                    <input
                      type="radio"
                      name="measurementMethod"
                      value={option.value}
                      checked={selected}
                      onChange={() => updateForm("measurementMethod", option.value)}
                      className="sr-only"
                    />
                    <span
                      aria-hidden="true"
                      className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${
                        selected
                          ? "border-[#9f7b38] bg-[#9f7b38] text-white"
                          : "border-[#11283a]/25 text-transparent"
                      }`}
                    >
                      <Check className="size-3" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-bold xl:text-sm">{option.label}</span>
                      <span className="mt-0.5 block text-[0.68rem] font-medium leading-4 text-[#657581] [@media(min-width:1024px)_and_(max-height:850px)]:leading-[0.9rem]">
                        {option.description}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
            {errors.measurementMethod && (
              <FieldError id="measurement-method-error">{errors.measurementMethod}</FieldError>
            )}
          </fieldset>

          <div className="mt-3 rounded-xl border border-[#11283a]/10 bg-white px-3.5 py-1.5 [@media(min-width:1024px)_and_(max-height:850px)]:mt-2 [@media(min-width:1024px)_and_(max-height:850px)]:py-0">
            <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-bold">
              <input
                type="checkbox"
                checked={form.standardAdultScope}
                onChange={(event) => updateForm("standardAdultScope", event.target.checked)}
                aria-invalid={Boolean(errors.standardAdultScope)}
                aria-describedby={errors.standardAdultScope ? "standard-scope-error" : undefined}
                className="size-4 accent-[#9f7b38]"
              />
              Genel yetişkin kapsamındayım (18+)
            </label>
            <details className="border-t border-[#11283a]/8 pt-0.5">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-xs font-bold text-[#6a5429] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38] [&::-webkit-details-marker]:hidden">
                Kimler için uygun değildir?
                <ChevronDown aria-hidden="true" className="size-4" />
              </summary>
              <p className="pt-2 text-xs leading-5 text-[#657581]">
                18 yaş altı; gebelik; aktif yeme bozukluğu veya Sporda Göreceli Enerji
                Eksikliği (RED-S);
                belirgin ödem ya da sıvı tutulumu; amputasyon veya majör anatomik
                farklılık ve vücut kompozisyonu yorumunu ciddi biçimde bozan ilgili
                klinik durumlar genel hesaplama kapsamı dışındadır.
              </p>
            </details>
            {errors.standardAdultScope && (
              <FieldError id="standard-scope-error">{errors.standardAdultScope}</FieldError>
            )}
          </div>

          {errors.form && <FieldError>{errors.form}</FieldError>}

          <div className="mt-3 flex justify-end [@media(min-width:1024px)_and_(max-height:850px)]:mt-2">
            <button
              type="submit"
              className="calculator-action inline-flex min-h-11 w-full items-center justify-center gap-2 px-5 text-sm font-bold sm:w-auto"
            >
              FFMI&apos;Yİ HESAPLA
              <ArrowRight aria-hidden="true" className="size-4" />
            </button>
          </div>
        </form>
      ) : (
        <FFMIResultView
          form={form}
          result={result}
          headingRef={resultHeadingRef}
          onEdit={() => setResult(null)}
          onReset={startNewCalculation}
        />
      )}
    </ReferencePanel>
  );
}

function NumericField({
  id,
  label,
  unit,
  value,
  min,
  max,
  step,
  placeholder,
  error,
  required = true,
  onChange,
}: {
  id: string;
  label: string;
  unit: string;
  value: string;
  min: number;
  max?: number;
  step: number;
  placeholder: string;
  error?: string;
  required?: boolean;
  onChange: (value: string) => void;
}) {
  const errorId = `${id}-error`;
  return (
    <label htmlFor={id} className="text-sm font-bold">
      {label} <span className="font-normal text-[#71808b]">{unit}</span>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`${referenceInputClasses} [@media(min-width:1024px)_and_(max-height:850px)]:mt-1 [@media(min-width:1024px)_and_(max-height:850px)]:min-h-11`}
      />
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </label>
  );
}

function FFMIResultView({
  form,
  result,
  headingRef,
  onEdit,
  onReset,
}: {
  form: FFMIForm;
  result: FFMISuccess;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onEdit: () => void;
  onReset: () => void;
}) {
  const contextMessages: Record<
    BodyFatMeasurementMethod,
    Readonly<{ summary: string; detail?: string }>
  > = {
    dexa: {
      summary: "Sonucun girdiğin DEXA yağ oranına göre hesaplandı.",
    },
    bia_smart_scale: {
      summary: "Sonucun kullandığın cihazın yağ oranı tahminine bağlıdır.",
    },
    skinfold: {
      summary:
        "Sonucun girdiğin deri kıvrımı ölçümünden elde edilen yağ oranına göre hesaplandı.",
    },
    visual_estimate: {
      summary: "Sonucun yaklaşık bir değerdir.",
      detail:
        "Yağ oranını görsel olarak tahmin ettiğin için bu sonucu kesin bir ölçüm gibi değerlendirmemelisin.",
    },
    other_unknown: {
      summary:
        "Ölçüm yöntemini bilmediğimiz için sonucun ne kadar hassas olduğunu değerlendiremiyoruz.",
    },
  };
  const context = contextMessages[result.metadata.bodyFatMeasurementMethod];

  return (
    <article aria-live="polite" className="calculator-result-light p-4 sm:p-5">
      <div>
        <div className="rounded-xl border border-[#9f7b38]/25 bg-white px-4 py-3.5 shadow-[0_12px_30px_rgba(17,40,58,.06)] [@media(min-width:1024px)_and_(max-height:850px)]:px-3.5 [@media(min-width:1024px)_and_(max-height:850px)]:py-2.5">
          <h2 ref={headingRef} tabIndex={-1} className="text-xs font-bold uppercase tracking-[0.18em] text-[#8c6a2d] outline-none">
            FFMI Sonucun
          </h2>
          <p className="mt-1 text-5xl font-semibold tracking-[-0.06em] text-[#102536] sm:text-6xl">
            {formatFFMIDisplayValue(result.ffmi)}
          </p>
          <p className="mt-2 max-w-md text-sm leading-5 text-[#5c6c78] [@media(min-width:1024px)_and_(max-height:850px)]:mt-1 [@media(min-width:1024px)_and_(max-height:850px)]:leading-4">
            FFMI, boyuna göre yağsız vücut kütleni gösteren bir ölçüdür. Değer
            yükseldikçe boya göre yağsız kütle genel olarak artar.
          </p>
          <p className="mt-1.5 text-xs leading-5 text-[#71808b] [@media(min-width:1024px)_and_(max-height:850px)]:mt-1 [@media(min-width:1024px)_and_(max-height:850px)]:leading-4">
            Bu değer, girdiğin yağ oranına göre tahmini olarak hesaplandı.
          </p>
        </div>

      </div>

      <FFMIReferenceComparator
        ffmi={result.ffmi}
        fmi={result.fmi}
        measurementMethod={result.metadata.bodyFatMeasurementMethod}
        ageYears={Number(form.ageYears)}
        referenceSex={form.referenceSex}
      />

      <div className="mt-3 grid gap-2 sm:grid-cols-3 [@media(min-width:1024px)_and_(max-height:850px)]:mt-2">
        <Metric label="Yağsız Kütle" value={formatFFMIDisplayValue(result.fatFreeMassKg)} unit="kg" />
        <Metric
          label="Yağ İndeksi"
          technicalLabel="FMI"
          value={formatFFMIDisplayValue(result.fmi)}
          info="Yağ indeksin, yağ kütleni boyuna göre ölçekler."
        />
        <Metric label="Yağ Kütlesi" value={formatFFMIDisplayValue(result.fatMassKg)} unit="kg" />
      </div>

      <div className="mt-3 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center [@media(min-width:1024px)_and_(max-height:850px)]:mt-2">
        <button
          type="button"
          onClick={onEdit}
          className="calculator-action calculator-action--secondary inline-flex min-h-11 items-center justify-center gap-2 px-4 text-sm font-bold"
        >
          <Pencil aria-hidden="true" className="size-4 shrink-0" />
          Değerleri Düzenle
        </button>
        <button
          type="button"
          onClick={onReset}
          className="calculator-action calculator-action--secondary inline-flex min-h-11 items-center justify-center gap-2 px-4 text-sm font-bold text-[#6a5429]"
        >
          <RotateCcw aria-hidden="true" className="size-4 shrink-0" />
          Yeni Hesaplama
        </button>
      </div>

      <section className="mt-3 rounded-xl border border-[#11283a]/10 bg-white px-4 py-3 [@media(min-width:1024px)_and_(max-height:850px)]:mt-2 [@media(min-width:1024px)_and_(max-height:850px)]:px-3.5 [@media(min-width:1024px)_and_(max-height:850px)]:py-2">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71808b]">
          Ölçüm yönteminin etkisi
        </p>
        <p className="mt-1 text-xs font-bold leading-5 text-[#5c6c78] [@media(min-width:1024px)_and_(max-height:850px)]:leading-4">{context.summary}</p>
        {context.detail && (
          <p className="mt-0.5 text-xs leading-5 text-[#71808b] [@media(min-width:1024px)_and_(max-height:850px)]:leading-4">{context.detail}</p>
        )}
      </section>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 [&>details]:!mt-0 [&>details>summary]:!min-h-11 [@media(min-width:1024px)_and_(max-height:850px)]:mt-2">
        <MethodologyDisclosure label="FFMI ne anlatır?">
          <p>
            FFMI, yağsız vücut kütleni boyuna göre ölçekleyen bir indekstir.
            Yağsız kütle yalnızca kas dokusundan oluşmadığı için FFMI doğrudan kas
            kütlesi ölçümü değildir.
          </p>
          <p>
            FFMI için herkese uyan tek bir normal veya ideal hedef yoktur. Yaş,
            cinsiyet, popülasyon ve kullanılan ölçüm yöntemine göre referans
            dağılımları değişebilir; bu dağılımlar sağlık açısından ideal değerleri
            göstermez. Bu nedenle Trainology sonucu tek başına düşük, normal, iyi
            veya yüksek olarak sınıflandırmaz.
          </p>
          <p>
            Sonucunu zaman içinde takip ediyorsan aynı yağ oranı ölçüm yöntemini ve
            mümkün olduğunca benzer ölçüm koşullarını kullan. Küçük değişiklikler
            gerçek vücut kompozisyonu değişiminin yanında ölçüm değişkenliğinden de
            kaynaklanabilir.
          </p>
        </MethodologyDisclosure>
        <MethodologyDisclosure label="Nasıl hesaplandı?">
          <p>
            Kilo: {formatFFMIDisplayValue(Number(form.weightKg))} kg · Yağ oranı: %{formatFFMIDisplayValue(Number(form.bodyFatPercentage))} · Boy: {formatFFMIDisplayValue(Number(form.heightCm))} cm
          </p>
          <p>
            Yağ kütlesi = kilo × (yağ oranı / 100). Yağsız kütle = kilo − yağ
            kütlesi. FFMI = yağsız kütle / boy². FMI = yağ kütlesi / boy².
          </p>
          <p>Ara hesaplamalarda yuvarlama yapılmadı.</p>
        </MethodologyDisclosure>
      </div>

    </article>
  );
}

function Metric({
  label,
  technicalLabel,
  value,
  unit,
  info,
}: {
  label: string;
  technicalLabel?: string;
  value: string;
  unit?: string;
  info?: string;
}) {
  return (
    <div className="rounded-xl border border-[#11283a]/10 bg-white px-3.5 py-3 [@media(min-width:1024px)_and_(max-height:850px)]:py-2.5">
      <div className="flex min-h-11 items-center gap-1">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#71808b]">
          {label}
          {technicalLabel && (
            <span className="ml-1 normal-case tracking-normal text-[#8c6a2d]">
              ({technicalLabel})
            </span>
          )}
        </p>
        {info && (
          <details className="group relative">
            <summary
              aria-label={`${label} hakkında bilgi`}
              className="flex size-11 cursor-pointer list-none items-center justify-center rounded-full text-[#8c6a2d] transition hover:bg-[#efe5d0]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38] [&::-webkit-details-marker]:hidden"
            >
              <Info aria-hidden="true" className="size-4" />
            </summary>
            <p className="absolute left-0 top-full z-10 w-48 rounded-lg border border-[#11283a]/10 bg-[#102536] px-3 py-2 text-xs font-medium normal-case leading-5 tracking-normal text-white shadow-lg">
              {info}
            </p>
          </details>
        )}
      </div>
      <p className="mt-1 text-2xl font-semibold tracking-[-0.035em] text-[#102536]">
        {value} {unit && <span className="text-sm font-medium text-[#657581]">{unit}</span>}
      </p>
    </div>
  );
}
