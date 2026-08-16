"use client";

import { useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Check,
  Target,
} from "lucide-react";

import CalculatorLayout from "@/components/calculators/CalculatorLayout";
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

const macroFields: readonly CalculatorField[] = [
  {
    name: "weight",
    label: "Kilo",
    type: "number",
    unit: "kg",
    placeholder: "Örneğin 70",
    helperText:
      "Makro Planlayıcının protein tahmini, seçtiğin hedef ve aktivite düzeyine göre değişir.",
    required: true,
    min: 25,
    max: 400,
    step: 0.1,
  },
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

const macroGoalOptions = (["lose", "maintain", "gain"] as const).map(
  (value) => CALORIE_GOALS.find((option) => option.value === value)!,
);

const macroGoalCardLabels: Record<Goal, string> = {
  lose: "Yağ kaybı",
  maintain: "Koruma",
  gain: "Kas kazanımı",
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
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);

  function handleFieldChange(name: string, value: CalculatorFormValues[string]) {
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: undefined }));
    setResult(null);
  }

  function focusField(name: string) {
    const selector =
      name === "goal"
        ? 'input[name="goal"]'
        : `#macro-${name}`;

    requestAnimationFrame(() => {
      document.querySelector<HTMLElement>(selector)?.focus();
    });
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

    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      setResult(null);
      focusField(firstError);
      return;
    }

    try {
      setResult(
        calculateMacroDistribution({
          calories: Number(values.calories),
          weight: Number(values.weight),
          goal: values.goal as Goal,
          activityLevel: values.activityLevel as MacroActivityLevel,
        }),
      );
      requestAnimationFrame(() => resultHeadingRef.current?.focus());
    } catch (error) {
      setResult(null);
      setErrors((currentErrors) => ({
        ...currentErrors,
        calories:
          error instanceof RangeError
            ? error.message
            : "Makro dağılımı bu bilgilerle hesaplanamadı.",
      }));
      focusField("calories");
    }
  }

  const selectedGoal = getOptionLabel(CALORIE_GOALS, String(values.goal));
  const selectedActivity = getOptionLabel(
    MACRO_ACTIVITY_LEVELS,
    String(values.activityLevel),
  );
  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <CalculatorLayout
      title="Makro Planlayıcı"
      seoPath="/calculators/macro"
      description="Günlük kalori hedefin, vücut ağırlığın ve amacın için önerilen makro dağılımını incele."
      sectionClassName="!py-14 sm:!py-16 lg:!py-20"
      contentClassName="space-y-12"
      info={
        <>
          <p>
            Makrolar protein, karbonhidrat ve yağdan oluşur. Protein doku onarımını
            destekler; karbonhidrat antrenman performansına enerji sağlar; yağlar hormon
            ve genel sağlık için gereklidir.
          </p>
          <p className="mt-3">
            Protein miktarı, Makro Planlayıcının kendi hedef ve aktivite tablosundan
            gelen bir başlangıç tahminidir. Yağ aktiviteye göre başlangıç payı olarak
            ayrılır; karbonhidrat kalan enerjiden hesaplanır.
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
              International Society of Sports Nutrition (ISSN) — Position Stand: Diets
              and Body Composition
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
      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,.82fr)_minmax(0,1fr)] lg:items-start xl:grid-cols-[minmax(0,.84fr)_minmax(0,1.16fr)]">
        <form
          id="macro-planner-form"
          onSubmit={handleSubmit}
          noValidate
          className="min-w-0 rounded-3xl border border-white/10 bg-[#0c1924] p-6 text-white shadow-[0_20px_50px_rgba(0,0,0,.18)] sm:p-8"
        >
            <header className="border-b border-white/10 pb-6">
              <h2 className="text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
                Planını oluştur
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                Temel bilgilerini girerek başlangıç makro dağılımını gör.
              </p>
            </header>

            <div className="divide-y divide-white/10">
              <FormSection title="Temel bilgiler">
                <div className="grid gap-5 sm:grid-cols-2">
                  <NumberField
                    id="macro-weight"
                    name="weight"
                    label="Vücut ağırlığın"
                    unit="kg"
                    value={String(values.weight)}
                    min={25}
                    max={400}
                    step={0.1}
                    placeholder="Örn. 70"
                    helper="Makro Planlayıcının protein tahmini, hedef ve aktivite düzeyine göre değişir."
                    error={errors.weight}
                    onChange={(value) => handleFieldChange("weight", value)}
                  />
                  <NumberField
                    id="macro-calories"
                    name="calories"
                    label="Günlük kalori hedefin"
                    unit="kcal"
                    value={String(values.calories)}
                    min={1000}
                    max={8000}
                    step={1}
                    inputMode="numeric"
                    placeholder="Örn. 2400"
                    helper="Mevcut kalori hedefini veya koruma kalorini gir."
                    error={errors.calories}
                    onChange={(value) => handleFieldChange("calories", value)}
                  />
                </div>
              </FormSection>

              <FormSection title="Hedefin">
                <fieldset
                  aria-invalid={Boolean(errors.goal)}
                  aria-describedby={`macro-goal-helper${errors.goal ? " macro-goal-error" : ""}`}
                >
                  <legend className="sr-only">Hedefini seç</legend>
                  <p id="macro-goal-helper" className="text-sm leading-6 text-slate-400">
                    Hedef seçimi, Makro Planlayıcının protein başlangıç tahmininde kullanılan katsayıyı belirleyen girdilerden biridir.
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {macroGoalOptions.map((option) => {
                      const selected = values.goal === option.value;
                      return (
                        <label
                          key={option.value}
                          className={`relative flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition focus-within:ring-2 focus-within:ring-[#d0af69] focus-within:ring-offset-2 focus-within:ring-offset-[#0c1924] ${
                            selected
                              ? "border-[#d0af69] bg-[#d0af69]/[.08] text-white"
                              : "border-white/10 bg-[#071523]/70 text-slate-300 hover:border-white/25"
                          }`}
                        >
                          <input
                            id={`macro-goal-${option.value}`}
                            type="radio"
                            name="goal"
                            value={option.value}
                            checked={selected}
                            required
                            onChange={(event) => handleFieldChange("goal", event.target.value)}
                            className="sr-only"
                          />
                          <span className="text-sm font-bold leading-5">
                            {macroGoalCardLabels[option.value as Goal]}
                          </span>
                          {selected && (
                            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#d0af69] text-[#071523]">
                              <Check aria-hidden="true" className="size-3.5" />
                              <span className="sr-only">Seçili</span>
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                  {errors.goal && <FieldError id="macro-goal-error">{errors.goal}</FieldError>}
                </fieldset>
              </FormSection>

              <FormSection title="Antrenman profilin">
                <SelectField
                  id="macro-activityLevel"
                  name="activityLevel"
                  label="Aktivite seviyesi"
                  value={String(values.activityLevel)}
                  options={MACRO_ACTIVITY_LEVELS}
                  helper="Bu seçim, Makro Planlayıcının protein tahminini ve yağ başlangıç payını belirler."
                  error={errors.activityLevel}
                  onChange={(value) => handleFieldChange("activityLevel", value)}
                />
              </FormSection>
            </div>

            <CTAButton type="submit" className="group mt-2 w-full">
              Makro profilini oluştur
              <ArrowRight
                aria-hidden="true"
                className="ml-2 size-4 transition-transform group-hover:translate-x-1"
              />
            </CTAButton>
        </form>

        <MacroProfilePanel
          result={result}
          calories={Number(values.calories)}
          selectedGoal={selectedGoal}
          selectedActivity={selectedActivity}
          hasErrors={hasErrors}
          headingRef={resultHeadingRef}
        />
      </div>
    </CalculatorLayout>
  );
}

function MacroProfilePanel({
  result,
  calories,
  selectedGoal,
  selectedActivity,
  hasErrors,
  headingRef,
}: {
  result: MacroDistribution | null;
  calories: number;
  selectedGoal: string;
  selectedActivity: string;
  hasErrors: boolean;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  return (
    <div className="min-w-0 self-stretch xl:relative">
      <aside
        aria-live="polite"
        aria-atomic="true"
        className="overflow-hidden rounded-3xl border border-white/10 bg-[#071827] text-white shadow-[0_22px_55px_rgba(0,0,0,.22)] xl:sticky xl:top-24 xl:max-h-[calc(100dvh-7rem)] xl:overflow-y-auto xl:overscroll-contain"
      >
        <header className="border-b border-white/10 px-6 py-5 sm:px-7 sm:py-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#d0af69]">
            Trainology
          </p>
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="mt-3 text-2xl font-semibold tracking-[-0.04em] outline-none sm:text-3xl"
          >
            Makro Profilin
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">Başlangıç planın</p>
        </header>

        {result ? (
          <MacroResult
            result={result}
            calories={calories}
            selectedGoal={selectedGoal}
            selectedActivity={selectedActivity}
          />
        ) : hasErrors ? (
          <InvalidProfileState />
        ) : (
          <EmptyProfileState />
        )}
      </aside>
    </div>
  );
}

function MacroResult({
  result,
  calories,
  selectedGoal,
  selectedActivity,
}: {
  result: MacroDistribution;
  calories: number;
  selectedGoal: string;
  selectedActivity: string;
}) {
  const proteinShare = (result.protein * 4 * 100) / calories;
  const fatShare = result.fatPercentage;
  const carbohydrateShare = 100 - proteinShare - fatShare;
  const proteinStop = proteinShare * 3.6;
  const carbohydrateStop = (proteinShare + carbohydrateShare) * 3.6;
  const formattedCalories = calories.toLocaleString("tr-TR", {
    maximumFractionDigits: 1,
  });
  const chartLabel = `Günlük ${formattedCalories} kilokalori hedefi: ${result.protein} gram protein, yüzde ${result.proteinPercentage}; ${result.carbohydrates} gram karbonhidrat, yüzde ${result.carbohydratePercentage}; ${result.fat} gram yağ, yüzde ${result.fatPercentage}.`;

  return (
    <div className="min-w-0 p-6 sm:p-7">
      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(10rem,.82fr)] lg:items-center">
        <div
          role="img"
          aria-label={chartLabel}
          className="mx-auto flex min-w-0 justify-center"
        >
          <div
            aria-hidden="true"
            className="relative flex aspect-square w-full max-w-60 shrink-0 items-center justify-center rounded-full"
            style={{
              background: `conic-gradient(#d0af69 0deg ${proteinStop}deg, #69c8cf ${proteinStop}deg ${carbohydrateStop}deg, #91a5b5 ${carbohydrateStop}deg 360deg)`,
            }}
          >
            <div className="absolute inset-3 rounded-full bg-[#071827]" />
            <div className="relative z-10 w-full px-6 text-center">
              <p className="whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Günlük hedef
              </p>
              <p className="mt-2 whitespace-nowrap text-[clamp(2rem,7vw,2.5rem)] font-semibold tracking-[-0.045em] text-white">
                {formattedCalories}
              </p>
              <p className="mt-1 whitespace-nowrap text-xs font-semibold text-[#ead5a8]">
                kcal / gün
              </p>
            </div>
          </div>
        </div>

        <dl className="min-w-0 space-y-3">
          <MacroLegendRow
            label="Protein"
            grams={result.protein}
            percentage={result.proteinPercentage}
            color="#d0af69"
          />
          <MacroLegendRow
            label="Karbonhidrat"
            grams={result.carbohydrates}
            percentage={result.carbohydratePercentage}
            color="#69c8cf"
          />
          <MacroLegendRow
            label="Yağ"
            grams={result.fat}
            percentage={result.fatPercentage}
            color="#91a5b5"
          />
        </dl>
      </div>

      <div className="mt-8 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
        <ProfileDetail label="Hedef" value={selectedGoal} />
        <ProfileDetail label="Aktivite" value={selectedActivity} />
      </div>

      <div className="mt-6 rounded-2xl border border-[#d0af69]/20 bg-[#d0af69]/[.07] p-5">
        <p className="text-sm leading-7 text-[#f0dfba]">
          Bu dağılım bir başlangıç planıdır. Hedef, antrenman hacmi, tercihler ve
          bireysel ihtiyaçlara göre değişebilir.
        </p>
        <p className="mt-3 text-xs leading-6 text-slate-400">
          Protein: {result.proteinPerKg.toFixed(1)} g/kg/gün · Protein ve karbonhidrat
          için 4 kcal/g, yağ için 9 kcal/g kullanılır.
        </p>
      </div>
    </div>
  );
}

function MacroLegendRow({
  label,
  grams,
  percentage,
  color,
}: {
  label: string;
  grams: number;
  percentage: number;
  color: string;
}) {
  return (
    <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-white/10 py-3 last:border-b-0">
      <span
        aria-hidden="true"
        className="size-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      <div className="min-w-0">
        <dt className="truncate text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
          {label}
        </dt>
        <dd className="mt-1 text-lg font-semibold text-white">{grams} g</dd>
      </div>
      <span className="text-xs font-bold text-slate-200">
        %{percentage}
      </span>
    </div>
  );
}

function ProfileDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 border-t border-white/10 pt-3 first:border-t-0 first:pt-0 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0 sm:first:border-l-0 sm:first:pl-0">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 break-words text-sm font-semibold text-[#ead5a8]">{value}</p>
    </div>
  );
}

function EmptyProfileState() {
  return (
    <div className="p-6 sm:p-7">
      <div className="mx-auto flex aspect-square w-full max-w-48 items-center justify-center rounded-full border-[14px] border-white/[.07]">
        <div className="max-w-32 text-center">
          <Target aria-hidden="true" className="mx-auto size-6 text-[#d0af69]" />
          <p className="mt-3 text-sm font-semibold leading-5 text-slate-300">
            Planını oluştur
          </p>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-sm text-center text-sm leading-7 text-slate-400">
        Bilgilerini tamamlayıp planı oluşturduğunda günlük makro dağılımın burada
        görünecek.
      </p>
      <div className="mt-7 grid grid-cols-3 gap-3 border-t border-white/10 pt-5" aria-hidden="true">
        {[
          ["Protein", "#d0af69"],
          ["Karbonhidrat", "#69c8cf"],
          ["Yağ", "#91a5b5"],
        ].map(([label, color]) => (
          <div key={label} className="min-w-0 text-center">
            <span className="mx-auto block size-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="mt-2 block truncate text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function InvalidProfileState() {
  return (
    <div className="p-6 sm:p-8">
      <div className="rounded-2xl border border-[#d0af69]/25 bg-[#d0af69]/[.07] p-6">
        <AlertCircle aria-hidden="true" className="size-7 text-[#d0af69]" />
        <h3 className="mt-5 text-xl font-semibold text-white">
          Plan henüz oluşturulamadı.
        </h3>
        <p className="mt-3 text-sm leading-7 text-slate-400">
          Formdaki işaretli alanları kontrol et. Sayısal makro planı yalnız geçerli
          bilgilerle gösterilir.
        </p>
      </div>
    </div>
  );
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-6">
      <h3 className="mb-4 text-sm font-semibold text-slate-200">{title}</h3>
      {children}
    </section>
  );
}

function NumberField({
  id,
  name,
  label,
  unit,
  value,
  min,
  max,
  step,
  inputMode = "decimal",
  placeholder,
  helper,
  error,
  onChange,
}: {
  id: string;
  name: string;
  label: string;
  unit: string;
  value: string;
  min: number;
  max: number;
  step: number;
  inputMode?: "decimal" | "numeric";
  placeholder: string;
  helper: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;

  return (
    <label htmlFor={id} className="block text-sm font-semibold text-slate-200">
      <span>{label}</span>
      <div className="relative mt-2">
        <input
          id={id}
          name={name}
          type="number"
          inputMode={inputMode}
          min={min}
          max={max}
          step={step}
          required
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={`${helperId}${error ? ` ${errorId}` : ""}`}
          className="min-h-13 w-full rounded-xl border border-white/10 bg-[#071523] px-4 pr-16 font-normal text-white outline-none transition placeholder:text-slate-400 hover:border-white/20 focus:border-[#d0af69] focus:ring-2 focus:ring-[#d0af69]/20"
        />
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
          {unit}
        </span>
      </div>
      <span id={helperId} className="mt-2 block text-xs font-normal leading-5 text-slate-400">
        {helper}
      </span>
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </label>
  );
}

function SelectField({
  id,
  name,
  label,
  value,
  options,
  helper,
  error,
  onChange,
}: {
  id: string;
  name: string;
  label: string;
  value: string;
  options: readonly { label: string; value: string }[];
  helper: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;

  return (
    <label htmlFor={id} className="block text-sm font-semibold text-slate-200">
      {label}
      <select
        id={id}
        name={name}
        value={value}
        required
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={`${helperId}${error ? ` ${errorId}` : ""}`}
        className="mt-2 min-h-13 w-full rounded-xl border border-white/10 bg-[#071523] px-4 font-normal text-white outline-none transition hover:border-white/20 focus:border-[#d0af69] focus:ring-2 focus:ring-[#d0af69]/20"
      >
        <option value="">Seçiniz</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span id={helperId} className="mt-2 block text-xs font-normal leading-5 text-slate-400">
        {helper}
      </span>
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </label>
  );
}

function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <span
      id={id}
      role="alert"
      className="mt-2 block text-xs font-semibold leading-5 text-[#f0aaa4]"
    >
      {children}
    </span>
  );
}
