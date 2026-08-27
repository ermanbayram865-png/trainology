"use client";

import { ArrowLeft, ArrowRight, ChevronDown, RotateCcw } from "lucide-react";
import { useState } from "react";

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
  buildQuickHydrationGuide,
  calculateSweatRate,
  calculateWaterRequirement,
  type EfsaAdultReferenceCategory,
  type HydrationEnvironment,
  type HydrationExerciseType,
  type PerceivedSweat,
  type QuickHydrationEvaluation,
  type SweatRateEvaluation,
  type UrinationStatus,
  type WaterRequirement,
} from "@/lib/calculators";

type MainMode = "daily" | "exercise";
type ExerciseMode = "quick" | "measure" | null;

type DailyForm = {
  adultConfirmed: boolean;
  category: EfsaAdultReferenceCategory | "";
  standardAdultScope: boolean;
};

type QuickForm = {
  durationMinutes: number;
  environment: HydrationEnvironment | "";
  perceivedSweat: PerceivedSweat | "";
  standardAdultScope: boolean;
};

type MeasureForm = {
  preWeightKg: string;
  postWeightKg: string;
  fluidConsumedMl: string;
  durationMinutes: string;
  exerciseType: HydrationExerciseType | "";
  environment: HydrationEnvironment | "";
  urinationStatus: UrinationStatus;
  urineMl: string;
  standardAdultScope: boolean;
};

const initialDaily: DailyForm = {
  adultConfirmed: false,
  category: "",
  standardAdultScope: false,
};

const initialQuick: QuickForm = {
  durationMinutes: 75,
  environment: "",
  perceivedSweat: "",
  standardAdultScope: false,
};

const initialMeasure: MeasureForm = {
  preWeightKg: "",
  postWeightKg: "",
  fluidConsumedMl: "",
  durationMinutes: "",
  exerciseType: "",
  environment: "",
  urinationStatus: "no",
  urineMl: "",
  standardAdultScope: false,
};

const categoryOptions = [
  { value: "adult_female_reference", label: "Kadın Referansı", description: "EFSA yetişkin kadın kategorisi" },
  { value: "adult_male_reference", label: "Erkek Referansı", description: "EFSA yetişkin erkek kategorisi" },
] as const;

const environmentOptions = [
  { value: "cool", label: "Serin / Kontrollü", description: "Klimalı salon veya serin koşullar" },
  { value: "normal", label: "Normal", description: "Tipik salon veya ılıman koşullar" },
  { value: "hot_humid", label: "Sıcak / Nemli", description: "Belirgin sıcaklık veya yüksek nem" },
] as const;

const sweatOptions = [
  { value: "low", label: "Az Terliyorum", description: "Kendi algına göre düşük terleme" },
  { value: "moderate", label: "Orta", description: "Kendi algına göre orta terleme" },
  { value: "high", label: "Çok Terliyorum", description: "Kendi algına göre yüksek terleme" },
] as const;

const environmentLabels: Record<HydrationEnvironment, string> = {
  cool: "Serin / Kontrollü",
  normal: "Normal",
  hot_humid: "Sıcak / Nemli",
};

const sweatLabels: Record<PerceivedSweat, string> = {
  low: "Az terleme",
  moderate: "Orta terleme",
  high: "Yüksek terleme",
};

const exerciseLabels: Record<HydrationExerciseType, string> = {
  resistance: "Direnç Antrenmanı",
  cardio_running: "Kardiyo / Koşu",
  team_sport: "Takım Sporu",
  other: "Diğer",
};

const dailySafety = (
  <div className="space-y-1.5">
    <p>
      18 yaş altı; gebelik/emzirme; böbrek hastalığı veya özel sıvı planı; kalp yetmezliği veya sıvı kısıtlaması; aktif kusma, ishal ya da belirgin akut sıvı kaybı özel değerlendirme gerektirir.
    </p>
    <p>Sıvı dengesini etkileyen ilaç kullanımında klinik talimat bu genel referanstan önceliklidir.</p>
  </div>
);

const exerciseSafety = (
  <div className="space-y-1.5">
    <p>
      Gebelik/emzirme; böbrek hastalığı veya özel sıvı planı; kalp yetmezliği veya sıvı kısıtlaması; aktif kusma, ishal ya da belirgin akut sıvı kaybında kişisel egzersiz hidrasyonu değerlendirmesi uygun değildir.
    </p>
    <p>Sıvı dengesini etkileyen ilaç kullanımında profesyonel veya klinik talimat önceliklidir.</p>
  </div>
);

