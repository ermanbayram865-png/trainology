"use client";

import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
  ACTIVITY_PROFILE_ORDER,
  calculateTargetScenario,
  evaluateEnergyLab,
  FAT_LOSS_DEFICIT_CAP_KCAL,
  roundToNearest50,
  type ActivityProfile,
  type BiologicalSex,
  type EnergyGoal,
  type EnergyLabEvaluation,
  type GainMode,
  type GeneralScopeSelection,
  type GoalSelection,
  type ReadyEnergyEvaluation,
  type TargetScenario,
} from "@/lib/energy-lab";

type WizardStep = 1 | 2 | 3;

type FormState = {
  age: string;
  sex: BiologicalSex | "";
  heightCm: string;
  weightKg: string;
  activityProfiles: ActivityProfile[];
  generalScope: GeneralScopeSelection | "";
};

const initialForm: FormState = {
  age: "",
  sex: "",
  heightCm: "",
  weightKg: "",
  activityProfiles: [],
  generalScope: "",
};

const activityOptions: readonly {
  value: ActivityProfile;
  title: string;
  description: string;
}[] = [
  {
    value: "inactive",
    title: "Az hareketli",
    description: "Bağımsız günlük yaşamın ötesinde az hareket; çok az ya da hiç fiziksel iş yok.",
  },
  {
    value: "lowActive",
    title: "Biraz hareketli",
    description: "Günlük yaşamın yanında daha fazla yürüme ve bir miktar iş veya serbest zaman aktivitesi.",
  },
  {
    value: "active",
    title: "Hareketli",
    description: "Günlük yaşam boyunca düzenli hareket ile belirgin iş, ulaşım veya egzersiz aktivitesi.",
  },
  {
    value: "veryActive",
    title: "Çok hareketli",
    description: "Günün büyük bölümüne yayılan yoğun fiziksel iş ve/veya yüksek hacimli aktivite.",
  },
] as const;

const goalOptions: readonly {
  value: EnergyGoal;
  title: string;
  description: string;
}[] = [
  {
    value: "maintain",
    title: "Kilomu Koru",
    description: "Mevcut ağırlığımı korumak istiyorum.",
  },
  {
    value: "lose",
    title: "Yağ Kaybet",
    description: "Kontrollü şekilde yağ kaybetmek istiyorum.",
  },
  {
    value: "gain",
    title: "Kilo Artışı İçin Başla",
    description: "Kilomu korumaya yakın veya günlük ihtiyacımın biraz üzerinde başlamak istiyorum.",
  },
] as const;

const wizardLabels = ["Temel Bilgiler", "Günlük Hareket", "Hedef"] as const;

