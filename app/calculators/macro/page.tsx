"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, ChevronDown, Pencil } from "lucide-react";

import CalculatorLayout from "@/components/calculators/CalculatorLayout";
import CTAButton from "@/components/ui/CTAButton";
import {
  calculateMacroDistribution,
  CALORIE_GOALS,
  DEFAULT_CALORIE_GOAL,
  validateCalculatorField,
  type CalculatorField,
  type CalculatorFormValues,
  type CalculatorValidationErrors,
  type Goal,
  type MacroDistribution,
  type MacroEvaluation,
  type MacroResistanceTraining,
  type MacroScope,
} from "@/lib/calculators";
import { ENERGY_LAB_PATH } from "@/lib/routes";

type MacroStage = 1 | 2 | "result";
type CalorieSource = "manual" | "prefill";

const resistanceOptions = [
  { label: "Evet", value: "yes" },
  { label: "Hayır", value: "no" },
] as const;

const scopeOptions = [
  { label: "Genel yetişkin kapsamındayım", value: "standardAdult" },
  { label: "Bu hesaplama benim durumuma uygun olmayabilir", value: "outsideStandardScope" },
] as const;

const macroFields: readonly CalculatorField[] = [
  { name: "weight", label: "Vücut ağırlığın", type: "number", required: true, min: 25, max: 400 },
  { name: "height", label: "Boyun", type: "number", required: true, min: 100, max: 250 },
  { name: "calories", label: "Günlük kalori hedefin", type: "number", required: true, min: 1000, max: 8000 },
  { name: "goal", label: "Hedefin", type: "radio", options: CALORIE_GOALS, required: true },
  { name: "resistanceTraining", label: "Direnç antrenmanı", type: "radio", options: resistanceOptions, required: true },
  { name: "scope", label: "Kapsam", type: "radio", options: scopeOptions, required: true },
];

const initialValues: CalculatorFormValues = {
  calories: "",
  weight: "",
  height: "",
  goal: DEFAULT_CALORIE_GOAL,
  resistanceTraining: "",
  scope: "",
};

const goalContent: Record<Goal, { title: string; description: string }> = {
  lose: { title: "Yağ Kaybı", description: "Yağ kaybı hedefi için başlangıç dağılımı." },
  maintain: { title: "Kilomu Koru", description: "Mevcut kalori hedefin için başlangıç dağılımı." },
  gain: { title: "Kas Kazanımı", description: "Kuvvet antrenmanı yapanlar için başlangıç dağılımı." },
};