export default function HydrationExperience() {
  const [mainMode, setMainMode] = useState<MainMode>("daily");
  const [exerciseMode, setExerciseMode] = useState<ExerciseMode>(null);

  return (
    <ReferencePanel>
      <div role="tablist" aria-label="Su ve hidrasyon bölümleri" className="grid grid-cols-2 rounded-xl border border-[#11283a]/10 bg-[#edf0ed] p-1">
        {(["daily", "exercise"] as const).map((mode) => {
          const selected = mainMode === mode;
          return (
            <button
              key={mode}
              id={`${mode}-tab`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${mode}-panel`}
              onClick={() => setMainMode(mode)}
              className={`min-h-11 rounded-lg border text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38] ${
                selected
                  ? "border-[#9f7b38]/60 bg-[#fbfaf6] text-[#102536] shadow-sm"
                  : "border-transparent text-[#657581] hover:text-[#102536]"
              }`}
            >
              {mode === "daily" ? "Günlük Referans" : "Egzersiz Hidrasyonu"}
            </button>
          );
        })}
      </div>

      <div className="mt-4 [@media(min-width:1024px)_and_(max-height:850px)]:mt-3">
        {mainMode === "daily" ? (
          <div id="daily-panel" role="tabpanel" aria-labelledby="daily-tab">
            <DailyReference onExercise={() => setMainMode("exercise")} />
          </div>
        ) : (
          <div id="exercise-panel" role="tabpanel" aria-labelledby="exercise-tab">
            {exerciseMode === null ? (
              <ExerciseModeChoice onSelect={setExerciseMode} />
            ) : exerciseMode === "quick" ? (
              <QuickGuide onBack={() => setExerciseMode(null)} onMeasure={() => setExerciseMode("measure")} />
            ) : (
              <SweatRateMeasurement onBack={() => setExerciseMode(null)} />
            )}
          </div>
        )}
      </div>
    </ReferencePanel>
  );
}

function DailyReference({ onExercise }: { onExercise: () => void }) {
  const [form, setForm] = useState<DailyForm>(initialDaily);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<WaterRequirement | null>(null);

  function update<K extends keyof DailyForm>(key: K, value: DailyForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
    setResult(null);
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!form.adultConfirmed) nextErrors.adultConfirmed = "Bu araç yalnız 18 yaş ve üzeri yetişkin kapsamındadır.";
    if (!form.standardAdultScope) nextErrors.standardAdultScope = "Standart yetişkin kapsamı onaylanmalıdır.";
    if (!form.category) nextErrors.category = "Bir EFSA referans kategorisi seç.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const next = calculateWaterRequirement({
      adultConfirmed: form.adultConfirmed,
      efsaAdultReferenceCategory: form.category as EfsaAdultReferenceCategory,
      standardAdultScope: form.standardAdultScope,
    });
    if (next.type === "VALIDATION_ERROR") {
      setErrors({ [next.field]: next.message });
      return;
    }
    setResult(next);
  }

  if (result?.type === "TOTAL_WATER_REFERENCE") {
    const categoryLabel = form.category === "adult_female_reference" ? "Kadın referansı" : "Erkek referansı";
    return (
      <article aria-live="polite">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8c6a2d]">Referansın</p>
        <h2 className="mt-1.5 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">Günlük Toplam Su Referansın</h2>
        <p className="mt-4 text-5xl font-semibold tracking-[-0.05em]">
          {formatHydrationValue(result.litersPerDay)} <span className="text-2xl">L / gün</span>
        </p>
        <p className="mt-1.5 text-sm font-semibold text-[#8c6a2d]">{result.millilitersPerDay.toLocaleString("tr-TR")} mL / gün</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <ResultText title="Bu değer neyi kapsıyor?">
            İçme suyu, diğer içecekler ve besinlerden gelen su dahil toplam günlük su alımı referansıdır.
          </ResultText>
          <ResultText title="Bu değer neyi hesaplamıyor?">
            Egzersizdeki kişisel ter kaybını veya belirli bir gün için kesin kişisel sıvı ihtiyacını hesaplamaz.
          </ResultText>
        </div>
        <p className="mt-3 text-xs font-semibold text-[#657581]">{categoryLabel} · EFSA yetişkin toplam su referansı</p>

        <div className="mt-4 rounded-xl border border-[#11283a]/10 bg-white p-3">
          <h3 className="text-sm font-bold">Antrenman yapıyor musun?</h3>
          <p className="mt-1 text-sm text-[#5c6c78]">Günlük referans, egzersizdeki bireysel ter kaybını ölçmez.</p>
          <button type="button" onClick={onExercise} className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#102536] px-4 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38]">
            Egzersiz Hidrasyonuna Geç <ArrowRight aria-hidden="true" className="size-4" />
          </button>
        </div>

        <MethodologyDisclosure label="Nasıl belirlendi?">
          <p>Bu değer seçilen EFSA yetişkin kategorisinin toplam su Yeterli Alım (Adequate Intake) referansıdır; kişisel kesin gereksinim değildir.</p>
          <p>Kadın referansı 2,0 L/gün, erkek referansı 2,5 L/gündür. mL değeri aynı canonical litre değerinin ×1.000 dönüşümüdür.</p>
          <p>Kaynak: EFSA NDA (2010), DOI 10.2903/j.efsa.2010.1459.</p>
        </MethodologyDisclosure>
        <EditReferenceButton onClick={() => setResult(null)} />
      </article>
    );
  }

  if (result?.type === "NO_NUMERIC_RESULT") {
    return <BlockedResult onEdit={() => setResult(null)} />;
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="[@media(min-width:1024px)_and_(max-height:850px)]:[&_label]:min-h-11 [@media(min-width:1024px)_and_(max-height:850px)]:[&_label]:py-2">
        <SelectionCards legend="EFSA yetişkin referans kategorisi" name="dailyCategory" value={form.category} options={categoryOptions} columns={2} error={errors.category} onChange={(value) => update("category", value)} />
      </div>
      <div className="mt-3">
        <ScopeConfirmation
          checked={form.adultConfirmed && form.standardAdultScope}
          onChange={(checked) => {
            setForm((current) => ({ ...current, adultConfirmed: checked, standardAdultScope: checked }));
            setErrors((current) => ({ ...current, adultConfirmed: "", standardAdultScope: "" }));
            setResult(null);
          }}
          label="Standart yetişkin kapsamındayım (18+)"
          disclosure={dailySafety}
          error={errors.adultConfirmed || errors.standardAdultScope}
        />
      </div>
      <FormAction>Su Referansımı Göster</FormAction>
    </form>
  );
}

function ExerciseModeChoice({ onSelect }: { onSelect: (mode: Exclude<ExerciseMode, null>) => void }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold tracking-[-0.03em]">Egzersiz Hidrasyonu</h2>
      <p className="mt-1 text-sm text-[#5c6c78]">Bağlamsal rehber veya tartı temelli ölçüm yöntemini seç.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {([
          ["quick", "Hızlı Hidrasyon Rehberi", "Tartılmadan egzersiz koşullarını değerlendir."],
          ["measure", "Terleme Hızımı Ölç", "Antrenman öncesi ve sonrası ölçümle kişisel terleme hızını hesapla."],
        ] as const).map(([mode, title, description]) => (
          <button key={mode} type="button" onClick={() => onSelect(mode)} className="min-h-28 rounded-2xl border border-[#11283a]/12 bg-white p-4 text-left transition hover:border-[#9f7b38]/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38]">
            <span className="flex items-center justify-between font-bold">{title}<ArrowRight aria-hidden="true" className="size-4 text-[#8c6a2d]" /></span>
            <span className="mt-2 block text-sm leading-5 text-[#5c6c78]">{description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function QuickGuide({ onBack, onMeasure }: { onBack: () => void; onMeasure: () => void }) {
  const [form, setForm] = useState<QuickForm>(initialQuick);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuickHydrationEvaluation | null>(null);

  function update<K extends keyof QuickForm>(key: K, value: QuickForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
    setResult(null);
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = buildQuickHydrationGuide({
      durationMinutes: form.durationMinutes,
      environment: form.environment as HydrationEnvironment,
      perceivedSweat: form.perceivedSweat as PerceivedSweat,
      standardAdultScope: form.standardAdultScope,
    });
    if (next.status === "invalid") {
      setErrors({ [next.field]: next.message });
      return;
    }
    setResult(next);
  }

  if (result?.status === "ready") {
    return (
      <article aria-live="polite">
        <BackButton onClick={onBack} />
        <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-[#8c6a2d]">Hızlı rehber</p>
        <h2 className="mt-1.5 text-2xl font-semibold">Egzersiz hidrasyonu bağlamın</h2>
        <p className="mt-2 max-w-4xl text-balance text-xl font-semibold leading-7 tracking-[-0.02em] text-[#102536]">{result.summary}</p>
        <div className="mt-3 flex flex-wrap gap-2" aria-label="Rehber bağlamı">
          <ContextChip>{form.durationMinutes} dk</ContextChip>
          <ContextChip>{environmentLabels[form.environment as HydrationEnvironment]}</ContextChip>
          <ContextChip>{sweatLabels[form.perceivedSweat as PerceivedSweat]}</ContextChip>
        </div>
        <div className="mt-4 border-t border-[#11283a]/10 pt-3">
          <h3 className="text-sm font-bold">Antrenmanda ne yapabilirsin?</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-5 text-[#5c6c78]">
            <li>Susama sinyallerini göz ardı etme.</li>
            <li>Sıvıya erişimini önceden planla.</li>
            <li>Aşırı sıvıyı zorla tüketme.</li>
          </ul>
        </div>
        <MethodologyDisclosure label="Bu rehber nasıl çalışıyor?">
          <p>{result.durationGuidance}</p>
          <p>{result.environmentGuidance}</p>
          <p>{result.sweatGuidance}</p>
          <p>Öznel terleme seçimi L/saat değerine dönüştürülmez; yalnızca bağlamsal rehberi şekillendirir.</p>
        </MethodologyDisclosure>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={onMeasure} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#102536] bg-[#102536] px-4 text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38]">Terleme Hızımı Ölç <ArrowRight className="size-4" /></button>
          <button type="button" onClick={() => setResult(null)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#11283a]/15 px-4 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38]"><RotateCcw className="size-4" /> Değerleri Düzenle</button>
        </div>
      </article>
    );
  }

  if (result?.status === "blocked") return <BlockedResult onEdit={() => setResult(null)} />;

  return (
    <form onSubmit={submit} noValidate>
      <BackButton onClick={onBack} />
      <h2 className="mt-3 text-2xl font-semibold [@media(min-width:1024px)_and_(max-height:850px)]:mt-1.5">Hızlı Hidrasyon Rehberi</h2>
      <p className="mt-1 text-sm text-[#5c6c78]">Antrenman koşullarını seç.</p>
      <label className="mt-3 block text-sm font-bold">
        <span className="flex items-center justify-between"><span>Antrenman Süresi</span><strong>{form.durationMinutes} dk</strong></span>
        <input type="range" min={30} max={180} step={5} value={form.durationMinutes} onChange={(event) => update("durationMinutes", Number(event.target.value))} className="mt-2 min-h-11 w-full accent-[#9f7b38]" />
      </label>
      <div className="mt-3 [@media(min-width:1024px)_and_(max-height:850px)]:mt-2 [@media(min-width:1024px)_and_(max-height:850px)]:[&_label]:min-h-11 [@media(min-width:1024px)_and_(max-height:850px)]:[&_label]:py-2"><SelectionCards legend="Ortam" name="quickEnvironment" value={form.environment} options={environmentOptions} error={errors.environment} onChange={(value) => update("environment", value)} /></div>
      <div className="mt-3 [@media(min-width:1024px)_and_(max-height:850px)]:mt-2 [@media(min-width:1024px)_and_(max-height:850px)]:[&_label]:min-h-11 [@media(min-width:1024px)_and_(max-height:850px)]:[&_label]:py-2"><SelectionCards legend="Öznel terleme algısı" name="perceivedSweat" value={form.perceivedSweat} options={sweatOptions} error={errors.perceivedSweat} onChange={(value) => update("perceivedSweat", value)} /></div>
      <div className="mt-3"><ScopeConfirmation checked={form.standardAdultScope} onChange={(checked) => update("standardAdultScope", checked)} disclosure={exerciseSafety} /></div>
      <FormAction>Rehberi Gör</FormAction>
    </form>
  );
}

function SweatRateMeasurement({ onBack }: { onBack: () => void }) {
  const [form, setForm] = useState<MeasureForm>(initialMeasure);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<SweatRateEvaluation | null>(null);

  function update<K extends keyof MeasureForm>(key: K, value: MeasureForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "", estimatedSweatLoss: "" }));
    setResult(null);
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = calculateSweatRate({
      preWeightKg: Number(form.preWeightKg),
      postWeightKg: Number(form.postWeightKg),
      fluidConsumedMl: Number(form.fluidConsumedMl),
      durationMinutes: Number(form.durationMinutes),
      exerciseType: form.exerciseType as HydrationExerciseType,
      environment: form.environment as HydrationEnvironment,
      urinationStatus: form.urinationStatus,
      urineMl: form.urinationStatus === "yes" && form.urineMl !== "" ? Number(form.urineMl) : undefined,
      standardAdultScope: form.standardAdultScope,
    });
    if (next.status === "invalid") {
      setErrors({ [next.field]: next.message });
      return;
    }
    setResult(next);
  }

  if (result?.status === "ready") {
    return (
      <article aria-live="polite">
        <BackButton onClick={onBack} />
        <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-[#8c6a2d]">Ölçüm sonucu</p>
        <h2 className="mt-1.5 text-2xl font-semibold">Terleme Hızın</h2>
        <div className="mt-3 flex flex-wrap items-baseline gap-x-2.5">
          <span className="text-5xl font-semibold tracking-[-0.05em]">{formatHydrationValue(result.sweatRateLitersPerHour)}</span>
          <span className="text-xl font-semibold tracking-[-0.02em] text-[#415461]">L/saat</span>
        </div>
        <p className="mt-1.5 text-sm text-[#5c6c78]">Bu ölçüm, mevcut egzersiz ve ortam koşullarındaki tahmini terleme hızını temsil eder.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1.15fr_0.85fr]">
          <GuideCard title="Tahmini seans ter kaybı">{formatHydrationValue(result.estimatedSweatLossLiters)} L</GuideCard>
          <GuideCard title="Ölçüm bağlamı">{exerciseLabels[result.exerciseType]} · {Math.round(result.durationHours * 60)} dk · {environmentLabels[result.environment]}</GuideCard>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <ResultText title="Nasıl yorumlamalısın?">Benzer egzersiz ve ortam koşullarındaki planlamaya yardımcı olabilir. Terleme hızı koşullara göre değişebilir; kaybın tamamını otomatik olarak yerine koyma hedefi değildir.</ResultText>
          <ResultText title="Ölçüm notu">Sonucun doğruluğu tartım ve sıvı ölçümlerinin doğruluğuna bağlıdır.</ResultText>
        </div>
        <details className="mt-4 rounded-xl border border-[#11283a]/10 bg-white px-4 py-1.5">
          <summary className="flex min-h-9 cursor-pointer list-none items-center justify-between text-sm font-bold focus-visible:ring-2 focus-visible:ring-[#9f7b38] [&::-webkit-details-marker]:hidden">Elektrolitler ne olacak?<ChevronDown className="size-4 text-[#8c6a2d]" /></summary>
          <p className="border-t border-[#11283a]/8 pt-3 text-sm leading-6 text-[#5c6c78]">Terle elektrolitler de kaybedilir; sodyum kaybı kişiler arasında değişebilir. Bu araç mg/saat, kişisel sodyum kaybı veya elektrolit dozu hesaplamaz.</p>
        </details>
        <MethodologyDisclosure>
          <p>Önceki kilo: {formatTwoDecimals(result.preWeightKg)} kg · Sonraki kilo: {formatTwoDecimals(result.postWeightKg)} kg · Ağırlık değişimi: {formatTwoDecimals(result.bodyMassChangeKg)} kg.</p>
          <p>İçilen sıvı: {formatTwoDecimals(result.fluidConsumedLiters)} L · İdrar: {formatTwoDecimals(result.urineLiters)} L · Süre: {formatTwoDecimals(result.durationHours)} saat.</p>
          <p>Tahmini ter kaybı = ağırlık kaybı sıvı eşdeğeri + içilen sıvı − idrar = {formatTwoDecimals(result.estimatedSweatLossLiters)} L.</p>
          <p>Terleme hızı = tahmini ter kaybı ÷ süre = {formatTwoDecimals(result.sweatRateLitersPerHour)} L/saat. Ağırlık değişimi %{formatTwoDecimals(result.bodyMassChangePercentage)}; bu değerden sınıflandırma üretilmez.</p>
          <p>Egzersiz türü ve ortam hesaplamayı değiştirmez; yalnız ölçüm bağlamını tanımlar.</p>
        </MethodologyDisclosure>
        <p className="mt-3 text-sm leading-5 text-[#5c6c78]">Terleme hızı ölçümü günlük toplam su referansının yerine geçmez; belirli egzersiz ve ortam koşullarındaki sıvı kaybını anlamaya yardımcı olur.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={() => { setForm(initialMeasure); setErrors({}); setResult(null); }} className="inline-flex min-h-11 items-center rounded-xl border border-[#102536] bg-[#102536] px-4 text-sm font-bold text-white focus-visible:ring-2 focus-visible:ring-[#9f7b38]">Yeni Ölçüm Yap</button>
          <button type="button" onClick={() => setResult(null)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#11283a]/15 px-4 text-sm font-bold focus-visible:ring-2 focus-visible:ring-[#9f7b38]"><RotateCcw className="size-4" /> Değerleri Düzenle</button>
        </div>
      </article>
    );
  }

  if (result?.status === "blocked") return <BlockedResult onEdit={() => setResult(null)} />;

  return (
    <form onSubmit={submit} noValidate>
      <BackButton onClick={onBack} />
      <h2 className="mt-3 text-2xl font-semibold">Terleme Hızımı Ölç</h2>
      <details className="mt-2.5 rounded-xl border border-[#11283a]/10 bg-white px-4 py-1.5">
        <summary className="flex min-h-9 cursor-pointer list-none items-center justify-between text-sm font-bold focus-visible:ring-2 focus-visible:ring-[#9f7b38] [&::-webkit-details-marker]:hidden">Nasıl doğru ölçerim?<ChevronDown className="size-4 text-[#8c6a2d]" /></summary>
        <p className="border-t border-[#11283a]/8 pt-3 text-sm leading-6 text-[#5c6c78]">Aynı tartıyı ve benzer kıyafet koşullarını kullan; ölçümleri seansa yakın yap; ıslak kıyafetlerin etkisini dikkate al ve içilen sıvıyı mümkün olduğunca doğru ölç.</p>
      </details>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 [@media(min-width:1024px)_and_(max-height:850px)]:gap-2.5">
        <NumberInput id="preWeightKg" label="Antrenman öncesi kilo" unit="kg" step={0.1} value={form.preWeightKg} error={errors.preWeightKg} onChange={(value) => update("preWeightKg", value)} />
        <NumberInput id="postWeightKg" label="Antrenman sonrası kilo" unit="kg" step={0.1} value={form.postWeightKg} error={errors.postWeightKg} onChange={(value) => update("postWeightKg", value)} />
        <NumberInput id="fluidConsumedMl" label="Antrenman sırasında içtiğin sıvı" unit="mL" step={1} min={0} value={form.fluidConsumedMl} error={errors.fluidConsumedMl} onChange={(value) => update("fluidConsumedMl", value)} />
        <NumberInput id="durationMinutes" label="Antrenman süresi" unit="dk" step={1} value={form.durationMinutes} error={errors.durationMinutes} onChange={(value) => update("durationMinutes", value)} />
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-[0.85fr_2.15fr] lg:items-start [@media(min-width:1024px)_and_(max-height:850px)]:mt-2.5">
        <SelectInput id="exerciseType" label="Egzersiz türü" value={form.exerciseType} error={errors.exerciseType} onChange={(value) => update("exerciseType", value as HydrationExerciseType)} options={[["resistance", "Direnç Antrenmanı"], ["cardio_running", "Kardiyo / Koşu"], ["team_sport", "Takım Sporu"], ["other", "Diğer"]]} />
        <div className="[@media(min-width:1024px)_and_(max-height:850px)]:[&_label]:min-h-11 [@media(min-width:1024px)_and_(max-height:850px)]:[&_label]:py-2"><SelectionCards legend="Ortam" name="measureEnvironment" value={form.environment} options={environmentOptions} error={errors.environment} onChange={(value) => update("environment", value)} /></div>
      </div>
      <fieldset className="mt-3">
        <legend className="text-sm font-bold">Antrenman sırasında idrar yaptın mı?</legend>
        <div className="mt-2 flex gap-2">
          {(["no", "yes"] as const).map((status) => <label key={status} className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border px-4 text-sm font-bold ${form.urinationStatus === status ? "border-[#9f7b38] bg-[#efe5d0]/70" : "border-[#11283a]/12 bg-white"}`}><input type="radio" name="urinationStatus" checked={form.urinationStatus === status} onChange={() => update("urinationStatus", status)} className="accent-[#9f7b38]" />{status === "no" ? "Hayır" : "Evet"}</label>)}
        </div>
      </fieldset>
      {form.urinationStatus === "yes" && <div className="mt-3 max-w-xs"><NumberInput id="urineMl" label="İdrar miktarı" unit="mL" step={1} min={0} value={form.urineMl} error={errors.urineMl} onChange={(value) => update("urineMl", value)} /></div>}
      {errors.estimatedSweatLoss && <FieldError>{errors.estimatedSweatLoss}</FieldError>}
      <div className="mt-3"><ScopeConfirmation checked={form.standardAdultScope} onChange={(checked) => update("standardAdultScope", checked)} disclosure={exerciseSafety} /></div>
      <FormAction>Terleme Hızımı Hesapla</FormAction>
    </form>
  );
}

function NumberInput({ id, label, unit, value, step, min, error, onChange }: { id: string; label: string; unit: string; value: string; step: number; min?: number; error?: string; onChange: (value: string) => void }) {
  return <label htmlFor={id} className="text-sm font-bold">{label} <span className="font-normal text-[#71808b]">{unit}</span><input id={id} type="number" inputMode="decimal" step={step} min={min} value={value} onChange={(event) => onChange(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className={`${referenceInputClasses} [@media(min-width:1024px)_and_(max-height:850px)]:mt-1 [@media(min-width:1024px)_and_(max-height:850px)]:min-h-11`} />{error && <FieldError id={`${id}-error`}>{error}</FieldError>}</label>;
}

function SelectInput({ id, label, value, options, error, onChange }: { id: string; label: string; value: string; options: readonly (readonly [string, string])[]; error?: string; onChange: (value: string) => void }) {
  return <label htmlFor={id} className="text-sm font-bold text-[#415461]">{label}<select id={id} value={value} onChange={(event) => onChange(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className={`${referenceInputClasses} [@media(min-width:1024px)_and_(max-height:850px)]:mt-1 [@media(min-width:1024px)_and_(max-height:850px)]:min-h-11`}><option value="">Seçiniz</option>{options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}</select>{error && <FieldError id={`${id}-error`}>{error}</FieldError>}</label>;
}

function FormAction({ children }: { children: React.ReactNode }) {
  return <div className="mt-4 flex justify-end [@media(min-width:1024px)_and_(max-height:850px)]:mt-3"><button type="submit" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#102536] bg-[#102536] px-5 text-sm font-bold text-white transition hover:bg-[#173247] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38]">{children}<ArrowRight className="size-4" /></button></div>;
}

function BackButton({ onClick }: { onClick: () => void }) {
  return <button type="button" onClick={onClick} className="inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold text-[#657581] transition hover:text-[#102536] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38]"><ArrowLeft className="size-3.5" /> Yöntem seçimine dön</button>;
}

function ResultText({ title, children }: { title: string; children: React.ReactNode }) {
  return <div><h3 className="text-sm font-bold">{title}</h3><p className="mt-1 text-sm leading-5 text-[#5c6c78]">{children}</p></div>;
}

function GuideCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="rounded-xl border border-[#11283a]/10 bg-white p-3"><h3 className="text-sm font-bold">{title}</h3><p className="mt-1 text-sm leading-5 text-[#5c6c78]">{children}</p></div>;
}

function ContextChip({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex min-h-8 items-center rounded-full border border-[#9f7b38]/25 bg-[#efe5d0]/55 px-3 text-xs font-bold text-[#594820]">{children}</span>;
}

function BlockedResult({ onEdit }: { onEdit: () => void }) {
  return <article aria-live="polite"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9d6f22]">Kapsam kontrolü</p><h2 className="mt-2 text-2xl font-semibold">Standart aracın kapsamı dışında</h2><p className="mt-2 text-sm leading-6 text-[#5c6c78]">Bu bağlamda sayısal sonuç veya kişisel egzersiz hidrasyonu değerlendirmesi gösterilmedi. Klinik talimat önceliklidir.</p><EditReferenceButton onClick={onEdit} /></article>;
}

function formatHydrationValue(value: number) {
  return value.toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 2 });
}

function formatTwoDecimals(value: number) {
  return value.toLocaleString("tr-TR", { maximumFractionDigits: 2 });
}
