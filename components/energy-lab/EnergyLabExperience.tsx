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
  calculateBmi,
  calculateTargetScenario,
  evaluateEnergyLab,
  getFatLossPolicy,
  roundToNearest50,
  type ActivityProfile,
  type BiologicalSex,
  type DeficitRate,
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
  performancePriority: boolean;
  generalScope: GeneralScopeSelection | "";
};

const initialForm: FormState = {
  age: "",
  sex: "",
  heightCm: "",
  weightKg: "",
  activityProfiles: [],
  performancePriority: false,
  generalScope: "",
};

const activityOptions: readonly {
  value: ActivityProfile;
  title: string;
  description: string;
}[] = [
  {
    value: "inactive",
    title: "Hareketsiz (Inactive)",
    description: "Masa başı çalışma, düşük günlük hareket ve sınırlı fiziksel aktivite.",
  },
  {
    value: "lowActive",
    title: "Düşük Aktif (Low Active)",
    description: "Oturma ağırlıklı yaşamın yanında düzenli yürüyüş veya egzersiz.",
  },
  {
    value: "active",
    title: "Aktif (Active)",
    description: "Gün içinde sık hareket, aktif iş veya yüksek toplam fiziksel aktivite.",
  },
  {
    value: "veryActive",
    title: "Çok Aktif (Very Active)",
    description: "Yoğun fiziksel iş ve/veya çok yüksek günlük aktivite.",
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
    title: "Kas Kazan",
    description: "Kas kazanımını desteklemek istiyorum.",
  },
] as const;

const lossRateLabels: Record<DeficitRate, string> = {
  0.1: "Kontrollü başlangıç",
  0.15: "Dengeli başlangıç",
  0.2: "Daha yüksek açık",
};

const wizardLabels = ["Temel Bilgiler", "Günlük Hareket", "Hedef"] as const;