export default function MacroCalculatorPage() {
  const [stage, setStage] = useState<MacroStage>(1);
  const [values, setValues] = useState<CalculatorFormValues>(initialValues);
  const [errors, setErrors] = useState<CalculatorValidationErrors>({});
  const [evaluation, setEvaluation] = useState<MacroEvaluation | null>(null);
  const [calorieSource, setCalorieSource] = useState<CalorieSource>("manual");
  const calorieEnteredRef = useRef(false);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);

  const applyCaloriePrefill = useCallback((calories: string) => {
    if (calorieEnteredRef.current) return;
    calorieEnteredRef.current = true;
    setCalorieSource("prefill");
    setValues((currentValues) =>
      currentValues.calories === "" ? { ...currentValues, calories } : currentValues,
    );
  }, []);

  function handleFieldChange(name: string, value: CalculatorFormValues[string]) {
    if (name === "calories") {
      calorieEnteredRef.current = true;
      setCalorieSource("manual");
    }
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: undefined }));
    setEvaluation(null);
  }

  function focusField(name: string) {
    const selector = ["goal", "resistanceTraining", "scope"].includes(name)
      ? `input[name="${name}"]`
      : `#macro-${name}`;
    requestAnimationFrame(() => document.querySelector<HTMLElement>(selector)?.focus());
  }

  function validateFields(names: readonly string[]) {
    const nextErrors: CalculatorValidationErrors = {};
    for (const field of macroFields.filter((candidate) => names.includes(candidate.name))) {
      const error = validateCalculatorField(field, values[field.name]);
      if (error) nextErrors[field.name] = error;
    }
    setErrors((currentErrors) => {
      const cleared = { ...currentErrors };
      for (const name of names) cleared[name] = undefined;
      return { ...cleared, ...nextErrors };
    });
    const firstError = names.find((name) => nextErrors[name]);
    if (firstError) focusField(firstError);
    return !firstError;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (stage === 1) {
      if (validateFields(["weight", "height", "calories"])) setStage(2);
      return;
    }
    if (stage !== 2 || !validateFields(["goal", "resistanceTraining", "scope"])) return;

    try {
      const nextEvaluation = calculateMacroDistribution({
        calories: Number(values.calories),
        weight: Number(values.weight),
        height: Number(values.height),
        goal: values.goal as Goal,
        resistanceTraining: values.resistanceTraining as MacroResistanceTraining,
        scope: values.scope as MacroScope,
      });
      setEvaluation(nextEvaluation);
      setStage("result");
      requestAnimationFrame(() => resultHeadingRef.current?.focus());
    } catch (error) {
      setEvaluation(null);
      setStage(1);
      setErrors((currentErrors) => ({
        ...currentErrors,
        calories: error instanceof RangeError ? error.message : "Makro dağılımı bu bilgilerle hesaplanamadı.",
      }));
      focusField("calories");
    }
  }

  const selectedGoal = goalContent[values.goal as Goal]?.title ?? "";
  const trainingLabel = values.resistanceTraining === "yes" ? "Direnç Antrenmanı" : "Direnç Antrenmanı Yok";

  return <>
    <Suspense fallback={null}><CaloriePrefill onPrefill={applyCaloriePrefill} /></Suspense>
    <CalculatorLayout
      title="Makro Planlayıcı"
      seoPath="/calculators/macro"
      description="Günlük kalori hedefini protein, karbonhidrat ve yağlara dağıtmak için bir başlangıç planı oluştur."
      sectionClassName="!py-5 sm:!py-7 lg:!py-7 [@media(min-width:1024px)_and_(max-height:850px)]:!py-2.5"
      contentClassName="space-y-4 lg:space-y-3.5 [@media(min-width:1024px)_and_(max-height:850px)]:space-y-2.5 [@media(min-width:1024px)_and_(max-height:850px)]:[&>header>h1]:!text-4xl [@media(min-width:1024px)_and_(max-height:850px)]:[&>header>p]:!mt-1 [@media(min-width:1024px)_and_(max-height:850px)]:[&>header>p]:text-sm"
      info={<><p>Makro Planlayıcı, verdiğin günlük enerji bütçesini protein, karbonhidrat ve yağa dağıtan bir başlangıç aracıdır; enerji ihtiyacını hesaplamaz.</p><p className="mt-3">Sonuç kişiye özel tıbbi diyet veya herkes için tek doğru makro dağılımı iddiası değildir. Bireysel ihtiyaçlar ve tercihler farklılık gösterebilir.</p></>}
      references={<ReferenceList />}
      disclaimer="Bu araç genel yetişkin kullanımı için bilgilendirme amaçlıdır. Tıbbi beslenme değerlendirmesi veya kişiye özel diyet yerine geçmez."
    >
      {stage === "result" && evaluation ? (
        evaluation.status === "ok" ? (
          <MacroResult distribution={evaluation.distribution} calories={Number(values.calories)} goal={values.goal as Goal} resistanceTraining={values.resistanceTraining as MacroResistanceTraining} selectedGoal={selectedGoal} trainingLabel={trainingLabel} calorieSource={calorieSource} headingRef={resultHeadingRef} onEdit={() => setStage(2)} />
        ) : (
          <BlockedResult evaluation={evaluation} headingRef={resultHeadingRef} onEdit={() => setStage(evaluation.reason === "incompatibleEnergyBudget" ? 1 : 2)} />
        )
      ) : (
        <form id="macro-planner-form" onSubmit={handleSubmit} noValidate className="calculator-surface mx-auto w-full max-w-5xl">
          <MacroStepper stage={stage as 1 | 2} />
          <div className="p-[1.125rem] sm:p-6 lg:px-7 lg:py-5 [@media(min-width:1024px)_and_(max-height:850px)]:!px-5 [@media(min-width:1024px)_and_(max-height:850px)]:!py-3.5">
            {stage === 1 ? <BasicInformationStep values={values} errors={errors} onChange={handleFieldChange} /> : <PlanPreferencesStep values={values} errors={errors} onChange={handleFieldChange} />}
            <div className={`mt-5 flex items-center gap-3 [@media(min-width:1024px)_and_(max-height:850px)]:mt-2.5 ${stage === 1 ? "justify-end" : "justify-between"}`}>
              {stage === 2 && <CTAButton type="button" variant="secondary" className="calculator-action calculator-action--secondary px-4 sm:px-6 [@media(min-width:1024px)_and_(max-height:850px)]:!min-h-11 [@media(min-width:1024px)_and_(max-height:850px)]:!py-2" onClick={() => setStage(1)}><ArrowLeft aria-hidden="true" className="mr-2 size-4" />Geri</CTAButton>}
              <CTAButton type="submit" className="calculator-action group px-5 sm:px-7 [@media(min-width:1024px)_and_(max-height:850px)]:!min-h-11 [@media(min-width:1024px)_and_(max-height:850px)]:!py-2">{stage === 1 ? "Devam Et" : "Dağılımı Oluştur"}<ArrowRight aria-hidden="true" className="ml-2 size-4 text-[#d0af69]" /></CTAButton>
            </div>
          </div>
        </form>
      )}
    </CalculatorLayout>
  </>;
}