export default function EnergyLabExperience() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [step, setStep] = useState<WizardStep>(1);
  const [goal, setGoal] = useState<EnergyGoal | "">("");
  const [gainMode, setGainMode] = useState<GainMode>("maintenance");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [evaluation, setEvaluation] = useState<EnergyLabEvaluation | null>(null);
  const activeStepRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const shouldMoveToStepRef = useRef(false);
  const shouldMoveToResultRef = useRef(false);

  function moveTo(target: HTMLElement | null) {
    if (!target) return;
    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
    target.focus({ preventScroll: true });
  }

  function changeStep(nextStep: WizardStep) {
    shouldMoveToStepRef.current = true;
    setStep(nextStep);
  }

  function resetWizard() {
    shouldMoveToStepRef.current = true;
    setForm(initialForm);
    setStep(1);
    setGoal("");
    setGainMode("maintenance");
    setErrors({});
    setEvaluation(null);
  }

  useEffect(() => {
    if (!shouldMoveToStepRef.current || evaluation !== null) return;
    shouldMoveToStepRef.current = false;
    window.requestAnimationFrame(() => moveTo(activeStepRef.current));
  }, [step, evaluation]);

  useEffect(() => {
    if (!shouldMoveToResultRef.current || evaluation === null) return;
    shouldMoveToResultRef.current = false;
    window.requestAnimationFrame(() => moveTo(resultRef.current));
  }, [evaluation]);

  useEffect(() => {
    function resetRestoredPage(event: PageTransitionEvent) {
      if (!event.persisted) return;
      setForm(initialForm);
      setStep(1);
      setGoal("");
      setGainMode("maintenance");
      setErrors({});
      setEvaluation(null);
    }

    window.addEventListener("pageshow", resetRestoredPage);
    return () => window.removeEventListener("pageshow", resetRestoredPage);
  }, []);

  function updateForm<K extends keyof FormState>(key: K, value: FormState[K]) {
    const nextForm = { ...form, [key]: value };
    setForm(nextForm);
    setErrors((current) => ({ ...current, [key]: "" }));
    setEvaluation(null);

  }

  function toggleActivity(profile: ActivityProfile) {
    const selected = form.activityProfiles.includes(profile);
    let nextProfiles: ActivityProfile[];

    if (selected) {
      nextProfiles = form.activityProfiles.filter((item) => item !== profile);
    } else if (form.activityProfiles.length === 0) {
      nextProfiles = [profile];
    } else if (form.activityProfiles.length === 1) {
      const currentIndex = ACTIVITY_PROFILE_ORDER.indexOf(form.activityProfiles[0]);
      const nextIndex = ACTIVITY_PROFILE_ORDER.indexOf(profile);
      nextProfiles =
        Math.abs(currentIndex - nextIndex) === 1
          ? [...form.activityProfiles, profile].sort(
              (left, right) =>
                ACTIVITY_PROFILE_ORDER.indexOf(left) -
                ACTIVITY_PROFILE_ORDER.indexOf(right),
            )
          : [profile];
    } else {
      nextProfiles = [profile];
    }

    updateForm("activityProfiles", nextProfiles);
  }

  function handleGoalChange(nextGoal: EnergyGoal) {
    setGoal(nextGoal);
    setErrors((current) => ({ ...current, goal: "" }));
    setEvaluation(null);

  }

  function goForward() {
    const nextErrors = step === 1 ? validateBasics(form) : validateActivity(form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      focusFirstError(nextErrors);
      return;
    }

    setErrors({});
    changeStep(step === 1 ? 2 : 3);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (step !== 3) {
      goForward();
      return;
    }

    const nextErrors = validateForm(form, goal);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      focusFirstError(nextErrors);
      return;
    }

    const nextEvaluation = evaluateEnergyLab({
      age: Number(form.age),
      sex: form.sex as BiologicalSex,
      heightCm: Number(form.heightCm),
      weightKg: Number(form.weightKg),
      activityProfiles: form.activityProfiles,
      generalScope: form.generalScope as GeneralScopeSelection,
    });

    if (nextEvaluation.status === "invalid") {
      const engineErrors = Object.fromEntries(
        nextEvaluation.errors.map((error) => [error.field, error.message]),
      );
      setErrors(engineErrors);
      focusFirstError(engineErrors);
      return;
    }

    setErrors({});
    shouldMoveToResultRef.current = true;
    setEvaluation(nextEvaluation);
  }

  function focusFirstError(nextErrors: Record<string, string>) {
    window.requestAnimationFrame(() => {
      const firstField = Object.keys(nextErrors)[0];
      const selectors: Record<string, string> = {
        sex: "[name='sex']",
        activityProfiles: "[data-field='activityProfiles']",
        goal: "[data-field='goal']",
        generalScope: "[name='generalScope']",
      };
      const selector = selectors[firstField] ?? `#${firstField}`;
      document
        .querySelector<HTMLElement>(`#energy-lab-form ${selector}`)
        ?.focus();
    });
  }

  return (
    <section
      id="simulator"
      className="relative isolate px-4 py-8 text-[#102536] sm:px-6 sm:py-12 lg:min-h-[calc(100svh-14.25rem)] lg:py-8"
    >
      <TechnicalGrid className="text-[#d0af69] opacity-[.025]" patternId="energy-form-grid" />
      <div className="calculator-content relative">
        {evaluation === null ? (
          <form
            id="energy-lab-form"
            onSubmit={handleSubmit}
            autoComplete="off"
            noValidate
            tabIndex={-1}
            className="calculator-surface min-w-0 p-5 sm:p-8 lg:p-10"
          >
            <WizardProgress step={step} />

            <div
              ref={activeStepRef}
              tabIndex={-1}
              className="scroll-mt-28 pt-8 outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38] sm:scroll-mt-32 sm:pt-10"
            >
              {step === 1 && (
                <BasicInformationStep form={form} errors={errors} onChange={updateForm} />
              )}
              {step === 2 && (
                <ActivityStep
                  profiles={form.activityProfiles}
                  error={errors.activityProfiles}
                  onToggle={toggleActivity}
                />
              )}
              {step === 3 && (
                <GoalStep
                  form={form}
                  goal={goal}
                  gainMode={gainMode}
                  errors={errors}
                  onGoalChange={handleGoalChange}
                  onGainModeChange={setGainMode}
                  onFormChange={updateForm}
                />
              )}
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#11283a]/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    setErrors({});
                    changeStep(step === 3 ? 2 : 1);
                  }}
                  className="calculator-action calculator-action--secondary inline-flex min-h-12 items-center justify-center gap-2 px-5 text-sm font-bold"
                >
                  <ArrowLeft aria-hidden="true" className="size-4" />
                  Geri
                </button>
              ) : (
                <span />
              )}

              <button
                type="submit"
                className="calculator-action inline-flex min-h-12 items-center justify-center gap-3 px-6 text-sm font-bold"
              >
                {step === 3 ? "Hedefimi Hesapla" : "Devam Et"}
                <ArrowRight aria-hidden="true" className="size-4 text-[#d0af69]" />
              </button>
            </div>
          </form>
        ) : (
          <div
            ref={resultRef}
            tabIndex={-1}
            role="region"
            aria-live="polite"
            aria-label="Energy Lab sonucu"
            className="scroll-mt-28 rounded-[1.5rem] outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38] sm:scroll-mt-32"
          >
            {evaluation.status === "ready" ? (
              <ReadyResults
                evaluation={evaluation}
                age={Number(form.age)}
                goal={goal as EnergyGoal}
                gainMode={gainMode}
                onReset={resetWizard}
              />
            ) : evaluation.status === "blocked" ? (
              <BlockedResult evaluation={evaluation} onReset={resetWizard} />
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}

function WizardProgress({ step }: { step: WizardStep }) {
  return (
    <ol aria-label="Hesaplama adımları" className="grid grid-cols-3 gap-3 sm:gap-5">
      {wizardLabels.map((label, index) => {
        const itemStep = (index + 1) as WizardStep;
        const active = step === itemStep;
        const complete = step > itemStep;
        return (
          <li
            key={label}
            aria-current={active ? "step" : undefined}
            className={`border-t pt-3 text-left text-[10px] font-bold uppercase tracking-[0.08em] sm:text-xs sm:tracking-[0.14em] ${
              active
                ? "border-[#9f7b38] text-[#8c6a2d]"
                : complete
                  ? "border-[#102536] text-[#102536]"
                : "border-[#11283a]/12 text-[#7b8790]"
            }`}
          >
            <span className="mr-1 inline-flex min-w-5 items-center justify-center font-mono">{complete ? <Check aria-hidden="true" className="size-3.5" /> : String(index + 1).padStart(2, "0")}</span>
            <span>{label}</span>
          </li>
        );
      })}
    </ol>
  );
}

function BasicInformationStep({
  form,
  errors,
  onChange,
}: {
  form: FormState;
  errors: Record<string, string>;
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}) {
  return (
    <section aria-labelledby="basic-step-title">
      <StepHeading
        id="basic-step-title"
        title="Temel bilgilerin"
        description="Günlük enerji ihtiyacını tahmin etmek için gerekli dört bilgiyi gir."
      />
      <div className="mt-7 grid gap-5 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-5">
        <NumberField
          id="age"
          label="Yaş"
          value={form.age}
          min={19}
          max={120}
          step={1}
          inputMode="numeric"
          placeholder="Örn. 30"
          helper="Bu hesaplama 19 yaş ve üzeri yetişkinler içindir."
          error={errors.age}
          onChange={(value) => onChange("age", value)}
        />
        <fieldset>
          <legend className="text-sm font-bold text-[#102536]">Cinsiyet</legend>
          <p id="sex-helper" className="mt-1 text-xs leading-5 text-[#6b7883] lg:mt-0.5 lg:leading-4">
            Enerji hesaplamasında kullanılan denklemin katsayısı için gereklidir.
          </p>
          <div
            className="mt-3 grid grid-cols-2 gap-3 lg:mt-1.5 lg:gap-2"
            aria-describedby={`sex-helper${errors.sex ? " sex-error" : ""}`}
          >
            {(["female", "male"] as const).map((sex) => (
              <label
                key={sex}
                className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border px-4 text-sm font-semibold transition focus-within:ring-2 focus-within:ring-[#9f7b38] lg:min-h-13 lg:px-3 ${
                  form.sex === sex
                    ? "border-[#9f7b38] bg-[#d0af69]/[.08]"
                    : "border-[#11283a]/15 bg-white hover:border-[#9f7b38]/60"
                }`}
              >
                <input
                  type="radio"
                  name="sex"
                  value={sex}
                  checked={form.sex === sex}
                  onChange={() => onChange("sex", sex)}
                  className="accent-[#9f7b38]"
                />
                {sex === "female" ? "Kadın" : "Erkek"}
              </label>
            ))}
          </div>
          {errors.sex && <FieldError id="sex-error">{errors.sex}</FieldError>}
        </fieldset>
        <NumberField
          id="heightCm"
          label="Boy"
          unit="cm"
          value={form.heightCm}
          min={100}
          max={250}
          step={0.1}
          placeholder="Örn. 175"
          error={errors.heightCm}
          onChange={(value) => onChange("heightCm", value)}
        />
        <NumberField
          id="weightKg"
          label="Kilo"
          unit="kg"
          value={form.weightKg}
          min={25}
          max={400}
          step={0.1}
          placeholder="Örn. 75"
          error={errors.weightKg}
          onChange={(value) => onChange("weightKg", value)}
        />
      </div>
    </section>
  );
}

function ActivityStep({
  profiles,
  error,
  onToggle,
}: {
  profiles: readonly ActivityProfile[];
  error?: string;
  onToggle: (profile: ActivityProfile) => void;
}) {
  return (
    <section aria-labelledby="activity-step-title">
      <StepHeading
        id="activity-step-title"
        title="Günlük hareketini anlayalım"
        description="Günlük yaşamına en yakın hareket profilini belirlemene yardımcı olacağız."
      />
      <fieldset className="mt-7">
        <legend className="sr-only">Günlük hareket profilini seç</legend>
        <p id="activity-help" className="text-sm leading-6 text-[#5c6c78]">
          Sana en yakın hareket düzeyini seç. İki düzey arasında kalıyorsan yan yana olan
          iki seçeneği işaretleyebilirsin. Adım veya antrenman süresinden otomatik
          sınıflandırma yapılmaz.
        </p>
        <div
          className="mt-5 grid gap-3 sm:grid-cols-2"
          aria-describedby={`activity-help${error ? " activity-error" : ""}`}
        >
          {activityOptions.map((option) => {
            const selected = profiles.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                data-field="activityProfiles"
                role="checkbox"
                aria-checked={selected}
                aria-invalid={Boolean(error)}
                onClick={() => onToggle(option.value)}
                className={`flex min-h-28 w-full items-start gap-4 rounded-2xl border p-5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38] ${
                  selected
                    ? "border-[#9f7b38] bg-[#d0af69]/[.07]"
                    : "border-[#11283a]/12 bg-white hover:border-[#9f7b38]/50"
                }`}
              >
                <span
                  className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border ${
                    selected
                      ? "border-[#9f7b38] bg-[#9f7b38] text-white"
                      : "border-[#11283a]/20 text-transparent"
                  }`}
                >
                  <Check aria-hidden="true" className="size-4" />
                </span>
                <span>
                  <span className="block font-bold text-[#102536]">{option.title}</span>
                  <span className="mt-1 block text-sm leading-6 text-[#62717d]">
                    {option.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        {error && <FieldError id="activity-error">{error}</FieldError>}
      </fieldset>
    </section>
  );
}

function GoalStep({
  form,
  goal,
  gainMode,
  errors,
  onGoalChange,
  onGainModeChange,
  onFormChange,
}: {
  form: FormState;
  goal: EnergyGoal | "";
  gainMode: GainMode;
  errors: Record<string, string>;
  onGoalChange: (goal: EnergyGoal) => void;
  onGainModeChange: (mode: GainMode) => void;
  onFormChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}) {
  return (
    <section aria-labelledby="goal-step-title">
      <StepHeading
        id="goal-step-title"
        title="Hedefin nedir?"
        description="Başlangıç kalori hedefinin hangi amaçla oluşturulacağını seç."
      />
      <fieldset aria-describedby={errors.goal ? "goal-error" : undefined}>
        <legend className="sr-only">Hedefini seç</legend>
        <div className="mt-7 grid items-start gap-3 md:grid-cols-3">
          {goalOptions.map((option) => {
            const selected = goal === option.value;
            return (
              <div
                key={option.value}
                data-goal-card={option.value}
                data-selected={selected || undefined}
                className={`overflow-hidden rounded-2xl border bg-white transition ${
                  selected
                    ? "border-[#9f7b38] bg-[#d0af69]/[.06]"
                    : "border-[#11283a]/12 hover:border-[#9f7b38]/50"
                }`}
              >
                <button
                  type="button"
                  data-field="goal"
                  aria-pressed={selected}
                  onClick={() => onGoalChange(option.value)}
                  className="min-h-28 w-full p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#9f7b38]"
                >
                  <span className="flex items-center justify-between gap-3 font-bold text-[#102536]">
                    {option.title}
                    <span
                      className={`flex size-6 shrink-0 items-center justify-center rounded-full border ${
                        selected
                          ? "border-[#9f7b38] bg-[#9f7b38] text-white"
                          : "border-[#11283a]/20 text-transparent"
                      }`}
                    >
                      <Check aria-hidden="true" className="size-3.5" />
                    </span>
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-[#62717d]">
                    {option.description}
                  </span>
                </button>

                {selected && option.value === "lose" && (
                  <div
                    data-goal-nested="lose"
                    className="border-t border-[#9f7b38]/20 px-5 py-4"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8c6a2d]">
                      Yağ kaybı için başlangıç
                    </p>
                    <p className="mt-2 text-xs leading-5 text-[#657581]">
                      Günlük enerji ihtiyacı tahmininden %10, en fazla 500 kcal/gün azaltılır.
                      Bu, kişiselleştirilmiş reçete değildir.
                    </p>
                  </div>
                )}

                {selected && option.value === "gain" && (
                  <fieldset
                    data-goal-nested="gain"
                    className="border-t border-[#9f7b38]/20 px-4 py-4"
                  >
                    <legend className="px-1 text-xs font-bold uppercase tracking-[0.12em] text-[#8c6a2d]">
                      Başlangıç yaklaşımı
                    </legend>
                    <div className="mt-2 space-y-2">
                      {([
                        ["maintenance", "Kilomu korumaya yakın başla"],
                        ["smallSurplus", "Günlük ihtiyacımın biraz üzerinde başla"],
                      ] as const).map(([mode, label]) => (
                        <label
                          key={mode}
                          className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-xs font-bold focus-within:ring-2 focus-within:ring-[#9f7b38] ${
                            gainMode === mode
                              ? "border-[#9f7b38] bg-white"
                              : "border-[#11283a]/12 bg-white/70"
                          }`}
                        >
                          <input
                            type="radio"
                            name="gainMode"
                            value={mode}
                            checked={gainMode === mode}
                            onChange={() => onGainModeChange(mode)}
                            className="accent-[#9f7b38]"
                          />
                          {label}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                )}
              </div>
            );
          })}
        </div>
        {errors.goal && <FieldError id="goal-error">{errors.goal}</FieldError>}
      </fieldset>

      <div className="mt-7 border-t border-[#11283a]/10 pt-6">
        <fieldset aria-describedby={errors.generalScope ? "generalScope-error" : undefined}>
          <legend className="text-sm font-bold">Bu hesaplama senin için uygun mu?</legend>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-[#657581]">
            Hamilelik/emzirme, özel tıbbi durumlar veya yarışma hazırlığı gibi durumlarda
            bu genel hesaplama uygun olmayabilir.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {([
              ["standardAdult", "Genel yetişkin kapsamındayım."],
              ["mayBeOutsideScope", "Bu araç benim durumuma uygun olmayabilir"],
            ] as const).map(([value, label]) => (
              <label
                key={value}
                className={`flex min-h-14 cursor-pointer items-start gap-3 rounded-xl border bg-white p-4 text-sm font-semibold focus-within:ring-2 focus-within:ring-[#9f7b38] ${
                  form.generalScope === value
                    ? "border-[#9f7b38] bg-[#d0af69]/[.07]"
                    : "border-[#11283a]/12"
                }`}
              >
                <input
                  type="radio"
                  name="generalScope"
                  value={value}
                  checked={form.generalScope === value}
                  onChange={() => onFormChange("generalScope", value)}
                  className="mt-0.5 accent-[#9f7b38]"
                />
                {label}
              </label>
            ))}
          </div>
          {errors.generalScope && (
            <FieldError id="generalScope-error">{errors.generalScope}</FieldError>
          )}
        </fieldset>
      </div>
    </section>
  );
}

function BlockedResult({
  evaluation,
  onReset,
}: {
  evaluation: Extract<EnergyLabEvaluation, { status: "blocked" }>;
  onReset: () => void;
}) {
  return (
    <section className="relative isolate overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#071523] p-6 text-white shadow-[0_28px_80px_rgba(7,21,35,.22)] sm:p-9">
      <TechnicalGrid className="text-[#d0af69] opacity-[.045]" patternId="energy-blocked-grid" />
      <div className="relative">
      <div className="flex size-12 items-center justify-center rounded-full border border-[#d0af69]/30 text-[#d0af69]">
        <ShieldCheck aria-hidden="true" className="size-5" />
      </div>
      <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#8c6a2d]">
        Sayısal hedef gösterilmiyor
      </p>
      <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-[-0.035em]">
        Bu bilgiler genel Energy Lab kapsamının dışında.
      </h2>
      <div className="mt-6 space-y-3">
        {evaluation.scope.reasons.map((reason) => (
          <div key={reason.code} className="rounded-xl border border-white/10 bg-white/[.04] p-4">
            <p className="font-bold">{reason.title}</p>
            <p className="mt-1 text-sm leading-6 text-slate-300">{reason.message}</p>
          </div>
        ))}
      </div>
      <ResetButton onClick={onReset} dark />
      </div>
    </section>
  );
}

function ReadyResults({
  evaluation,
  age,
  goal,
  gainMode,
  onReset,
}: {
  evaluation: ReadyEnergyEvaluation;
  age: number;
  goal: EnergyGoal;
  gainMode: GainMode;
  onReset: () => void;
}) {
  const selection: GoalSelection =
    goal === "maintain"
      ? { goal: "maintain" }
      : goal === "lose"
        ? { goal: "lose" }
        : { goal: "gain", mode: gainMode };
  const targetScenario = calculateTargetScenario({
    evaluation,
    selection,
  });
  const differenceValues =
    targetScenario.status === "available"
      ? targetScenario.points.map((point, index) =>
          roundToNearest50(point.rawKcal - evaluation.maintenance.points[index].rawKcal),
        )
      : [];

  return (
    <section className="calculator-result relative isolate overflow-hidden">
      <TechnicalGrid className="text-[#d0af69] opacity-[.045]" patternId="energy-result-grid" />
      <div className="relative p-6 sm:p-9 lg:p-11">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d0af69]">
          Tahmini günlük enerji ihtiyacın
        </p>
        <p className="mt-5 flex flex-wrap items-end gap-x-3 gap-y-1">
          <span className="text-[clamp(3rem,9vw,5.75rem)] font-semibold leading-[.9] tracking-[-0.055em]">
          {formatKcalNumber(
            evaluation.maintenance.displayMin,
            evaluation.maintenance.displayMax,
          )}
          </span>
          <span className="pb-1 text-sm font-bold uppercase tracking-[0.12em] text-slate-400 sm:pb-2">
            kcal / gün
          </span>
        </p>
        <div aria-hidden="true" className="mt-6 h-px w-16 bg-[#d0af69]" />
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
          Mevcut kilonu korumak için günlük yaklaşık enerji ihtiyacın.
        </p>

        <div className="mt-8 border-y border-white/10 bg-white/[.025] px-5 py-6 sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:gap-8">
          {targetScenario.status === "available" ? (
            <>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                  Günlük kalori hedefin
                </p>
                <p className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                  {formatKcalScenario(targetScenario.displayMin, targetScenario.displayMax)}
                </p>
                <p className="mt-2 text-sm font-semibold text-[#ead5a8]">
                  {goalResultLabel(selection)}
                </p>
              </div>
              <p className="mt-4 border-t border-white/10 pt-4 text-sm text-slate-300 sm:mt-0 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
                Günlük enerji ihtiyacından fark: {formatSignedKcalScenario(differenceValues)}
              </p>
            </>
          ) : (
            <div className="sm:col-span-2">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                Günlük kalori hedefin
              </p>
              <div className="mt-3 rounded-xl border border-[#d0af69]/25 bg-white/[.05] p-5">
                <p className="flex items-start gap-3 text-sm leading-7 text-slate-200">
                  <AlertTriangle aria-hidden="true" className="mt-1 size-4 shrink-0 text-[#d0af69]" />
                  {targetScenario.message}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-7 grid gap-5 border-b border-white/10 pb-8 sm:grid-cols-2 sm:gap-8">
          <ResultMini
            label="Aktivite Profili"
            value={evaluation.maintenance.points
              .map((point) => activityLabel(point.profile))
              .join(" + ")}
          />
          {age <= 78 && (
            <ResultMini
              label="Tahmini dinlenme enerjisi (RMR)"
              value={`${Math.round(evaluation.mifflinRmr).toLocaleString("tr-TR")} kcal/gün`}
              helper="Bu bir günlük kalori hedefi değildir. Vücudunun dinlenirken kullandığı tahmini enerjidir."
            />
          )}
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold tracking-[-0.02em]">Bu sayı ne anlama geliyor?</h2>
          <div className="mt-4 divide-y divide-white/10 border-y border-white/10">
            <ResultInfoRow
              label="Başlangıç tahmini"
              text="Bu değer ölçülmüş kesin enerji ihtiyacın değil; verdiğin bilgilere göre hesaplanan bir başlangıç noktasıdır."
            />
            <ResultInfoRow
              label="Gerçek ihtiyaç değişebilir"
              text="Tahmin denklemi, aktivite seçimi, günlük hareket farkı ve kişisel metabolik değişkenlik sonucu etkileyebilir."
            />
            {selection.goal === "lose" && (
              <ResultInfoRow
                label="Eğilimi izle"
                text="Yağ kaybı hedefi kesin bir kişisel reçete veya haftalık kayıp vaadi değildir. Kilonun birkaç haftalık eğilimi, antrenman performansı ve uygulamadaki uyum daha anlamlıdır."
              />
            )}
          </div>
        </div>

        <MethodDetails
          evaluation={evaluation}
          selection={selection}
          scenario={targetScenario}
        />

        {targetScenario.status === "available" && (
          <MacroPlannerLink scenario={targetScenario} />
        )}

        <ResetButton onClick={onReset} dark />
      </div>
    </section>
  );
}

function MethodDetails({
  evaluation,
  selection,
  scenario,
}: {
  evaluation: ReadyEnergyEvaluation;
  selection: GoalSelection;
  scenario: TargetScenario;
}) {
  const deficitValues =
    scenario.status === "available"
      ? scenario.points
          .map((point) => point.actualDeficitKcal)
          .filter((value): value is number => value !== undefined)
      : [];

  return (
    <details className="group mt-6 rounded-2xl border border-white/10 bg-white/[.035] p-5 open:border-[#d0af69]/35">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38] [&::-webkit-details-marker]:hidden">
        Nasıl hesaplandı?
        <ChevronDown
          aria-hidden="true"
          className="size-4 text-[#8c6a2d] transition-transform group-open:rotate-180"
        />
      </summary>
      <div className="mt-4 space-y-3 border-t border-white/10 pt-4 text-sm leading-7 text-slate-300">
        <p>
          Günlük enerji ihtiyacı tahmini; yaş, biyolojik cinsiyet, boy, kilo ve seçilen aktivite profilini
          NASEM 2023 yetişkin Tahmini Enerji Gereksinimi (EER) denklemlerinde birlikte
          kullanır. Günlük enerji ihtiyacı, RMR ile bir aktivite çarpanının çarpılmasıyla
          hesaplanmaz.
        </p>
        <p>
          Dinlenme Metabolizma Hızı (RMR), Mifflin–St Jeor denklemiyle yalnız ikincil
          referans olarak hesaplanır. İç hesap tam hassasiyetle yapılır; görünür enerji
          sonuçları en yakın 50 kcal’ye yuvarlanır.
        </p>
        <p>Seçilen hedef yaklaşımı: {goalResultLabel(selection)}.</p>
        {deficitValues.length > 0 && (
          <p>
            Uygulanan başlangıç enerji farkı: {formatKcalScenario(
              roundToNearest50(Math.min(...deficitValues)),
              roundToNearest50(Math.max(...deficitValues)),
            )}.
            {` Başlangıç enerji farkı gerektiğinde ${FAT_LOSS_DEFICIT_CAP_KCAL.toLocaleString("tr-TR")} kcal/gün ile sınırlandırılır.`}
          </p>
        )}
        {evaluation.maintenance.kind === "range" && (
          <p>
            Gösterilen aralık istatistiksel güven aralığı değildir; seçtiğin iki olası
            aktivite profilinin ayrı senaryolarıdır.
          </p>
        )}
        <a
          href="#bilimsel-kaynaklar"
          className="inline-flex font-bold text-[#d0af69] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d0af69]"
        >
          Yöntem ve bilimsel kaynakları incele
        </a>
      </div>
    </details>
  );
}

function MacroPlannerLink({
  scenario,
}: {
  scenario: Extract<TargetScenario, { status: "available" }>;
}) {
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(
    scenario.points.length === 1 ? 0 : null,
  );
  const selectedPoint =
    selectedPointIndex === null ? null : scenario.points[selectedPointIndex];

  return (
    <div className="mt-6 rounded-2xl border border-[#d0af69]/25 bg-white/[.04] p-5 sm:p-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d0af69]">
        Sıradaki adım
      </p>
      <p className="mt-2 font-bold text-white">
        Bu kalori hedefini protein, karbonhidrat ve yağlara dağıt.
      </p>

      {scenario.points.length === 2 && (
        <fieldset className="mt-5">
          <legend className="text-sm font-bold text-white">
            Makro planında kullanacağın kalori hedefini seç
          </legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {scenario.points.map((point, index) => (
              <label
                key={point.profile}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border bg-[#0b1e2e] p-4 focus-within:ring-2 focus-within:ring-[#d0af69] ${
                  selectedPointIndex === index ? "border-[#d0af69]" : "border-white/10"
                }`}
              >
                <input
                  type="radio"
                  name="macroScenario"
                  checked={selectedPointIndex === index}
                  onChange={() => setSelectedPointIndex(index)}
                  className="mt-1 accent-[#d0af69]"
                />
                <span>
                  <span className="block text-sm font-bold">{activityLabel(point.profile)}</span>
                  <span className="mt-1 block text-sm text-slate-300">
                    {point.displayKcal.toLocaleString("tr-TR")} kcal/gün
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="mt-5">
        {selectedPoint ? (
          <Link
            href={`/calculators/macro?calories=${selectedPoint.displayKcal}`}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#d0af69]/40 bg-[#102536] px-6 text-sm font-bold text-white transition hover:bg-[#173247] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d0af69] sm:w-auto"
          >
            Makrolarımı Planla
            <ArrowRight aria-hidden="true" className="size-4 text-[#d0af69]" />
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className="inline-flex min-h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-6 text-sm font-bold text-slate-500 sm:w-auto"
          >
            Önce bir kalori hedefi seç
          </span>
        )}
      </div>
    </div>
  );
}

function ResetButton({ onClick, dark = false }: { onClick: () => void; dark?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-5 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38] ${
        dark
          ? "border-white/15 text-slate-200 hover:border-[#d0af69]/60 hover:text-white"
          : "border-[#11283a]/15 text-[#102536] hover:border-[#9f7b38]/60"
      }`}
    >
      <RotateCcw aria-hidden="true" className="size-4" />
      Hesabı Yeniden Yap
    </button>
  );
}

function StepHeading({
  id,
  title,
  description,
}: {
  id: string;
  title: string;
  description: string;
}) {
  return (
    <header>
      <h2 id={id} className="text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5c6c78]">{description}</p>
    </header>
  );
}

function ResultMini({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper?: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-200">{value}</p>
      {helper && <p className="mt-1 text-xs leading-5 text-slate-400">{helper}</p>}
    </div>
  );
}

function ResultInfoRow({ label, text }: { label: string; text: string }) {
  return (
    <div className="grid gap-2 py-4 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#d0af69]">{label}</p>
      <p className="max-w-2xl text-sm leading-6 text-slate-300">{text}</p>
    </div>
  );
}

function TechnicalGrid({
  className,
  patternId,
}: {
  className: string;
  patternId: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 size-full ${className}`}
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id={patternId} width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M48 0H0V48" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

function NumberField({
  id,
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
  label: string;
  unit?: string;
  value: string;
  min: number;
  max: number;
  step: number;
  inputMode?: "decimal" | "numeric";
  placeholder: string;
  helper?: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;
  return (
    <label htmlFor={id} className="block text-sm font-bold text-[#102536]">
      <span className="flex items-center justify-between gap-3">
        {label}
        {unit && <span className="font-normal text-[#7b8790]">{unit}</span>}
      </span>
      <input
        id={id}
        name={id}
        type="number"
        inputMode={inputMode}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={
          [helper ? helperId : "", error ? errorId : ""].filter(Boolean).join(" ") ||
          undefined
        }
        className="mt-2 min-h-14 w-full rounded-xl border border-[#11283a]/15 bg-white px-4 text-base font-normal text-[#102536] outline-none transition placeholder:text-[#9ba3a9] focus:border-[#9f7b38] focus:ring-2 focus:ring-[#9f7b38]/20 lg:mt-1.5 lg:min-h-13 [@media(min-width:1024px)_and_(max-height:850px)]:min-h-11"
      />
      {helper && (
        <span id={helperId} className="mt-2 block text-xs font-normal leading-5 text-[#6b7883] lg:mt-1 lg:leading-4">
          {helper}
        </span>
      )}
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </label>
  );
}

function FieldError({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <span id={id} role="alert" className="mt-2 block text-xs font-semibold leading-5 text-[#9d322f]">
      {children}
    </span>
  );
}

function validateBasics(form: FormState): Record<string, string> {
  const errors: Record<string, string> = {};
  const age = Number(form.age);
  const height = Number(form.heightCm);
  const weight = Number(form.weightKg);

  if (!form.age || !Number.isInteger(age) || age < 19 || age > 120) {
    errors.age = "Yaş 19 ile 120 arasında tam sayı olmalıdır.";
  }
  if (!form.sex) errors.sex = "Hesaplama için cinsiyet seçilmelidir.";
  if (!form.heightCm || !Number.isFinite(height) || height < 100 || height > 250) {
    errors.heightCm = "Boy 100 ile 250 cm arasında olmalıdır.";
  }
  if (!form.weightKg || !Number.isFinite(weight) || weight < 25 || weight > 400) {
    errors.weightKg = "Kilo 25 ile 400 kg arasında olmalıdır.";
  }
  return errors;
}

function validateActivity(form: FormState): Record<string, string> {
  if (form.activityProfiles.length < 1 || form.activityProfiles.length > 2) {
    return { activityProfiles: "En az bir günlük hareket profili seçilmelidir." };
  }
  return {};
}

function validateForm(
  form: FormState,
  goal: EnergyGoal | "",
): Record<string, string> {
  const errors = { ...validateBasics(form), ...validateActivity(form) };
  if (!goal) errors.goal = "Bir hedef seçilmelidir.";
  if (!form.generalScope) {
    errors.generalScope = "Kapsam kontrolü için bir yanıt seçilmelidir.";
  }
  return errors;
}

function formatKcalScenario(minimum: number, maximum: number): string {
  if (minimum === maximum) return `${minimum.toLocaleString("tr-TR")} kcal / gün`;
  return `${minimum.toLocaleString("tr-TR")}–${maximum.toLocaleString("tr-TR")} kcal / gün`;
}

function formatKcalNumber(minimum: number, maximum: number): string {
  if (minimum === maximum) return minimum.toLocaleString("tr-TR");
  return `${minimum.toLocaleString("tr-TR")}–${maximum.toLocaleString("tr-TR")}`;
}

function formatSignedKcalScenario(values: readonly number[]): string {
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const format = (value: number) =>
    `${value > 0 ? "+" : value < 0 ? "−" : "±"}${Math.abs(value).toLocaleString("tr-TR")} kcal / gün`;
  return minimum === maximum ? format(minimum) : `${format(minimum)} – ${format(maximum)}`;
}

function activityLabel(profile: ActivityProfile): string {
  return activityOptions.find((option) => option.value === profile)?.title ?? profile;
}

function goalResultLabel(selection: GoalSelection): string {
  if (selection.goal === "maintain") return "Kilo Koruma";
  if (selection.goal === "lose") return "Yağ Kaybı · Muhafazakâr başlangıç";
  return selection.mode === "maintenance"
    ? "Kilo artışı yaklaşımı · Kilomu korumaya yakın başlangıç"
    : "Kilo artışı yaklaşımı · Günlük ihtiyacımın biraz üzerinde başlangıç";
}