export default function EnergyLabExperience() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [step, setStep] = useState<WizardStep>(1);
  const [goal, setGoal] = useState<EnergyGoal | "">("");
  const [lossRate, setLossRate] = useState<DeficitRate>(0.1);
  const [gainMode, setGainMode] = useState<GainMode>("maintenance");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [evaluation, setEvaluation] = useState<EnergyLabEvaluation | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  function resetWizard() {
    setForm(initialForm);
    setStep(1);
    setGoal("");
    setLossRate(0.1);
    setGainMode("maintenance");
    setErrors({});
    setEvaluation(null);
    window.requestAnimationFrame(() => {
      document.querySelector<HTMLElement>("#energy-lab-form")?.focus();
    });
  }

  useEffect(() => {
    function resetRestoredPage(event: PageTransitionEvent) {
      if (!event.persisted) return;
      setForm(initialForm);
      setStep(1);
      setGoal("");
      setLossRate(0.1);
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

    if (
      goal === "lose" &&
      (key === "performancePriority" || key === "heightCm" || key === "weightKg")
    ) {
      const policy = getPreviewLossPolicy(nextForm);
      if (policy.defaultRate) setLossRate(policy.defaultRate);
    }
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

    if (nextGoal === "lose") {
      const policy = getPreviewLossPolicy(form);
      if (policy.defaultRate) setLossRate(policy.defaultRate);
    }
  }

  function goForward() {
    const nextErrors = step === 1 ? validateBasics(form) : validateActivity(form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      focusFirstError(nextErrors);
      return;
    }

    setErrors({});
    setStep((current) => (current === 1 ? 2 : 3));
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
      performancePriority: form.performancePriority,
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
    setEvaluation(nextEvaluation);
    window.requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
      resultRef.current?.focus({ preventScroll: true });
    });
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
      className="bg-[#f4f1e9] px-5 py-8 text-[#102536] sm:px-6 sm:py-10 lg:min-h-[calc(100svh-14.25rem)] lg:py-3 [@media(min-width:1024px)_and_(max-height:850px)]:py-2"
    >
      <div className="mx-auto max-w-5xl">
        {evaluation === null ? (
          <form
            id="energy-lab-form"
            onSubmit={handleSubmit}
            autoComplete="off"
            noValidate
            tabIndex={-1}
            className="min-w-0 rounded-[1.75rem] border border-[#11283a]/10 bg-[#fbfaf6] p-5 shadow-[0_24px_70px_rgba(17,40,58,.08)] sm:p-7 lg:px-7 lg:py-5 [@media(min-width:1024px)_and_(max-height:850px)]:px-6 [@media(min-width:1024px)_and_(max-height:850px)]:py-3.5"
          >
            <WizardProgress step={step} />

            <div className="pt-7 sm:pt-8 lg:pt-4 [@media(min-width:1024px)_and_(max-height:850px)]:pt-2.5">
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
                  lossRate={lossRate}
                  gainMode={gainMode}
                  errors={errors}
                  lossPolicy={getPreviewLossPolicy(form)}
                  onGoalChange={handleGoalChange}
                  onLossRateChange={setLossRate}
                  onGainModeChange={setGainMode}
                  onFormChange={updateForm}
                />
              )}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#11283a]/10 pt-5 sm:flex-row sm:items-center sm:justify-between lg:mt-4 lg:pt-4 [@media(min-width:1024px)_and_(max-height:850px)]:mt-2.5 [@media(min-width:1024px)_and_(max-height:850px)]:pt-2.5">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    setErrors({});
                    setStep((current) => (current === 3 ? 2 : 1));
                  }}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#11283a]/15 px-5 text-sm font-bold text-[#102536] transition hover:border-[#9f7b38]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38] [@media(min-width:1024px)_and_(max-height:850px)]:min-h-11"
                >
                  <ArrowLeft aria-hidden="true" className="size-4" />
                  Geri
                </button>
              ) : (
                <span />
              )}

              <button
                type="submit"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#102536] bg-[#102536] px-6 text-sm font-bold text-white transition hover:bg-[#173247] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38] [@media(min-width:1024px)_and_(max-height:850px)]:min-h-11"
              >
                {step === 3 ? "Hedefimi Hesapla" : "Devam Et"}
                <ArrowRight aria-hidden="true" className="size-4" />
              </button>
            </div>
          </form>
        ) : (
          <div ref={resultRef} tabIndex={-1} className="outline-none">
            {evaluation.status === "ready" ? (
              <ReadyResults
                evaluation={evaluation}
                age={Number(form.age)}
                goal={goal as EnergyGoal}
                lossRate={lossRate}
                gainMode={gainMode}
                performancePriority={form.performancePriority}
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
    <ol aria-label="Hesaplama adımları" className="grid grid-cols-3 gap-2">
      {wizardLabels.map((label, index) => {
        const itemStep = (index + 1) as WizardStep;
        const active = step === itemStep;
        const complete = step > itemStep;
        return (
          <li
            key={label}
            aria-current={active ? "step" : undefined}
            className={`border-t-2 pt-3 text-center text-[11px] font-bold sm:text-sm lg:pt-1.5 [@media(min-width:1024px)_and_(max-height:850px)]:pt-1 ${
              active || complete
                ? "border-[#9f7b38] text-[#8c6a2d]"
                : "border-[#11283a]/12 text-[#7b8790]"
            }`}
          >
            <span className="hidden sm:inline">{index + 1} — </span>
            {label}
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
        description="Bakım enerjisi tahmini için gerekli dört bilgiyi gir."
      />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:mt-4 lg:gap-3">
        <NumberField
          id="age"
          label="Yaş"
          value={form.age}
          min={13}
          max={120}
          step={1}
          inputMode="numeric"
          placeholder="Örn. 30"
          helper="Yetişkin Energy Lab motoru 19 yaş ve üzeri için çalışır."
          error={errors.age}
          onChange={(value) => onChange("age", value)}
        />
        <fieldset>
          <legend className="text-sm font-bold text-[#102536]">Biyolojik cinsiyet</legend>
          <p id="sex-helper" className="mt-1 text-xs leading-5 text-[#6b7883] lg:mt-0.5 lg:leading-4">
            NASEM ve Mifflin denklemlerindeki katsayı seçimi için gereklidir.
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
                    ? "border-[#9f7b38] bg-[#efe5d0]"
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
      <fieldset className="mt-7 [@media(min-width:1024px)_and_(max-height:850px)]:mt-2.5">
        <legend className="sr-only">Günlük hareket profilini seç</legend>
        <p id="activity-help" className="text-sm leading-6 text-[#5c6c78]">
          En yakın profili seç. İki profil arasında kalıyorsan yalnız komşu profili de
          seçebilirsin; adım veya antrenman süresinden otomatik sınıflandırma yapılmaz.
        </p>
        <div
          className="mt-5 grid gap-3 sm:grid-cols-2 [@media(min-width:1024px)_and_(max-height:850px)]:mt-2 [@media(min-width:1024px)_and_(max-height:850px)]:grid-cols-4 [@media(min-width:1024px)_and_(max-height:850px)]:gap-2"
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
                className={`flex min-h-28 w-full items-start gap-4 rounded-2xl border p-5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38] [@media(min-width:1024px)_and_(max-height:850px)]:min-h-24 [@media(min-width:1024px)_and_(max-height:850px)]:gap-2.5 [@media(min-width:1024px)_and_(max-height:850px)]:p-3 ${
                  selected
                    ? "border-[#9f7b38] bg-[#efe5d0] shadow-[inset_3px_0_0_#9f7b38]"
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
                  <span className="mt-1 block text-sm leading-6 text-[#62717d] [@media(min-width:1024px)_and_(max-height:850px)]:leading-5">
                    {option.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        {error && <FieldError id="activity-error">{error}</FieldError>}
      </fieldset>
      {profiles.length === 2 && (
        <p className="mt-4 rounded-xl border border-[#9f7b38]/20 bg-[#efe5d0]/60 p-4 text-sm leading-6 text-[#5f4a22] [@media(min-width:1024px)_and_(max-height:850px)]:mt-2 [@media(min-width:1024px)_and_(max-height:850px)]:p-2.5 [@media(min-width:1024px)_and_(max-height:850px)]:leading-5">
          Bu bir istatistiksel güven aralığı değildir; iki olası aktivite senaryosudur.
        </p>
      )}
    </section>
  );
}

function GoalStep({
  form,
  goal,
  lossRate,
  gainMode,
  errors,
  lossPolicy,
  onGoalChange,
  onLossRateChange,
  onGainModeChange,
  onFormChange,
}: {
  form: FormState;
  goal: EnergyGoal | "";
  lossRate: DeficitRate;
  gainMode: GainMode;
  errors: Record<string, string>;
  lossPolicy: ReturnType<typeof getFatLossPolicy>;
  onGoalChange: (goal: EnergyGoal) => void;
  onLossRateChange: (rate: DeficitRate) => void;
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
        <div className="mt-6 grid gap-3 md:grid-cols-3 [@media(min-width:1024px)_and_(max-height:850px)]:mt-2.5 [@media(min-width:1024px)_and_(max-height:850px)]:gap-2">
        {goalOptions.map((option) => {
          const selected = goal === option.value;
          return (
            <button
              key={option.value}
              type="button"
              data-field="goal"
              aria-pressed={selected}
              onClick={() => onGoalChange(option.value)}
              className={`min-h-28 rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38] [@media(min-width:1024px)_and_(max-height:850px)]:min-h-20 [@media(min-width:1024px)_and_(max-height:850px)]:p-3 ${
                selected
                  ? "border-[#9f7b38] bg-[#efe5d0] shadow-[inset_0_3px_0_#9f7b38]"
                  : "border-[#11283a]/12 bg-white hover:border-[#9f7b38]/50"
              }`}
            >
              <span className="flex items-center justify-between gap-3 font-bold text-[#102536]">
                {option.title}
                {selected && <Check aria-hidden="true" className="size-4 text-[#8c6a2d]" />}
              </span>
              <span className="mt-2 block text-sm leading-6 text-[#62717d] [@media(min-width:1024px)_and_(max-height:850px)]:mt-1 [@media(min-width:1024px)_and_(max-height:850px)]:leading-5">
                {option.description}
              </span>
            </button>
          );
        })}
      </div>
      {errors.goal && <FieldError id="goal-error">{errors.goal}</FieldError>}
      </fieldset>

      {goal === "lose" && (
        <div className="mt-6 [@media(min-width:1024px)_and_(max-height:850px)]:mt-2.5">
          <p className="text-sm font-bold text-[#102536]">Başlangıç yaklaşımı</p>
          <div className="mt-3 grid gap-3 md:grid-cols-3 [@media(min-width:1024px)_and_(max-height:850px)]:mt-1.5 [@media(min-width:1024px)_and_(max-height:850px)]:gap-2">
            {lossPolicy.options.map((option) => (
              <button
                key={option.rate}
                type="button"
                disabled={!option.enabled}
                aria-pressed={lossRate === option.rate}
                onClick={() => onLossRateChange(option.rate)}
                className={`rounded-xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38] disabled:cursor-not-allowed disabled:opacity-55 [@media(min-width:1024px)_and_(max-height:850px)]:p-2.5 ${
                  lossRate === option.rate && option.enabled
                    ? "border-[#9f7b38] bg-[#efe5d0]"
                    : "border-[#11283a]/12 bg-white hover:border-[#9f7b38]/50"
                }`}
              >
                <span className="flex items-center justify-between gap-2 font-bold text-[#102536]">
                  {lossRateLabels[option.rate]}
                  {lossRate === option.rate && option.enabled && (
                    <Check aria-hidden="true" className="size-4 text-[#8c6a2d]" />
                  )}
                </span>
                <span className="mt-1 block text-xs leading-5 text-[#657581]">
                  {option.enabled ? option.label : option.reason}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {goal === "gain" && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 [@media(min-width:1024px)_and_(max-height:850px)]:mt-2.5 [@media(min-width:1024px)_and_(max-height:850px)]:gap-2">
          {([
            ["maintenance", "Bakım çevresinde başla"],
            ["smallSurplus", "Küçük enerji fazlasıyla başla"],
          ] as const).map(([mode, label]) => (
            <button
              key={mode}
              type="button"
              aria-pressed={gainMode === mode}
              onClick={() => onGainModeChange(mode)}
              className={`rounded-xl border p-4 text-left font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38] [@media(min-width:1024px)_and_(max-height:850px)]:min-h-11 [@media(min-width:1024px)_and_(max-height:850px)]:p-2.5 ${
                gainMode === mode
                  ? "border-[#9f7b38] bg-[#efe5d0]"
                  : "border-[#11283a]/12 bg-white hover:border-[#9f7b38]/50"
              }`}
            >
              <span className="flex items-center justify-between gap-3">
                {label}
                {gainMode === mode && (
                  <Check aria-hidden="true" className="size-4 text-[#8c6a2d]" />
                )}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 space-y-3 border-t border-[#11283a]/10 pt-5 [@media(min-width:1024px)_and_(max-height:850px)]:mt-2.5 [@media(min-width:1024px)_and_(max-height:850px)]:grid [@media(min-width:1024px)_and_(max-height:850px)]:grid-cols-[0.75fr_1.25fr] [@media(min-width:1024px)_and_(max-height:850px)]:gap-3 [@media(min-width:1024px)_and_(max-height:850px)]:space-y-0 [@media(min-width:1024px)_and_(max-height:850px)]:pt-2.5">
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#11283a]/12 bg-white p-4 focus-within:ring-2 focus-within:ring-[#9f7b38] [@media(min-width:1024px)_and_(max-height:850px)]:p-3">
          <input
            type="checkbox"
            checked={form.performancePriority}
            onChange={(event) => onFormChange("performancePriority", event.target.checked)}
            className="mt-1 size-4 accent-[#9f7b38]"
          />
          <span>
            <span className="block text-sm font-bold">Performans önceliğim var</span>
            <span className="mt-1 block text-xs leading-5 text-[#657581]">
              Bu seçim yalnız yağ kaybı yaklaşımının uygunluk kurallarını etkiler.
            </span>
          </span>
        </label>

        <fieldset aria-describedby={errors.generalScope ? "generalScope-error" : undefined}>
          <legend className="text-sm font-bold">Bu hesaplama senin için uygun mu?</legend>
          <p className="mt-1 text-xs leading-5 text-[#657581] [@media(min-width:1024px)_and_(max-height:850px)]:leading-4">
            Hamilelik veya emzirme, yeme bozukluğu ya da Sporda Göreceli Enerji
            Eksikliği (RED-S) riski, yarışma hazırlığı ve enerji ihtiyacını etkileyen
            sağlık durumu veya ilaç kullanımı genel kapsamın dışında olabilir. Yanıtın
            kaydedilmez veya sunucuya gönderilmez.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 [@media(min-width:1024px)_and_(max-height:850px)]:mt-1.5 [@media(min-width:1024px)_and_(max-height:850px)]:gap-2">
            {([
              ["standardAdult", "Standart yetişkin kapsamıyla devam etmek istiyorum"],
              ["mayBeOutsideScope", "Bu araç benim durumuma uygun olmayabilir"],
            ] as const).map(([value, label]) => (
              <label
                key={value}
                className={`flex min-h-14 cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm font-semibold focus-within:ring-2 focus-within:ring-[#9f7b38] [@media(min-width:1024px)_and_(max-height:850px)]:min-h-11 [@media(min-width:1024px)_and_(max-height:850px)]:gap-2 [@media(min-width:1024px)_and_(max-height:850px)]:p-2 ${
                  form.generalScope === value
                    ? "border-[#9f7b38] bg-[#efe5d0]"
                    : "border-[#11283a]/12 bg-white"
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
    <section className="rounded-[1.75rem] border border-[#9f7b38]/30 bg-[#fbfaf6] p-6 shadow-[0_24px_70px_rgba(17,40,58,.08)] sm:p-9">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-[#efe5d0] text-[#8c6a2d]">
        <ShieldCheck aria-hidden="true" className="size-5" />
      </div>
      <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#8c6a2d]">
        Sayısal hedef gösterilmiyor
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em]">
        Bu bilgiler genel Energy Lab kapsamının dışında.
      </h2>
      <div className="mt-6 space-y-3">
        {evaluation.scope.reasons.map((reason) => (
          <div key={reason.code} className="rounded-xl border border-[#11283a]/10 bg-white p-4">
            <p className="font-bold">{reason.title}</p>
            <p className="mt-1 text-sm leading-6 text-[#5c6c78]">{reason.message}</p>
          </div>
        ))}
      </div>
      <ResetButton onClick={onReset} />
    </section>
  );
}

function ReadyResults({
  evaluation,
  age,
  goal,
  lossRate,
  gainMode,
  performancePriority,
  onReset,
}: {
  evaluation: ReadyEnergyEvaluation;
  age: number;
  goal: EnergyGoal;
  lossRate: DeficitRate;
  gainMode: GainMode;
  performancePriority: boolean;
  onReset: () => void;
}) {
  const selection: GoalSelection =
    goal === "maintain"
      ? { goal: "maintain" }
      : goal === "lose"
        ? { goal: "lose", rate: lossRate }
        : { goal: "gain", mode: gainMode };
  const lossPolicy = getFatLossPolicy(
    evaluation.bmi,
    performancePriority,
    evaluation.scope.fatLossAllowed,
  );
  const targetScenario = calculateTargetScenario({
    evaluation,
    selection,
    performancePriority,
  });

  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-[#11283a]/10 bg-[#fbfaf6] shadow-[0_24px_70px_rgba(17,40,58,.08)]">
      <div className="bg-[#071523] p-6 text-white sm:p-9 lg:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d0af69]">
          Günlük başlangıç hedefin
        </p>
        {targetScenario.status === "available" ? (
          <>
            <p className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              {formatKcalScenario(targetScenario.displayMin, targetScenario.displayMax)}
            </p>
            <p className="mt-3 text-sm font-semibold text-[#ead5a8] sm:text-base">
              {goalResultLabel(selection)}
            </p>
          </>
        ) : (
          <div className="mt-5 rounded-xl border border-[#d0af69]/25 bg-white/[.05] p-5">
            <p className="flex items-start gap-3 text-sm leading-7 text-slate-200">
              <AlertTriangle aria-hidden="true" className="mt-1 size-4 shrink-0 text-[#d0af69]" />
              {targetScenario.message}
            </p>
          </div>
        )}

        <div className="mt-7 border-t border-white/10 pt-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            Tahmini bakım enerjin
          </p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {formatKcalScenario(
              evaluation.maintenance.displayMin,
              evaluation.maintenance.displayMax,
            )}
          </p>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <ResultMini
            label="Aktivite Profili"
            value={evaluation.maintenance.points
              .map((point) => activityLabel(point.profile))
              .join(" + ")}
          />
          <ResultMini
            label="Vücut Kitle İndeksi (BMI)"
            value={evaluation.bmi.toLocaleString("tr-TR", { maximumFractionDigits: 2 })}
          />
          {age <= 78 && (
            <ResultMini
              label="Dinlenme Metabolizma Hızı (RMR)"
              value={`${Math.round(evaluation.mifflinRmr).toLocaleString("tr-TR")} kcal/gün`}
            />
          )}
        </div>
      </div>

      <div className="space-y-6 p-6 sm:p-9 lg:p-10">
        <div>
          <h2 className="text-xl font-semibold">Bu sayı ne anlama geliyor?</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#596a77]">
            Bu değer ölçülmüş kesin enerji ihtiyacın değil, verdiğin bilgilere göre
            hesaplanan tahmini bir başlangıç noktasıdır. Gerçek enerji ihtiyacın kişiden
            kişiye ve zaman içinde değişebilir.
          </p>
        </div>

        <MethodDetails
          evaluation={evaluation}
          selection={selection}
          scenario={targetScenario}
          deficitCapKcal={lossPolicy.deficitCapKcal}
        />

        {targetScenario.status === "available" && (
          <MacroPlannerLink scenario={targetScenario} />
        )}

        <ResetButton onClick={onReset} />
      </div>
    </section>
  );
}

function MethodDetails({
  evaluation,
  selection,
  scenario,
  deficitCapKcal,
}: {
  evaluation: ReadyEnergyEvaluation;
  selection: GoalSelection;
  scenario: TargetScenario;
  deficitCapKcal: number | null;
}) {
  const deficitValues =
    scenario.status === "available"
      ? scenario.points
          .map((point) => point.actualDeficitKcal)
          .filter((value): value is number => value !== undefined)
      : [];

  return (
    <details className="group rounded-2xl border border-[#11283a]/10 bg-white p-5 open:border-[#9f7b38]/30">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38] [&::-webkit-details-marker]:hidden">
        Nasıl hesaplandı?
        <ChevronDown
          aria-hidden="true"
          className="size-4 text-[#8c6a2d] transition-transform group-open:rotate-180"
        />
      </summary>
      <div className="mt-4 space-y-3 border-t border-[#11283a]/10 pt-4 text-sm leading-7 text-[#596a77]">
        <p>
          Bakım tahmini; yaş, biyolojik cinsiyet, boy, kilo ve seçilen aktivite profilini
          NASEM 2023 yetişkin Tahmini Enerji Gereksinimi (EER) denklemlerinde birlikte
          kullanır. Bakım enerjisi, RMR ile bir aktivite çarpanının çarpılmasıyla
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
            {deficitCapKcal !== null
              ? ` Yağ kaybı politikasındaki ${deficitCapKcal.toLocaleString("tr-TR")} kcal/gün tavanı gerektiğinde uygulanır.`
              : ""}
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
          className="inline-flex font-bold text-[#8c6a2d] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38]"
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
    <div className="rounded-2xl border border-[#9f7b38]/20 bg-[#f3ecdd] p-5 sm:p-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8c6a2d]">
        Sıradaki adım
      </p>
      <p className="mt-2 font-bold text-[#102536]">
        Bu kalori hedefini protein, karbonhidrat ve yağlara dağıt.
      </p>

      {scenario.points.length === 2 && (
        <fieldset className="mt-5">
          <legend className="text-sm font-bold text-[#102536]">
            Makro planında kullanacağın başlangıç senaryosunu seç
          </legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {scenario.points.map((point, index) => (
              <label
                key={point.profile}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border bg-white p-4 focus-within:ring-2 focus-within:ring-[#9f7b38] ${
                  selectedPointIndex === index ? "border-[#9f7b38]" : "border-[#11283a]/12"
                }`}
              >
                <input
                  type="radio"
                  name="macroScenario"
                  checked={selectedPointIndex === index}
                  onChange={() => setSelectedPointIndex(index)}
                  className="mt-1 accent-[#9f7b38]"
                />
                <span>
                  <span className="block text-sm font-bold">{activityLabel(point.profile)}</span>
                  <span className="mt-1 block text-sm text-[#596a77]">
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
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#102536] bg-[#102536] px-6 text-sm font-bold text-white transition hover:bg-[#173247] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38] sm:w-auto"
          >
            Makrolarımı Planla
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className="inline-flex min-h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-[#102536]/20 bg-[#102536]/10 px-6 text-sm font-bold text-[#64727d] sm:w-auto"
          >
            Önce bir senaryo seç
          </span>
        )}
      </div>
    </div>
  );
}

function ResetButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#11283a]/15 px-5 text-sm font-bold text-[#102536] transition hover:border-[#9f7b38]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38]"
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
      <h2 id={id} className="text-2xl font-semibold tracking-[-0.035em] sm:text-3xl lg:text-2xl">
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5c6c78] lg:mt-1 lg:leading-5 [@media(min-width:1024px)_and_(max-height:850px)]:mt-0.5">{description}</p>
    </header>
  );
}

function ResultMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[.04] p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-[#ead5a8]">{value}</p>
    </div>
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

  if (!form.age || !Number.isInteger(age) || age < 13 || age > 120) {
    errors.age = "Yaş 13 ile 120 arasında tam sayı olmalıdır.";
  }
  if (!form.sex) errors.sex = "Hesaplama için biyolojik cinsiyet seçilmelidir.";
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

function getPreviewLossPolicy(form: FormState) {
  const height = Number(form.heightCm);
  const weight = Number(form.weightKg);
  const bmi = calculateBmi(weight, height);
  return getFatLossPolicy(bmi, form.performancePriority, bmi >= 18.5 && bmi < 50);
}

function formatKcalScenario(minimum: number, maximum: number): string {
  if (minimum === maximum) return `${minimum.toLocaleString("tr-TR")} kcal / gün`;
  return `${minimum.toLocaleString("tr-TR")}–${maximum.toLocaleString("tr-TR")} kcal / gün`;
}

function activityLabel(profile: ActivityProfile): string {
  return activityOptions.find((option) => option.value === profile)?.title ?? profile;
}

function goalResultLabel(selection: GoalSelection): string {
  if (selection.goal === "maintain") return "Kilo Koruma";
  if (selection.goal === "lose") return `Yağ Kaybı · ${lossRateLabels[selection.rate]}`;
  return selection.mode === "maintenance"
    ? "Kas Kazanımı · Bakım çevresinde başlangıç"
    : "Kas Kazanımı · Küçük enerji fazlası";
}