function CaloriePrefill({ onPrefill }: { onPrefill: (calories: string) => void }) {
  const searchParams = useSearchParams();
  const caloriePrefill = getCaloriePrefill(searchParams.get("calories"));
  useEffect(() => { if (caloriePrefill) onPrefill(caloriePrefill); }, [caloriePrefill, onPrefill]);
  return null;
}

function getCaloriePrefill(value: string | null) {
  if (value === null || value.trim() === "") return "";
  const calories = Number(value);
  return Number.isInteger(calories) && calories >= 1000 && calories <= 8000 ? String(calories) : "";
}

function MacroStepper({ stage }: { stage: 1 | 2 }) {
  return <ol aria-label="Makro dağılımı adımları" className="grid grid-cols-2 border-b border-[#11283a]/10 px-5 py-3 sm:px-7 [@media(min-width:1024px)_and_(max-height:850px)]:py-2">{["Temel Bilgiler", "Plan Tercihlerin"].map((label, index) => {
    const step = (index + 1) as 1 | 2;
    const completed = stage > step;
    const active = stage === step;
    return <li key={label} aria-current={active ? "step" : undefined} className="relative flex min-w-0 items-center gap-3">{index === 1 && <span aria-hidden="true" className="absolute right-full top-1/2 h-px w-[calc(100%-2.5rem)] -translate-y-1/2 bg-[#11283a]/12" />}<span className={`relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold [@media(min-width:1024px)_and_(max-height:850px)]:size-6 ${active ? "border-[#9f7b38] bg-[#9f7b38] text-white" : completed ? "border-[#9f7b38]/45 bg-[#efe5d0] text-[#6a5429]" : "border-[#11283a]/18 bg-white text-[#71808b]"}`}>{completed ? <Check aria-hidden="true" className="size-3.5" /> : step}</span><span className={`truncate text-xs font-semibold sm:text-sm ${active ? "text-[#102536]" : completed ? "text-[#6a5429]" : "text-[#71808b]"}`}>{label}</span></li>;
  })}</ol>;
}

