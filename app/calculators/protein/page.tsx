"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import CalculatorLayout from "@/components/calculators/CalculatorLayout";
import {
  EditReferenceButton,
  FieldError,
  MethodologyDisclosure,
  ReferencePanel,
  ScopeConfirmation,
  SelectionCards,
  referenceInputClasses,
} from "@/components/calculators/ReferenceToolUI";
import {
  calculateProteinRequirement,
  type ProteinAgeGroup,
  type ProteinGoal,
  type ProteinRequirement,
  type ProteinTrainingProfile,
} from "@/lib/calculators";

type ProteinForm = {
  ageGroup: ProteinAgeGroup | "";
  heightCm: string;
  weightKg: string;
  goal: ProteinGoal | "";
  trainingProfile: ProteinTrainingProfile | "";
  standardAdultScope: boolean;
};

const initialForm: ProteinForm = {
  ageGroup: "",
  heightCm: "",
  weightKg: "",
  goal: "",
  trainingProfile: "",
  standardAdultScope: false,
};

const trainingOptions = [
  { value: "none", label: "Egzersiz Yok", description: "Düzenli egzersiz yok" },
  {
    value: "endurance_mixed",
    label: "Kardiyo veya Karma Antrenman",
    description: "Koşu, bisiklet veya farklı egzersizlerin karışımı",
  },
  {
    value: "resistance",
    label: "Direnç Antrenmanı",
    description: "Ağırlık, makine veya vücut ağırlığıyla kuvvet çalışması",
  },
] as const;

const goalLabels: Record<ProteinGoal, string> = {
  maintenance: "Koruma / genel sağlık",
  fat_loss: "Yağ kaybı",
  muscle_gain: "Kas kazanımı",
};

const trainingLabels: Record<ProteinTrainingProfile, string> = {
  none: "Egzersiz Yok",
  endurance_mixed: "Kardiyo veya Karma Antrenman",
  resistance: "Direnç Antrenmanı",
};

function grams(value: number) {
  return Math.round(value).toLocaleString("tr-TR");
}

function decimal(value: number) {
  return value.toLocaleString("tr-TR", { maximumFractionDigits: 2 });
}

