"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";

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
    label: "Dayanıklılık / Karma",
    description: "Düzenli egzersiz, direnç odaklı değil",
  },
  {
    value: "resistance",
    label: "Direnç Antrenmanı",
    description: "Düzenli direnç çalışması var",
  },
] as const;

const goalLabels: Record<ProteinGoal, string> = {
  maintenance: "Koruma / genel sağlık",
  fat_loss: "Yağ kaybı",
  muscle_gain: "Kas kazanımı",
};

const trainingLabels: Record<ProteinTrainingProfile, string> = {
  none: "Egzersiz Yok",
  endurance_mixed: "Dayanıklılık / Karma",
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
      sectionClassName="!py-5 sm:!py-7 lg:!py-6 [@media(min-width:1024px)_and_(max-height:850px)]:!py-3"
      contentClassName="mx-auto max-w-4xl space-y-4 [@media(min-width:1024px)_and_(max-height:850px)]:space-y-2.5"
      disclaimer="Bu araç standart yetişkinler için başlangıç veya pratik referans sunar; kesin kişisel gereksinim ya da klinik hedef belirlemez."
    >
      <ReferencePanel>
        {result === null ? (
          <form onSubmit={handleSubmit} noValidate>
            <div className="grid gap-3 sm:grid-cols-3 [@media(min-width:1024px)_and_(max-height:850px)]:gap-2.5">
              <label className="text-sm font-bold">
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

              <label className="text-sm font-bold">
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

              <label className="text-sm font-bold">
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

            <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,.72fr)_minmax(0,2fr)] [@media(min-width:1024px)_and_(max-height:850px)]:mt-3 [@media(min-width:1024px)_and_(max-height:850px)]:gap-3">
              <label className="text-sm font-bold">
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

            <div className="mt-4 [@media(min-width:1024px)_and_(max-height:850px)]:mt-3">
              <ScopeConfirmation
                checked={form.standardAdultScope}
                onChange={(checked) => updateForm("standardAdultScope", checked)}
                disclosure={
                  <p>
                    18 yaş altı; gebelik/emzirme; böbrek veya klinik karaciğer hastalığı;
                    protein kısıtlaması; aktif tıbbi beslenme tedavisi; aktif/şüpheli yeme
                    bozukluğu veya RED-S; ciddi malnütrisyon, frailty ya da akut ciddi hastalık
                    özel değerlendirme gerektirir. Obezite tek başına sonucu durdurmaz.
                  </p>
                }
              />
            </div>

            <div className="mt-4 flex justify-end [@media(min-width:1024px)_and_(max-height:850px)]:mt-3">
              <button
                type="submit"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#102536] bg-[#102536] px-5 text-sm font-bold text-white transition hover:bg-[#173247] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38]"
              >
                Protein Referansımı Hesapla
                <ArrowRight aria-hidden="true" className="size-4" />
              </button>
            </div>
          </form>
        ) : result.type === "NO_NUMERIC_RESULT" ? (
          <BlockedProteinResult onEdit={() => setResult(null)} />
        ) : result.type === "VALIDATION_ERROR" ? null : (
          <ProteinResultView form={form} result={result} onEdit={() => setResult(null)} />
        )}
      </ReferencePanel>
    </CalculatorLayout>
  );
}

function ProteinResultView({
  form,
  result,
  onEdit,
}: {
  form: ProteinForm;
  result: Exclude<ProteinRequirement, { type: "VALIDATION_ERROR" | "NO_NUMERIC_RESULT" }>;
  onEdit: () => void;
}) {
  const primary =
    result.type === "ANCHOR_AND_RANGE"
      ? { value: grams(result.anchorDailyGrams), detail: `${decimal(result.anchorGPerKg)} g/kg/gün başlangıç referansı` }
      : result.type === "SINGLE_REFERENCE"
        ? { value: grams(result.dailyGrams), detail: `${decimal(result.gPerKg)} g/kg/gün başlangıç referansı` }
        : null;

  return (
    <article aria-live="polite">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8c6a2d]">Sonucun</p>
      <h2 className="mt-1.5 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
        Günlük Protein Referansın
      </h2>

      {primary && (
        <div className="mt-4">
          <p className="text-5xl font-semibold tracking-[-0.05em] text-[#102536]">
            {primary.value} <span className="text-2xl">g / gün</span>
          </p>
          <p className="mt-1.5 text-sm font-semibold text-[#8c6a2d]">{primary.detail}</p>
        </div>
      )}

      {(result.type === "PRACTICAL_RANGE" || result.type === "ANCHOR_AND_RANGE") && (
        <div className={`${primary ? "mt-4" : "mt-5"} rounded-xl border border-[#11283a]/10 bg-white px-4 py-3`}>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71808b]">Pratik aralık</p>
          <p className="mt-1 text-2xl font-semibold">
            {grams(result.lowDailyGrams)}–{grams(result.highDailyGrams)} g/gün
          </p>
          <p className="mt-1 text-sm text-[#657581]">
            {decimal(result.lowGPerKg)}–{decimal(result.highGPerKg)} g/kg/gün
          </p>
        </div>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <h3 className="text-sm font-bold">Profilin</h3>
          <p className="mt-1 text-sm text-[#5c6c78]">
            {form.weightKg} kg · {trainingLabels[form.trainingProfile as ProteinTrainingProfile]} · {goalLabels[form.goal as ProteinGoal]}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-bold">Bu ne anlama geliyor?</h3>
          <p className="mt-1 text-sm leading-5 text-[#5c6c78]">
            Bu değer verilen bağlama göre bir başlangıç veya pratik referanstır; kesin kişisel gereksinim değildir.
            {result.note === "no_hypertrophy_target" && " Bu profil için hipertrofiye özel ayrı bir hedef üretilmedi."}
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
            BMI 30 veya üzerinde ürün konvansiyonu olarak <code>Wcalc = min(gerçek kilo, 30 × boy²)</code> referans ağırlığı kullanıldı. Bu fizyolojik ideal ağırlık değildir.
          </p>
        )}
        <p>
          Kaynaklar: EFSA NDA (2012); Jäger et al. (2017); Morton et al. (2018); Volkert et al. (2022).
        </p>
      </MethodologyDisclosure>
      <EditReferenceButton onClick={onEdit} />
    </article>
  );
}

function BlockedProteinResult({ onEdit }: { onEdit: () => void }) {
  return (
    <article aria-live="polite">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9d6f22]">Kapsam kontrolü</p>
      <h2 className="mt-2 text-2xl font-semibold">Standart aracın kapsamı dışında</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5c6c78]">
        Bu bağlamda protein referansı sağlık durumu ve bireysel koşullara göre değişebilir. Sayısal protein değeri gösterilmedi.
      </p>
      <EditReferenceButton onClick={onEdit} />
    </article>
  );
}