function BasicInformationStep({ values, errors, onChange }: { values: CalculatorFormValues; errors: CalculatorValidationErrors; onChange: (name: string, value: string) => void }) {
  return <section aria-labelledby="macro-step-one-title"><header><h2 id="macro-step-one-title" className="text-2xl font-semibold tracking-[-0.035em] sm:text-3xl [@media(min-width:1024px)_and_(max-height:850px)]:!text-2xl">Temel bilgilerin</h2><p className="mt-1.5 text-sm leading-6 text-[#657581] [@media(min-width:1024px)_and_(max-height:850px)]:mt-0.5 [@media(min-width:1024px)_and_(max-height:850px)]:leading-5">Makro dağılımını oluşturmak için temel bilgilerini gir.</p></header><div className="mt-5 grid gap-4 md:grid-cols-3 [@media(min-width:1024px)_and_(max-height:850px)]:mt-3 [@media(min-width:1024px)_and_(max-height:850px)]:gap-3"><NumberField id="macro-weight" name="weight" label="Vücut ağırlığı" unit="kg" value={String(values.weight)} min={25} max={400} step={0.1} placeholder="Örn. 75" error={errors.weight} onChange={(value) => onChange("weight", value)} /><NumberField id="macro-height" name="height" label="Boy" unit="cm" value={String(values.height)} min={100} max={250} step={0.1} placeholder="Örn. 175" error={errors.height} onChange={(value) => onChange("height", value)} /><div><NumberField id="macro-calories" name="calories" label="Günlük kalori hedefi" unit="kcal" value={String(values.calories)} min={1000} max={8000} step={1} inputMode="numeric" placeholder="Örn. 2400" error={errors.calories} onChange={(value) => onChange("calories", value)} /><Link href={ENERGY_LAB_PATH} className="calculator-choice mt-2.5 flex min-h-11 items-center justify-between gap-3 px-3.5 py-2 text-xs font-semibold text-[#6a5429] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38] [@media(min-width:1024px)_and_(max-height:850px)]:mt-1.5"><span>Kalori hedefini bilmiyor musun? <strong className="font-bold text-[#102536]">Energy Lab ile hesapla</strong></span><ArrowRight aria-hidden="true" className="size-3.5 shrink-0 text-[#9f7b38]" /></Link></div></div></section>;
}

function PlanPreferencesStep({ values, errors, onChange }: { values: CalculatorFormValues; errors: CalculatorValidationErrors; onChange: (name: string, value: string) => void }) {
  return <section aria-labelledby="macro-step-two-title"><header><h2 id="macro-step-two-title" className="text-2xl font-semibold tracking-[-0.035em] sm:text-3xl [@media(min-width:1024px)_and_(max-height:850px)]:!text-2xl">Plan tercihlerin</h2><p className="mt-1.5 text-sm leading-6 text-slate-400 [@media(min-width:1024px)_and_(max-height:850px)]:mt-0.5 [@media(min-width:1024px)_and_(max-height:850px)]:leading-5">Hedefini, kuvvet antrenmanı durumunu ve bu genel hesaplamanın sana uygun olup olmadığını belirt.</p></header>
    <fieldset className="mt-4 [@media(min-width:1024px)_and_(max-height:850px)]:mt-2.5" aria-describedby={errors.goal ? "macro-goal-error" : undefined}><legend className="text-sm font-semibold text-slate-200">Hedefin nedir?</legend><div className="mt-2.5 grid gap-2.5 md:grid-cols-3 [@media(min-width:1024px)_and_(max-height:850px)]:mt-1.5 [@media(min-width:1024px)_and_(max-height:850px)]:gap-2">{(Object.keys(goalContent) as Goal[]).map((value) => <ChoiceCard key={value} name="goal" value={value} title={goalContent[value].title} description={goalContent[value].description} selected={values.goal === value} onChange={() => onChange("goal", value)} />)}</div>{errors.goal && <FieldError id="macro-goal-error">{errors.goal}</FieldError>}</fieldset>
    <fieldset className="mt-4 [@media(min-width:1024px)_and_(max-height:850px)]:mt-2.5" aria-describedby={`macro-resistance-helper${errors.resistanceTraining ? " macro-resistance-error" : ""}`}><legend className="text-sm font-semibold text-slate-200">Düzenli direnç antrenmanı yapıyor musun?</legend><p id="macro-resistance-helper" className="mt-0.5 text-xs leading-5 text-slate-400 [@media(min-width:1024px)_and_(max-height:850px)]:leading-4">Ağırlık, makine veya vücut ağırlığıyla yapılan kuvvet çalışmaları bu gruba girer. Bu bilgi protein hesabında kullanılacak referansı belirler.</p><div className="mt-2.5 grid gap-2.5 sm:grid-cols-2 [@media(min-width:1024px)_and_(max-height:850px)]:mt-1.5 [@media(min-width:1024px)_and_(max-height:850px)]:gap-2">{resistanceOptions.map((option) => <ChoiceCard key={option.value} name="resistanceTraining" value={option.value} title={option.label} selected={values.resistanceTraining === option.value} onChange={() => onChange("resistanceTraining", option.value)} />)}</div>{errors.resistanceTraining && <FieldError id="macro-resistance-error">{errors.resistanceTraining}</FieldError>}</fieldset>
    <fieldset className="mt-4 rounded-2xl border border-white/10 bg-[#071523]/55 p-3.5 [@media(min-width:1024px)_and_(max-height:850px)]:mt-2.5 [@media(min-width:1024px)_and_(max-height:850px)]:p-2.5" aria-describedby={`macro-scope-helper${errors.scope ? " macro-scope-error" : ""}`}><legend className="px-1 text-sm font-semibold text-slate-200">Bu genel hesaplama sana uygun mu?</legend><p id="macro-scope-helper" className="text-xs leading-5 text-slate-400">Devam etmeden önce uygunluk durumunu seç.</p><div className="mt-2.5 grid gap-2.5 sm:grid-cols-2 [@media(min-width:1024px)_and_(max-height:850px)]:mt-1.5 [@media(min-width:1024px)_and_(max-height:850px)]:gap-2">{scopeOptions.map((option) => <ChoiceCard key={option.value} name="scope" value={option.value} title={option.label} selected={values.scope === option.value} onChange={() => onChange("scope", option.value)} />)}</div><details className="group mt-2.5 text-xs text-slate-400 [@media(min-width:1024px)_and_(max-height:850px)]:mt-1.5"><summary className="cursor-pointer list-none font-semibold text-[#d0af69] underline-offset-4 hover:underline focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d0af69] [&::-webkit-details-marker]:hidden">Kimler için uygun değildir?<ChevronDown aria-hidden="true" className="ml-1 inline size-3.5 transition group-open:rotate-180" /></summary><p className="mt-1.5 leading-5">18 yaş altı; gebelik/emzirme; aktif yeme bozukluğu veya yüksek risk; Sporda Göreceli Enerji Eksikliği (RED-S) ya da düşük enerji kullanılabilirliği şüphesi; klinik hastalık/özel tıbbi diyet ya da fizik yarışması hazırlığı genel hesaplama kapsamı dışındadır.</p></details>{errors.scope && <FieldError id="macro-scope-error">{errors.scope}</FieldError>}</fieldset>
  </section>;
}