export default function ProteinCalculatorPage() {
  const [form, setForm] = useState<ProteinForm>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ProteinRequirement | null>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (result && result.type !== "VALIDATION_ERROR") {
      resultHeadingRef.current?.focus();
    }
  }, [result]);

  function updateForm<K extends keyof ProteinForm>(key: K, value: ProteinForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
    setResult(null);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    const height = Number(form.heightCm);
    const weight = Number(form.weightKg);

    if (!form.ageGroup) nextErrors.ageGroup = "Yaş grubunu seç.";
    if (!Number.isFinite(height) || height < 100 || height > 250) {
      nextErrors.heightCm = "Boy 100–250 cm arasında olmalıdır.";
    }
    if (!Number.isFinite(weight) || weight < 25 || weight > 400) {
      nextErrors.weightKg = "Kilo 25–400 kg arasında olmalıdır.";
    }
    if (!form.goal) nextErrors.goal = "Hedefini seç.";
    if (!form.trainingProfile) nextErrors.trainingProfile = "Antrenman profilini seç.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const nextResult = calculateProteinRequirement({
      ageGroup: form.ageGroup as ProteinAgeGroup,
      heightCm: height,
      weightKg: weight,
      goal: form.goal as ProteinGoal,
      trainingProfile: form.trainingProfile as ProteinTrainingProfile,
      standardAdultScope: form.standardAdultScope,
    });

    if (nextResult.type === "VALIDATION_ERROR") {
      setErrors({ [nextResult.field]: nextResult.message });
      return;
    }
    setResult(nextResult);
  }

  return (
    <CalculatorLayout
      title="Günlük Protein Referansı"
      seoPath="/calculators/protein"
      description="Kilon, hedefin ve antrenman durumuna göre günlük protein referansını hesapla."
      sectionClassName="!py-[var(--space-section-compact)] sm:!py-8 lg:!py-8"
      contentClassName="mx-auto max-w-4xl space-y-5 lg:space-y-6 [&>header]:border-b [&>header]:border-[var(--border-dark)] [&>header]:pb-5 [&>header>h1]:!text-[var(--type-page-title-size)] [&>header>h1]:!font-[var(--type-page-title-weight)] [&>header>h1]:!leading-[var(--type-page-title-leading)] [&>header>p]:!mt-3 [&>header>p]:!max-w-xl [&>header>p]:!text-sm [&>header>p]:!leading-6"
      disclaimer="Bu araç genel yetişkinler için başlangıç veya pratik referans sunar; kesin kişisel gereksinim ya da klinik hedef belirlemez."
    >
      <ReferencePanel>
        {result === null ? (
          <form onSubmit={handleSubmit} noValidate>
            <div className="grid gap-[var(--space-field-group)] sm:grid-cols-3">
              <label className="calculator-label">
                Yaş grubu
                <select
                  value={form.ageGroup}
                  onChange={(event) => updateForm("ageGroup", event.target.value as ProteinAgeGroup | "")}
                  aria-invalid={Boolean(errors.ageGroup)}
                  aria-describedby={errors.ageGroup ? "ageGroup-error" : undefined}
                  className={referenceInputClasses}
                >
                  <option value="">Seçiniz</option>
                  <option value="adult_18_64">18–64</option>
                  <option value="adult_65_plus">65+</option>
                </select>
                {errors.ageGroup && <FieldError id="ageGroup-error">{errors.ageGroup}</FieldError>}
              </label>

              <label className="calculator-label">
                Boy <span className="font-normal text-[#71808b]">cm</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={100}
                  max={250}
                  step={0.1}
                  value={form.heightCm}
                  onChange={(event) => updateForm("heightCm", event.target.value)}
                  aria-invalid={Boolean(errors.heightCm)}
                  aria-describedby={errors.heightCm ? "heightCm-error" : undefined}
                  placeholder="170"
                  className={referenceInputClasses}
                />
                {errors.heightCm && <FieldError id="heightCm-error">{errors.heightCm}</FieldError>}
              </label>

              <label className="calculator-label">
                Kilo <span className="font-normal text-[#71808b]">kg</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={25}
                  max={400}
                  step={0.1}
                  value={form.weightKg}
                  onChange={(event) => updateForm("weightKg", event.target.value)}
                  aria-invalid={Boolean(errors.weightKg)}
                  aria-describedby={errors.weightKg ? "weightKg-error" : undefined}
                  placeholder="70"
                  className={referenceInputClasses}
                />
                {errors.weightKg && <FieldError id="weightKg-error">{errors.weightKg}</FieldError>}
              </label>
            </div>

            <div className="mt-[var(--space-field-group)] grid gap-[var(--space-field-group)] border-t border-[var(--calculator-border)] pt-[var(--space-field-group)] lg:grid-cols-[minmax(0,.72fr)_minmax(0,2fr)]">
              <label className="calculator-label">
                Hedef
                <select
                  value={form.goal}
                  onChange={(event) => updateForm("goal", event.target.value as ProteinGoal | "")}
                  aria-invalid={Boolean(errors.goal)}
                  aria-describedby={errors.goal ? "goal-error" : undefined}
                  className={referenceInputClasses}
                >
                  <option value="">Seçiniz</option>
                  <option value="maintenance">Koruma / genel sağlık</option>
                  <option value="fat_loss">Yağ kaybı</option>
                  <option value="muscle_gain">Kas kazanımı</option>
                </select>
                {errors.goal && <FieldError id="goal-error">{errors.goal}</FieldError>}
              </label>

              <SelectionCards
                legend="Antrenman profili"
                name="trainingProfile"
                value={form.trainingProfile}
                options={trainingOptions}
                error={errors.trainingProfile}
                onChange={(value) => updateForm("trainingProfile", value)}
              />
            </div>

            <div className="mt-[var(--space-field-group)] border-t border-[var(--calculator-border)] pt-[var(--space-field-group)]">
              <ScopeConfirmation
                checked={form.standardAdultScope}
                onChange={(checked) => updateForm("standardAdultScope", checked)}
                disclosure={
                  <p>
                    18 yaş altı; gebelik/emzirme; böbrek veya klinik karaciğer hastalığı;
                    protein kısıtlaması; aktif tıbbi beslenme tedavisi; aktif/şüpheli yeme
                    bozukluğu veya Sporda Göreceli Enerji Eksikliği (RED-S); ciddi yetersiz
                    beslenme, belirgin güçsüzlük ve kırılganlık ya da akut ciddi hastalık
                    özel değerlendirme gerektirir. Obezite tek başına sonucu durdurmaz.
                  </p>
                }
              />
            </div>

            <div className="mt-[var(--space-field-group)] flex justify-end border-t border-[var(--calculator-border)] pt-[var(--space-field-group)]">
              <button
                type="submit"
                className="calculator-action inline-flex min-h-11 items-center justify-center gap-2 px-5 text-sm font-bold"
              >
                Protein Referansımı Hesapla
                <ArrowRight aria-hidden="true" className="size-4" />
              </button>
            </div>
          </form>
        ) : result.type === "NO_NUMERIC_RESULT" ? (
          <BlockedProteinResult headingRef={resultHeadingRef} onEdit={() => setResult(null)} />
        ) : result.type === "VALIDATION_ERROR" ? null : (
          <ProteinResultView form={form} result={result} headingRef={resultHeadingRef} onEdit={() => setResult(null)} />
        )}
      </ReferencePanel>
    </CalculatorLayout>
  );
}

function ProteinResultView({
  form,
  result,
  headingRef,
  onEdit,
}: {
  form: ProteinForm;
  result: Exclude<ProteinRequirement, { type: "VALIDATION_ERROR" | "NO_NUMERIC_RESULT" }>;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onEdit: () => void;
}) {
  const primary =
    result.type === "ANCHOR_AND_RANGE"
      ? { value: grams(result.anchorDailyGrams), detail: `${decimal(result.anchorGPerKg)} g/kg/gün başlangıç referansı` }
      : result.type === "SINGLE_REFERENCE"
        ? { value: grams(result.dailyGrams), detail: `${decimal(result.gPerKg)} g/kg/gün başlangıç referansı` }
        : null;

  return (
    <article aria-live="polite" className="calculator-result-light p-[var(--space-panel-compact)] sm:p-[var(--space-panel)]">
      <p className="font-mono text-[var(--type-technical-label-size)] font-bold uppercase tracking-[var(--type-technical-label-tracking)] text-[var(--calculator-gold)]">Sonucun</p>
      <h2 ref={headingRef} tabIndex={-1} className="mt-2 text-2xl font-semibold tracking-[-0.035em] outline-none sm:text-3xl">
        Günlük Protein Referansın
      </h2>

      {primary && (
        <div className="mt-5 border-l-2 border-[var(--calculator-gold)] pl-4 sm:pl-5">
          <p className="text-[clamp(3rem,7vw,4.5rem)] font-semibold leading-none tracking-[-0.055em] text-[var(--calculator-text-primary)]">
            {primary.value} <span className="text-2xl">g / gün</span>
          </p>
          <p className="mt-1.5 text-sm font-semibold text-[#8c6a2d]">{primary.detail}</p>
        </div>
      )}

      {(result.type === "PRACTICAL_RANGE" || result.type === "ANCHOR_AND_RANGE") && (
        <div className={`${primary ? "mt-5 border-y border-[var(--calculator-border)] py-4" : "mt-5 border-l-2 border-[var(--calculator-gold)] pl-4 sm:pl-5"}`}>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[var(--calculator-text-secondary)]">Pratik aralık</p>
          <p className={`${primary ? "mt-1.5 text-2xl" : "mt-2 text-[clamp(3rem,7vw,4.5rem)] leading-none tracking-[-0.055em]"} font-semibold text-[var(--calculator-text-primary)]`}>
            {grams(result.lowDailyGrams)}–{grams(result.highDailyGrams)} g/gün
          </p>
          <p className="mt-1 text-sm text-[#657581]">
            {decimal(result.lowGPerKg)}–{decimal(result.highGPerKg)} g/kg/gün
          </p>
          <p className="mt-2 text-xs leading-5 text-[#657581]">
            Bu aralık tek ve zorunlu bir hedef değildir. Araç, aralık içinde sana özel bir nokta seçmez.
          </p>
        </div>
      )}

      <div className="mt-5 grid border-y border-[var(--calculator-border)] sm:grid-cols-2">
        <div className="py-4 sm:pr-5">
          <h3 className="text-sm font-bold">Profilin</h3>
          <p className="mt-1 text-sm text-[#5c6c78]">
            {form.weightKg} kg · {trainingLabels[form.trainingProfile as ProteinTrainingProfile]} · {goalLabels[form.goal as ProteinGoal]}
          </p>
        </div>
        <div className="border-t border-[var(--calculator-border)] py-4 sm:border-l sm:border-t-0 sm:pl-5">
          <h3 className="text-sm font-bold">Bu ne anlama geliyor?</h3>
          <p className="mt-1 text-sm leading-5 text-[#5c6c78]">
            Bu değer verdiğin bilgilere göre bir başlangıç veya pratik referanstır; kesin kişisel gereksinim değildir.
            {result.note === "no_hypertrophy_target" && " Bu profil için kas gelişimine özel ayrı bir hedef üretilmedi."}
            {result.note === "fat_loss_context" && " Enerji açığında gereksinim aralığın üst bölümüne doğru artabilir; otomatik tek katsayı atanmadı."}
            {result.note === "older_adult_individualization" && " İleri yaşta bireysel değerlendirme önemlidir."}
          </p>
        </div>
      </div>

      <MethodologyDisclosure>
        <p>
          Hesaplama ağırlığı: {decimal(result.calculationWeightKg)} kg. Kullanılan protein değeri bu ağırlık üzerinden ara yuvarlama yapılmadan hesaplandı.
        </p>
        {result.usesReferenceWeight && (
          <p>
            BMI 30 veya üzerinde <code>Wcalc = min(gerçek kilo, 30 × boy²)</code> kullanıldı. Bu, protein hesabının yüksek vücut ağırlıklarında sınırsız artmasını önleyen ihtiyatlı bir Trainology hesaplama yaklaşımıdır. Kanıtı dolaylı ve popülasyona bağlıdır; bu değer ideal, sağlıklı veya hedef kilo değildir.
          </p>
        )}
        <p>
          EFSA’nın 0,83 g/kg/gün değeri genel yetişkin nüfus referansıdır. ESPEN’in 1,0–1,2 g/kg/gün aralığı ileri yaş bağlamını destekler. Jäger ve arkadaşlarının 1,4–2,0 g/kg/gün aralığı egzersiz yapan sağlıklı yetişkinleri; Morton ve arkadaşlarının yaklaşık 1,6 g/kg/gün bulgusu direnç antrenmanı bağlamını destekler.
        </p>
        <p>
          Yağ kaybındaki 1,2 g/kg/gün, tüm yetişkinler için doğrulanmış tek bir gereksinim değildir. Enerji kısıtlamasında daha yüksek protein alımını destekleyen kanıtlardan türetilmiş ihtiyatlı bir Trainology başlangıç referansıdır. Direnç antrenmanı ve yağ kaybında 1,6 g/kg/gün başlangıç referansı, 1,6–2,0 g/kg/gün ise kişiye özel tek nokta seçmeyen pratik aralıktır.
        </p>
        <p>
          Kaynaklar: EFSA NDA (2012); Jäger et al. (2017); Morton et al. (2018); Volkert et al. (2022); Weijs (2025).
        </p>
      </MethodologyDisclosure>
      <EditReferenceButton onClick={onEdit} />
    </article>
  );
}

function BlockedProteinResult({ headingRef, onEdit }: { headingRef: React.RefObject<HTMLHeadingElement | null>; onEdit: () => void }) {
  return (
    <article aria-live="polite" className="calculator-result-light p-[var(--space-panel-compact)] sm:p-[var(--space-panel)]">
      <p className="font-mono text-[var(--type-technical-label-size)] font-bold uppercase tracking-[var(--type-technical-label-tracking)] text-[var(--calculator-gold)]">Uygunluk kontrolü</p>
      <h2 ref={headingRef} tabIndex={-1} className="mt-3 text-2xl font-semibold outline-none">Bu genel hesaplama sana uygun olmayabilir</h2>
      <p className="mt-4 max-w-2xl border-l-2 border-[var(--calculator-gold)] pl-4 text-sm leading-6 text-[#5c6c78]">
        Bu bilgilerle protein referansı sağlık durumu ve bireysel koşullara göre değişebilir. Sayısal protein değeri gösterilmedi.
      </p>
      <EditReferenceButton onClick={onEdit} />
    </article>
  );
}