function ChoiceCard({ name, value, title, description, selected, onChange }: { name: string; value: string; title: string; description?: string; selected: boolean; onChange: () => void }) {
  return <label data-selected={selected} className="calculator-choice relative flex min-h-13 cursor-pointer items-start justify-between gap-3 px-3.5 py-3 [@media(min-width:1024px)_and_(max-height:850px)]:min-h-11 [@media(min-width:1024px)_and_(max-height:850px)]:px-3 [@media(min-width:1024px)_and_(max-height:850px)]:py-2"><input type="radio" name={name} value={value} checked={selected} required onChange={onChange} className="sr-only" /><span className="min-w-0"><span className="block text-sm font-bold text-[#102536]">{title}</span>{description && <span className="mt-1 block text-xs leading-5 text-[#657581] [@media(min-width:1024px)_and_(max-height:850px)]:mt-0.5 [@media(min-width:1024px)_and_(max-height:850px)]:leading-4">{description}</span>}</span><span aria-hidden="true" className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border ${selected ? "border-[#9f7b38] bg-[#9f7b38] text-white" : "border-[#11283a]/25 text-transparent"}`}><Check className="size-3" /></span>{selected && <span className="sr-only">Seçili</span>}</label>;
}

function MacroResult({ distribution, calories, goal, resistanceTraining, selectedGoal, trainingLabel, calorieSource, headingRef, onEdit }: { distribution: MacroDistribution; calories: number; goal: Goal; resistanceTraining: MacroResistanceTraining; selectedGoal: string; trainingLabel: string; calorieSource: CalorieSource; headingRef: React.RefObject<HTMLHeadingElement | null>; onEdit: () => void }) {
  const macros = [{ label: "Protein", grams: distribution.protein, percentage: distribution.proteinPercentage }, { label: "Karbonhidrat", grams: distribution.carbohydrates, percentage: distribution.carbohydratePercentage }, { label: "Yağ", grams: distribution.fat, percentage: distribution.fatPercentage }];
  return <article className="calculator-result mx-auto w-full max-w-5xl p-[1.125rem] sm:p-7 lg:p-7 [@media(min-width:1024px)_and_(max-height:850px)]:!p-[1.125rem]"><header className="text-center"><p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#d0af69]">Sonucun</p><h2 ref={headingRef} tabIndex={-1} className="mt-2 text-3xl font-semibold tracking-[-0.04em] outline-none sm:text-4xl [@media(min-width:1024px)_and_(max-height:850px)]:mt-1 [@media(min-width:1024px)_and_(max-height:850px)]:!text-3xl">Günlük Makro Dağılımın</h2><p className="mt-2 text-xs text-slate-400 [@media(min-width:1024px)_and_(max-height:850px)]:mt-1">Kullandığın günlük kalori hedefi: <strong className="font-semibold text-slate-200">{calories.toLocaleString("tr-TR", { maximumFractionDigits: 1 })} kcal</strong> · {selectedGoal} · {trainingLabel}</p></header>
    <dl className="mt-5 grid gap-3 sm:grid-cols-3 [@media(min-width:1024px)_and_(max-height:850px)]:mt-3">{macros.map((macro) => <div key={macro.label} className="rounded-2xl border border-white/10 bg-[#071523]/75 p-[1.125rem] text-center [@media(min-width:1024px)_and_(max-height:850px)]:p-2.5"><dt className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{macro.label}</dt><dd className="mt-2.5 text-4xl font-semibold tracking-[-0.04em] [@media(min-width:1024px)_and_(max-height:850px)]:mt-1 [@media(min-width:1024px)_and_(max-height:850px)]:text-3xl">{macro.grams} g</dd><dd className="mt-1 text-sm font-semibold text-[#d0af69]">%{formatPercentage(macro.percentage)}</dd></div>)}</dl>
    <p className="mt-2 text-center text-xs leading-5 text-slate-400">Yüzdeler gramların değil, toplam kalorinin her makrodan gelen payını gösterir.</p>
    <div className="mt-3 flex flex-col gap-1 rounded-2xl border border-white/10 bg-[#071523]/55 px-[1.125rem] py-3.5 sm:flex-row sm:items-center sm:justify-between [@media(min-width:1024px)_and_(max-height:850px)]:px-3.5 [@media(min-width:1024px)_and_(max-height:850px)]:py-1.5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Lif referansı</p><p className="text-lg font-semibold text-white">≥{distribution.fiberReferenceGrams} g / gün</p><p className="text-xs leading-5 text-slate-400 sm:max-w-xs sm:text-right">Bu genel yetişkin referansı makro gramlarına veya kalori hedefine ayrıca eklenmez.</p></div>
    <div className="mt-3.5 flex justify-end [@media(min-width:1024px)_and_(max-height:850px)]:mt-2.5"><CTAButton type="button" variant="secondary" className="[@media(min-width:1024px)_and_(max-height:850px)]:!min-h-11 [@media(min-width:1024px)_and_(max-height:850px)]:!py-2" onClick={onEdit}><Pencil aria-hidden="true" className="mr-2 size-4" />Planı Düzenle</CTAButton></div>
    <section className="mt-4 rounded-2xl border border-[#d0af69]/20 bg-[#d0af69]/[.06] p-[1.125rem]"><h3 className="text-sm font-semibold text-[#f0dfba]">Bu dağılım ne anlama geliyor?</h3><p className="mt-1.5 text-sm leading-6 text-slate-300">Bu değerler günlük planlama için başlangıç noktalarıdır; kesin gereksinim veya zorunlu oran değildir.</p>{calorieSource === "manual" && <p className="mt-1.5 text-xs leading-5 text-slate-400">Makro Planlayıcı girdiğin kalori hedefini kullanır; bu hedefin enerji ihtiyacına uygunluğunu ayrıca değerlendirmez.</p>}<p className="mt-1.5 text-xs leading-5 text-slate-400">{getProteinContext(goal, resistanceTraining)}</p>{distribution.usesReferenceWeight && <p className="mt-1.5 text-xs font-semibold leading-5 text-[#ead5a8]">Protein hesabında gerçek kilon yerine BMI 30’a karşılık gelen ağırlık kullanıldı; bu fizyolojik ideal ağırlık değildir.</p>}{distribution.warnings.includes("lowBmi") && <p className="mt-1.5 text-xs font-semibold text-[#ead5a8]">Bu sonuç kilo kaybına yönlendirme amacı taşımaz.</p>}</section>
    <details className="group mt-3.5 rounded-2xl border border-white/10 bg-[#071523]/55 [@media(min-width:1024px)_and_(max-height:850px)]:mt-2.5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-[1.125rem] py-3.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#d0af69] [&::-webkit-details-marker]:hidden [@media(min-width:1024px)_and_(max-height:850px)]:py-2.5">Nasıl hesaplandı?<ChevronDown aria-hidden="true" className="size-4 text-[#d0af69] transition group-open:rotate-180" /></summary><div className="grid gap-4 border-t border-white/10 px-5 py-5 text-sm leading-6 text-slate-400 sm:grid-cols-2"><MethodItem title="Protein">{getProteinContext(goal, resistanceTraining)}</MethodItem><MethodItem title="Protein için kanıt sınırı">{getProteinEvidenceNote(goal, resistanceTraining)}</MethodItem>{distribution.usesReferenceWeight && <MethodItem title="Protein hesabında kullanılan ağırlık">BMI 30 veya üzerinde <code>min(gerçek kilo, 30 × boy²)</code> kullanılır. Bu, protein hesabının yüksek vücut ağırlıklarında sınırsız artmasını önleyen ihtiyatlı bir Trainology hesaplama yaklaşımıdır. Dayandığı kanıt dolaylı ve popülasyona bağlıdır; değer ideal, sağlıklı veya hedef kilo değildir.</MethodItem>}<MethodItem title="Yağ">Toplam enerjinin %30’u, EFSA yetişkin referans aralığı olan %20–35 içinde bir başlangıç payı olarak ayrıldı; ideal veya üstün oran olduğu iddia edilmez.</MethodItem><MethodItem title="Karbonhidrat">Protein ve yağ ayrıldıktan sonra kalan enerjiden hesaplandı.</MethodItem><MethodItem title="Lif">≥25 g/gün genel yetişkin referansı sonuç enerjisine ayrıca eklenmedi.</MethodItem><MethodItem title="Enerji dönüşümü">Protein ve karbonhidrat için 4 kcal/g, yağ için 9 kcal/g kullanıldı.</MethodItem><MethodItem title="Yuvarlama">Ara hesaplamalar yuvarlanmadı. Gramlar yalnız gösterimde tam sayıya yuvarlandı; toplam enerji birkaç kcal farklı görünebilir.</MethodItem></div></details>
    </article>;
}

function BlockedResult({ evaluation, headingRef, onEdit }: { evaluation: Extract<MacroEvaluation, { status: "blocked" }>; headingRef: React.RefObject<HTMLHeadingElement | null>; onEdit: () => void }) {
  return <section className="calculator-result mx-auto w-full max-w-3xl p-6 sm:p-9"><p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#d0af69]">Makro dağılımı oluşturulmadı</p><h2 ref={headingRef} tabIndex={-1} className="mt-4 text-2xl font-semibold outline-none sm:text-3xl">Bilgilerini gözden geçir</h2><p className="mt-4 text-sm leading-7 text-slate-300">{evaluation.message}</p><p className="mt-3 text-xs leading-6 text-slate-400">Bu durum tıbbi değerlendirme veya tanı değildir.</p><div className="mt-6"><CTAButton type="button" variant="secondary" onClick={onEdit}><Pencil aria-hidden="true" className="mr-2 size-4" />Planı Düzenle</CTAButton></div></section>;
}

function getProteinContext(goal: Goal, resistanceTraining: MacroResistanceTraining) {
  if (resistanceTraining === "yes" && goal === "lose") return "Enerji açığında protein ihtiyacı bazı kişilerde artabilir. Hesaplamada 1,6 g/kg/gün başlangıç değeri kullanıldı.";
  if (resistanceTraining === "yes") return "Protein hesabında yaklaşık 1,6 g/kg/gün başlangıç referansı kullanıldı.";
  if (goal === "maintain") return "Protein hesabında genel yetişkin protein yeterlilik referansı kullanıldı.";
  return "Yağ kaybı hedefinde 1,2 g/kg/gün koşullu başlangıç değeri kullanıldı; bu evrensel bir protein gereksinimi değildir.";
}

function getProteinEvidenceNote(goal: Goal, resistanceTraining: MacroResistanceTraining) {
  if (resistanceTraining === "yes") {
    return goal === "lose"
      ? "1,6 g/kg/gün direnç antrenmanı için kanıtla uyumlu bir başlangıç referansı; 1,6–2,0 g/kg/gün ise yağ kaybı döneminde kullanılan pratik aralıktır. Bunlar kesin kişisel gereksinim veya herkes için en iyi değer değildir."
      : "Egzersiz yapan yetişkinler için 1,4–2,0 g/kg/gün aralığı ve direnç antrenmanında yaklaşık 1,6 g/kg/gün başlangıç noktası kaynaklarla uyumludur; 1,6 herkes için en iyi değer olarak kullanılmaz.";
  }
  if (goal === "lose") {
    return "1,2 g/kg/gün, tüm yetişkinler için doğrulanmış tek bir gereksinim değil; enerji kısıtlamasında daha yüksek protein alımını destekleyen kanıtlardan türetilmiş ihtiyatlı bir Trainology başlangıç referansıdır.";
  }
  return "0,83 g/kg/gün, EFSA’nın genel yetişkin nüfus referans alımıdır; kesin kişisel gereksinim olarak sunulmaz.";
}

function formatPercentage(value: number) {
  return value.toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

function MethodItem({ title, children }: { title: string; children: React.ReactNode }) {
  return <section><h4 className="font-semibold text-slate-200">{title}</h4><p className="mt-1">{children}</p></section>;
}

function ReferenceList() {
  const references = [
    ["EFSA — Yetişkin protein PRI", "https://www.efsa.europa.eu/en/press/news/120209"],
    ["Jäger ve ark. — ISSN Protein and Exercise", "https://pubmed.ncbi.nlm.nih.gov/28642676/"],
    ["Morton ve ark. — Direnç antrenmanı ve protein meta-analizi", "https://pubmed.ncbi.nlm.nih.gov/28698222/"],
    ["Weijs — Obezitede protein gereksinimi ve kanıt sınırları", "https://pubmed.ncbi.nlm.nih.gov/39514335/"],
    ["EFSA — Yağlar için beslenme referans değerleri", "https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2010.1461"],
    ["WHO — Karbonhidrat ve lif kılavuzu", "https://www.who.int/publications/b/69157"],
  ] as const;
  return <ul className="list-disc space-y-2 pl-5">{references.map(([label, href]) => <li key={href}><a href={href} target="_blank" rel="noreferrer" className="text-[#C9A14A] underline-offset-4 hover:underline">{label}</a></li>)}</ul>;
}

function NumberField({ id, name, label, unit, value, min, max, step, inputMode = "decimal", placeholder, error, onChange }: { id: string; name: string; label: string; unit: string; value: string; min: number; max: number; step: number; inputMode?: "decimal" | "numeric"; placeholder: string; error?: string; onChange: (value: string) => void }) {
  const errorId = `${id}-error`;
  return <label htmlFor={id} className="block text-sm font-semibold text-[#102536]"><span>{label}</span><span className="relative mt-1.5 block [@media(min-width:1024px)_and_(max-height:850px)]:mt-1"><input id={id} name={name} type="number" inputMode={inputMode} min={min} max={max} step={step} required value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} className="calculator-input min-h-12 px-4 pr-16 font-normal placeholder:text-[#89949c] [@media(min-width:1024px)_and_(max-height:850px)]:min-h-11" /><span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#657581]">{unit}</span></span>{error && <FieldError id={errorId}>{error}</FieldError>}</label>;
}

function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return <span id={id} role="alert" className="mt-2 block text-xs font-semibold leading-5 text-[#f0aaa4]">{children}</span>;
}
