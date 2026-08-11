"use client";

import {
  AlertTriangle,
  ArrowRight,
  Check,
  PersonStanding,
  ShieldCheck,
  Sparkles,
  Target,
  Watch,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import CalibrationPanel from "@/components/energy-lab/CalibrationPanel";
import {
  ACTIVITY_PROFILE_ORDER,
  calculateTargetScenario,
  evaluateEnergyLab,
  getFatLossPolicy,
  roundToNearest50,
  writeEnergyLabHandoff,
  type ActivityProfile,
  type BiologicalSex,
  type DeficitRate,
  type EnergyGoal,
  type EnergyLabEvaluation,
  type GainMode,
  type GoalSelection,
  type ReadyEnergyEvaluation,
  type SafetyFlag,
  type TargetScenario,
} from "@/lib/energy-lab";

type SafetyStatus = "unanswered" | "none" | "applies";

type FormState = {
  age: string;
  sex: BiologicalSex | "";
  heightCm: string;
  weightKg: string;
  activityProfiles: ActivityProfile[];
  workStyle: "" | "desk" | "mixed" | "active" | "physical";
  trainingDays: string;
  trainingMinutes: string;
  dailySteps: string;
  performancePriority: boolean;
  safetyStatus: SafetyStatus;
  safetyFlags: SafetyFlag[];
};

const initialForm: FormState = {
  age: "",
  sex: "",
  heightCm: "",
  weightKg: "",
  activityProfiles: [],
  workStyle: "",
  trainingDays: "",
  trainingMinutes: "",
  dailySteps: "",
  performancePriority: false,
  safetyStatus: "unanswered",
  safetyFlags: [],
};

const activityOptions: readonly {
  value: ActivityProfile;
  title: string;
  shortTitle: string;
  description: string;
  nasemLabel: string;
}[] = [
  {
    value: "inactive",
    title: "Günün çoğu düşük hareketle geçiyor",
    shortTitle: "Düşük hareket",
    description: "Masa başı çalışma, düşük günlük hareket ve sınırlı fiziksel aktivite.",
    nasemLabel: "Inactive",
  },
  {
    value: "lowActive",
    title: "Gün içinde bir miktar hareket ediyorum",
    shortTitle: "Bir miktar hareket",
    description: "Oturma ağırlıklı yaşamın yanında düzenli yürüyüş veya egzersiz.",
    nasemLabel: "Low active",
  },
  {
    value: "active",
    title: "Günlük yaşamım belirgin biçimde hareketli",
    shortTitle: "Belirgin hareket",
    description: "Gün içinde sık hareket, aktif iş veya yüksek toplam fiziksel aktivite.",
    nasemLabel: "Active",
  },
  {
    value: "veryActive",
    title: "Günüm çok yüksek fiziksel aktivite içeriyor",
    shortTitle: "Çok yüksek aktivite",
    description: "Yoğun fiziksel iş ve/veya çok yüksek günlük aktivite.",
    nasemLabel: "Very active",
  },
] as const;

const safetyOptions: readonly { value: SafetyFlag; label: string; description: string }[] = [
  {
    value: "pregnancyOrBreastfeeding",
    label: "Hamilelik veya emzirme",
    description: "Bu yaşam dönemleri ayrı enerji denklemleri ve kişisel değerlendirme gerektirir.",
  },
  {
    value: "eatingDisorderOrRedsRisk",
    label: "Aktif/şüpheli yeme bozukluğu veya RED-S riski",
    description: "Otomatik enerji hedefi yerine nitelikli profesyonel destek gerekir.",
  },
  {
    value: "competitionOrExtremeAthleteContext",
    label: "Yarışma hazırlığı veya ileri sporcu bağlamı",
    description: "Çok düşük yağ oranı, elit sporculuk ya da aşırı yüksek hacim bu gruba dahildir.",
  },
  {
    value: "medicalReviewContext",
    label: "Kişisel sağlık değerlendirmesi gerektiren durum",
    description:
      "Metabolik/endokrin durum, enerjiyi etkileyen ilaç, frailty/sarkopeni endişesi veya geçmiş yeme bozukluğu öyküsü.",
  },
] as const;

const goalLabels: Record<EnergyGoal, string> = {
  maintain: "Kilo koruma",
  lose: "Yağ kaybı",
  gain: "Kas kazanımı",
};

export default function EnergyLabExperience() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [goal, setGoal] = useState<EnergyGoal>("maintain");
  const [lossRate, setLossRate] = useState<DeficitRate>(0.1);
  const [gainMode, setGainMode] = useState<GainMode>("maintenance");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [evaluation, setEvaluation] = useState<EnergyLabEvaluation | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const completion = calculateCompletion(form, goal);

  function updateForm<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
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
      nextProfiles = Math.abs(currentIndex - nextIndex) === 1
        ? [...form.activityProfiles, profile].sort(
            (left, right) =>
              ACTIVITY_PROFILE_ORDER.indexOf(left) - ACTIVITY_PROFILE_ORDER.indexOf(right),
          )
        : [profile];
    } else {
      nextProfiles = [profile];
    }

    updateForm("activityProfiles", nextProfiles);
  }

  function toggleSafetyFlag(flag: SafetyFlag) {
    const nextFlags = form.safetyFlags.includes(flag)
      ? form.safetyFlags.filter((item) => item !== flag)
      : [...form.safetyFlags, flag];
    updateForm("safetyFlags", nextFlags);
  }

  function handleGoalChange(nextGoal: EnergyGoal) {
    setGoal(nextGoal);

    if (evaluation?.status === "ready" && nextGoal === "lose") {
      const policy = getFatLossPolicy(
        evaluation.bmi,
        form.performancePriority,
        evaluation.scope.fatLossAllowed,
      );
      if (policy.defaultRate) setLossRate(policy.defaultRate);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateForm(form);

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
      safetyFlags: form.safetyStatus === "applies" ? form.safetyFlags : [],
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

    if (nextEvaluation.status === "ready") {
      const policy = getFatLossPolicy(
        nextEvaluation.bmi,
        form.performancePriority,
        nextEvaluation.scope.fatLossAllowed,
      );
      if (policy.defaultRate) setLossRate(policy.defaultRate);
    }

    window.requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      });
    });
  }

  function focusFirstError(nextErrors: Record<string, string>) {
    window.requestAnimationFrame(() => {
      const firstField = Object.keys(nextErrors)[0];
      const selectors: Record<string, string> = {
        sex: "[name='sex']",
        activityProfiles: "[data-field='activityProfiles']",
        safetyStatus: "[name='safetyStatus']",
        safetyFlags: "[name='safetyFlags']",
      };
      const selector = selectors[firstField] ?? `#${firstField}`;
      const firstInvalid = document.querySelector<HTMLElement>(`#energy-lab-form ${selector}`);
      firstInvalid?.focus();
    });
  }

  return (
    <>
      <section id="simulator" className="bg-[#f4f1e9] px-6 py-16 text-[#102536] sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#8c6a2d]">
                Başlangıç değerlendirmesi
              </p>
              <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                Vücut bilgilerin ve toplam yaşam profilinle başla.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[#506171]">
              Antrenman günü ya da saat kalorisi tek başına çarpana çevrilmez. İki komşu yaşam
              profili arasında kaldığında iki ayrı başlangıç senaryosu görebilirsin.
            </p>
          </div>

          <div className="grid gap-7 xl:grid-cols-[minmax(0,1.12fr)_minmax(22rem,.88fr)] xl:items-start">
            <form
              id="energy-lab-form"
              onSubmit={handleSubmit}
              noValidate
              className="rounded-[1.75rem] border border-[#11283a]/10 bg-[#fbfaf6] p-6 shadow-[0_24px_70px_rgba(17,40,58,.08)] sm:p-8 lg:p-10"
            >
              <FormSection number="01" title="Temel bilgiler">
                <div className="grid gap-5 sm:grid-cols-2">
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
                    onChange={(value) => updateForm("age", value)}
                  />
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
                    onChange={(value) => updateForm("heightCm", value)}
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
                    onChange={(value) => updateForm("weightKg", value)}
                  />
                  <fieldset>
                    <legend className="text-sm font-bold text-[#102536]">
                      Hesaplama için biyolojik cinsiyet
                    </legend>
                    <p id="sex-helper" className="mt-1 text-xs leading-5 text-[#6b7883]">
                      NASEM ve Mifflin denklemlerindeki katsayı seçimi için gereklidir.
                    </p>
                    <div
                      className="mt-3 grid grid-cols-2 gap-3"
                      aria-describedby={`sex-helper${errors.sex ? " sex-error" : ""}`}
                    >
                      {(["female", "male"] as const).map((sex) => (
                        <label
                          key={sex}
                          className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 text-sm font-semibold transition focus-within:ring-2 focus-within:ring-[#9f7b38] ${
                            form.sex === sex
                              ? "border-[#9f7b38] bg-[#efe5d0] text-[#102536]"
                              : "border-[#11283a]/15 bg-white text-[#536574] hover:border-[#9f7b38]/60"
                          }`}
                        >
                          <input
                            type="radio"
                            name="sex"
                            value={sex}
                            checked={form.sex === sex}
                            onChange={() => updateForm("sex", sex)}
                            className="accent-[#9f7b38]"
                          />
                          {sex === "female" ? "Kadın" : "Erkek"}
                        </label>
                      ))}
                    </div>
                    {errors.sex && <FieldError id="sex-error">{errors.sex}</FieldError>}
                  </fieldset>
                </div>
              </FormSection>

              <FormSection number="02" title="Günlük hareket profili">
                <fieldset>
                  <legend className="sr-only">Toplam yaşam hareket profilini seç</legend>
                  <p id="activity-help" className="text-sm leading-7 text-[#5c6c78]">
                    Bir profil seç. İki profil arasında kalıyorsan yalnız yanındaki komşu profili de
                    seçebilirsin. Bu yaklaşık bir öz sınıflamadır; bireyi doğru NASEM PAL
                    sınıfına kesin ve güvenilir biçimde atayan tekil bir araç yoktur.
                  </p>
                  <div
                    className="mt-5 grid gap-3"
                    aria-describedby={`activity-help${errors.activityProfiles ? " activity-error" : ""}`}
                  >
                    {activityOptions.map((option, index) => {
                      const selected = form.activityProfiles.includes(option.value);
                      return (
                        <button
                          key={option.value}
                          type="button"
                          data-field="activityProfiles"
                          role="checkbox"
                          aria-checked={selected}
                          aria-invalid={Boolean(errors.activityProfiles)}
                          onClick={() => toggleActivity(option.value)}
                          className={`group flex min-h-24 w-full items-start gap-4 rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38] sm:p-5 ${
                            selected
                              ? "border-[#9f7b38] bg-[#efe5d0] shadow-[inset_3px_0_0_#9f7b38]"
                              : "border-[#11283a]/12 bg-white hover:border-[#9f7b38]/50"
                          }`}
                        >
                          <span
                            className={`flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                              selected
                                ? "border-[#9f7b38] bg-[#9f7b38] text-white"
                                : "border-[#11283a]/20 text-[#7b8790]"
                            }`}
                          >
                            {selected ? <Check aria-hidden="true" className="size-4" /> : index + 1}
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
                  {errors.activityProfiles && (
                    <FieldError id="activity-error">{errors.activityProfiles}</FieldError>
                  )}
                </fieldset>

                {form.activityProfiles.length === 2 && (
                  <p className="mt-4 flex items-start gap-2 rounded-xl border border-[#9f7b38]/20 bg-[#efe5d0]/60 p-4 text-sm leading-6 text-[#5f4a22]">
                    <Sparkles aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                    İki komşu profil seçildi. Sonuç tek sayı yerine aktivite senaryosu olarak
                    gösterilecek.
                  </p>
                )}
              </FormSection>

              <FormSection number="03" title="Antrenman bağlamı">
                <div className="grid gap-5 sm:grid-cols-2">
                  <SelectField
                    id="workStyle"
                    label="Çalışma şekli"
                    value={form.workStyle}
                    onChange={(value) => updateForm("workStyle", value as FormState["workStyle"])}
                    options={[
                      ["", "Belirtmek istemiyorum"],
                      ["desk", "Çoğunlukla oturarak"],
                      ["mixed", "Oturma ve hareket karışık"],
                      ["active", "Gün içinde sık hareket"],
                      ["physical", "Yoğun fiziksel iş"],
                    ]}
                  />
                  <NumberField
                    id="trainingDays"
                    label="Haftalık antrenman günü"
                    optional
                    value={form.trainingDays}
                    min={0}
                    max={7}
                    step={1}
                    inputMode="numeric"
                    placeholder="Örn. 4"
                    error={errors.trainingDays}
                    onChange={(value) => updateForm("trainingDays", value)}
                  />
                  <NumberField
                    id="trainingMinutes"
                    label="Haftalık yaklaşık süre"
                    unit="dk"
                    optional
                    value={form.trainingMinutes}
                    min={0}
                    max={1200}
                    step={5}
                    placeholder="Örn. 240"
                    error={errors.trainingMinutes}
                    onChange={(value) => updateForm("trainingMinutes", value)}
                  />
                  <NumberField
                    id="dailySteps"
                    label="Ortalama günlük adım"
                    optional
                    value={form.dailySteps}
                    min={0}
                    max={100000}
                    step={100}
                    inputMode="numeric"
                    placeholder="Örn. 7500"
                    error={errors.dailySteps}
                    onChange={(value) => updateForm("dailySteps", value)}
                  />
                </div>

                <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-[#11283a]/12 bg-white p-5 focus-within:ring-2 focus-within:ring-[#9f7b38]">
                  <input
                    type="checkbox"
                    checked={form.performancePriority}
                    onChange={(event) => updateForm("performancePriority", event.target.checked)}
                    className="mt-1 size-4 accent-[#9f7b38]"
                  />
                  <span>
                    <span className="block font-bold text-[#102536]">
                      Direnç antrenmanı veya performans önceliğim var
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-[#62717d]">
                      Bu seçim yağ kaybında %20 seçeneğini kapatır ve günlük açığı en fazla 500
                      kcal ile sınırlar.
                    </span>
                  </span>
                </label>

                <p className="mt-4 flex items-start gap-2 text-xs leading-6 text-[#6b7883]">
                  <Watch aria-hidden="true" className="mt-1 size-4 shrink-0 text-[#8c6a2d]" />
                  Saatinizin kalori tahminini doğrudan günlük hedefinize eklemiyoruz; bu ölçümlerin
                  bireysel enerji harcamasında anlamlı hata payı olabilir.
                </p>
              </FormSection>

              <FormSection number="04" title="Hedef senaryosu">
                <fieldset>
                  <legend className="sr-only">Hedef türünü seç</legend>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {(Object.keys(goalLabels) as EnergyGoal[]).map((goalOption) => (
                      <label
                        key={goalOption}
                        className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border px-4 text-sm font-bold transition focus-within:ring-2 focus-within:ring-[#9f7b38] ${
                          goal === goalOption
                            ? "border-[#9f7b38] bg-[#efe5d0]"
                            : "border-[#11283a]/12 bg-white text-[#5d6d79]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="goal"
                          value={goalOption}
                          checked={goal === goalOption}
                          onChange={() => handleGoalChange(goalOption)}
                          className="accent-[#9f7b38]"
                        />
                        {goalLabels[goalOption]}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </FormSection>

              <FormSection number="05" title="Kapsam ve güvenlik kontrolü" last>
                <div className="rounded-2xl border border-[#11283a]/12 bg-[#f5f2ea] p-5">
                  <div className="flex items-start gap-3">
                    <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#8c6a2d]" />
                    <p className="text-sm leading-7 text-[#536574]">
                      Energy Lab genel yetişkinlere yönelik bir başlangıç aracıdır. Tanı koymaz.
                      Aşağıdaki kısa kontrol, otomatik hedefin uygun olmadığı durumları belirlemek
                      içindir; yanıtlar cihazda bile saklanmaz.
                    </p>
                  </div>
                </div>

                <fieldset className="mt-5">
                  <legend className="font-bold text-[#102536]">
                    Aşağıdaki özel durumlardan biri sana uyuyor mu?
                  </legend>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {([
                      ["none", "Hayır, hiçbiri uymuyor"],
                      ["applies", "Evet, biri veya birkaçı uyuyor"],
                    ] as const).map(([value, label]) => (
                      <label
                        key={value}
                        className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border px-4 text-sm font-semibold transition focus-within:ring-2 focus-within:ring-[#9f7b38] ${
                          form.safetyStatus === value
                            ? "border-[#9f7b38] bg-[#efe5d0]"
                            : "border-[#11283a]/12 bg-white text-[#5d6d79]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="safetyStatus"
                          value={value}
                          checked={form.safetyStatus === value}
                          onChange={() => {
                            updateForm("safetyStatus", value);
                            if (value === "none") updateForm("safetyFlags", []);
                          }}
                          className="accent-[#9f7b38]"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                  {errors.safetyStatus && <FieldError>{errors.safetyStatus}</FieldError>}
                </fieldset>

                {form.safetyStatus === "applies" && (
                  <fieldset className="mt-5 rounded-2xl border border-[#9f7b38]/20 bg-[#fffdf8] p-5">
                    <legend className="px-2 text-sm font-bold text-[#102536]">
                      Uyan durumları seç
                    </legend>
                    <div className="space-y-3">
                      {safetyOptions.map((option) => (
                        <label key={option.value} className="flex cursor-pointer items-start gap-3">
                          <input
                            type="checkbox"
                            name="safetyFlags"
                            checked={form.safetyFlags.includes(option.value)}
                            onChange={() => toggleSafetyFlag(option.value)}
                            aria-invalid={Boolean(errors.safetyFlags)}
                            className="mt-1 size-4 accent-[#9f7b38]"
                          />
                          <span>
                            <span className="block text-sm font-bold text-[#102536]">
                              {option.label}
                            </span>
                            <span className="mt-1 block text-xs leading-5 text-[#6b7883]">
                              {option.description}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                    {errors.safetyFlags && <FieldError>{errors.safetyFlags}</FieldError>}
                  </fieldset>
                )}
              </FormSection>

              <button
                type="submit"
                className="mt-8 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl border border-[#102536] bg-[#102536] px-6 py-4 text-sm font-bold text-white shadow-[0_14px_34px_rgba(16,37,54,.18)] transition hover:-translate-y-0.5 hover:bg-[#173247] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38] focus-visible:ring-offset-2 motion-reduce:transform-none"
              >
                Başlangıç tahminimi oluştur
                <ArrowRight aria-hidden="true" className="size-4" />
              </button>
            </form>

            <EnergyProfilePanel form={form} goal={goal} completion={completion} />
          </div>

          <div ref={resultRef} className="scroll-mt-28">
            {evaluation?.status === "blocked" && <BlockedResult evaluation={evaluation} />}
            {evaluation?.status === "ready" && (
              <ReadyResults
                evaluation={evaluation}
                age={Number(form.age)}
                goal={goal}
                onGoalChange={handleGoalChange}
                lossRate={lossRate}
                onLossRateChange={setLossRate}
                gainMode={gainMode}
                onGainModeChange={setGainMode}
                performancePriority={form.performancePriority}
                weightKg={Number(form.weightKg)}
              />
            )}
          </div>
        </div>
      </section>

      <CalibrationPanel sex={form.sex} />
    </>
  );
}

function EnergyProfilePanel({
  form,
  goal,
  completion,
}: {
  form: FormState;
  goal: EnergyGoal;
  completion: number;
}) {
  const selectedActivity = form.activityProfiles
    .map((profile) => activityOptions.find((option) => option.value === profile)?.shortTitle)
    .filter(Boolean)
    .join(" ↔ ");

  const trainingContext = [
    form.trainingDays ? `${form.trainingDays} gün` : null,
    form.trainingMinutes ? `${form.trainingMinutes} dk/hafta` : null,
    form.dailySteps ? `${Number(form.dailySteps).toLocaleString("tr-TR")} adım` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <aside className="overflow-hidden rounded-[1.75rem] border border-[#d0af69]/25 bg-[#071523] text-white shadow-[0_26px_80px_rgba(7,21,35,.2)] xl:sticky xl:top-28">
      <div className="relative overflow-hidden border-b border-white/10 p-6 sm:p-8">
        <div aria-hidden="true" className="absolute -right-12 -top-12 size-48 rounded-full border border-[#d0af69]/10" />
        <PersonStanding
          aria-hidden="true"
          strokeWidth={1}
          className="pointer-events-none absolute -bottom-10 right-3 size-52 text-white/[.055]"
        />
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d0af69]">Enerji Profili</p>
        <h3 className="mt-4 text-2xl font-semibold">Başlangıç resmin</h3>
        <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
          Profil, vücut kompozisyonu ölçümü değildir. Yalnız seçtiğin girdileri özetler.
        </p>

        <div className="mt-7 flex items-center justify-between gap-4 text-xs text-slate-400">
          <span>Tamamlanma</span>
          <span className="font-bold text-[#ead5a8]">%{completion}</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
          <div
            className="h-full rounded-full bg-[#d0af69] transition-[width] duration-300 motion-reduce:transition-none"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      <dl className="divide-y divide-white/10 px-6 sm:px-8">
        <ProfileRow label="Yaş" value={form.age ? `${form.age} yaş` : "Bekleniyor"} />
        <ProfileRow label="Boy" value={form.heightCm ? `${form.heightCm} cm` : "Bekleniyor"} />
        <ProfileRow label="Kilo" value={form.weightKg ? `${form.weightKg} kg` : "Bekleniyor"} />
        <ProfileRow label="Günlük hareket" value={selectedActivity || "Henüz seçilmedi"} />
        <ProfileRow label="Antrenman bağlamı" value={trainingContext || "İsteğe bağlı"} />
        <ProfileRow label="Seçilen hedef" value={goalLabels[goal]} />
      </dl>

      <div className="m-6 rounded-2xl border border-[#d0af69]/20 bg-[#d0af69]/[.07] p-5 sm:m-8">
        <p className="text-sm font-semibold leading-7 text-[#f0dfba]">
          Vücut bilgilerin + toplam aktivite profilin
          <span className="mx-2 text-[#d0af69]">→</span>
          başlangıç enerji tahmini
        </p>
      </div>
    </aside>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] gap-4 py-4">
      <dt className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{label}</dt>
      <dd className="text-right text-sm font-semibold text-slate-200">{value}</dd>
    </div>
  );
}

function BlockedResult({ evaluation }: { evaluation: Extract<EnergyLabEvaluation, { status: "blocked" }> }) {
  return (
    <section
      aria-live="polite"
      aria-labelledby="scope-result-title"
      className="mt-12 overflow-hidden rounded-[1.75rem] border border-[#9f7b38]/30 bg-[#fffaf0] shadow-[0_24px_70px_rgba(17,40,58,.08)]"
    >
      <div className="flex items-start gap-4 border-b border-[#11283a]/10 bg-[#102536] p-6 text-white sm:p-8">
        <AlertTriangle aria-hidden="true" className="mt-1 size-6 shrink-0 text-[#d0af69]" />
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d0af69]">Kapsam kontrolü</p>
          <h2 id="scope-result-title" className="mt-3 text-2xl font-semibold sm:text-3xl">
            Standart sayısal hedef gösterilmiyor.
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            Bu sonuç bir tanı değildir. Energy Lab’in genel yetişkinlere yönelik güvenli ürün
            sınırını gösterir.
          </p>
        </div>
      </div>
      <div className="grid gap-4 p-6 sm:p-8 lg:grid-cols-2">
        {evaluation.scope.reasons.map((reason) => (
          <article key={reason.code} className="rounded-2xl border border-[#11283a]/10 bg-white p-5">
            <h3 className="font-bold text-[#102536]">{reason.title}</h3>
            <p className="mt-2 text-sm leading-7 text-[#5c6c78]">{reason.message}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ReadyResults({
  evaluation,
  age,
  goal,
  onGoalChange,
  lossRate,
  onLossRateChange,
  gainMode,
  onGainModeChange,
  performancePriority,
  weightKg,
}: {
  evaluation: ReadyEnergyEvaluation;
  age: number;
  goal: EnergyGoal;
  onGoalChange: (goal: EnergyGoal) => void;
  lossRate: DeficitRate;
  onLossRateChange: (rate: DeficitRate) => void;
  gainMode: GainMode;
  onGainModeChange: (mode: GainMode) => void;
  performancePriority: boolean;
  weightKg: number;
}) {
  const lossPolicy = getFatLossPolicy(
    evaluation.bmi,
    performancePriority,
    evaluation.scope.fatLossAllowed,
  );

  const selection: GoalSelection =
    goal === "maintain"
      ? { goal: "maintain" }
      : goal === "lose"
        ? { goal: "lose", rate: lossRate }
        : { goal: "gain", mode: gainMode };

  const targetScenario = calculateTargetScenario({
    evaluation,
    selection,
    performancePriority,
  });

  return (
    <div aria-live="polite" aria-atomic="true" className="mt-12 space-y-8">
      <section className="overflow-hidden rounded-[1.9rem] border border-[#d0af69]/25 bg-[#071523] text-white shadow-[0_28px_80px_rgba(7,21,35,.2)]">
        <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d0af69]">
              {evaluation.maintenance.kind === "range"
                ? "Olası aktivite senaryosu"
                : "Tahmini başlangıç noktan"}
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
              {formatKcalScenario(
                evaluation.maintenance.displayMin,
                evaluation.maintenance.displayMax,
              )}
            </h2>
            <p className="mt-3 text-sm font-semibold text-[#ead5a8]">Tahmini bakım enerjisi</p>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-400">
              {evaluation.maintenance.kind === "range"
                ? "Bu aralık istatistiksel güven aralığı değildir; seçtiğiniz iki olası aktivite profilinin ürettiği başlangıç tahminlerini gösterir."
                : "Bu değer, NASEM 2023 yetişkin enerji denklemleri kullanılarak oluşturulan bir başlangıç tahminidir. Ölçülmüş kesin enerji ihtiyacınız değildir."}
            </p>
            <p className="mt-3 max-w-3xl text-xs leading-6 text-slate-500">
              NASEM EER denklemleri ağırlığı stabil yetişkinlerde toplam enerji harcamasını
              tahmin eder; kilo verme veya alma hedefi olarak geliştirilmemiştir ve bireysel hata
              payı birkaç yüz kcal/gün olabilir.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:min-w-72">
            <ResultMini
              label="BMI · ham sınıra göre"
              value={`${evaluation.bmi.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} · ${bmiPolicyLabel(evaluation.bmi)}`}
            />
            <ResultMini
              label="İkincil RMR"
              value={
                age <= 78
                  ? `${Math.round(evaluation.mifflinRmr).toLocaleString("tr-TR")} kcal/gün`
                  : "Örneklem dışı · gösterilmiyor"
              }
            />
          </div>
        </div>

        <div className="border-t border-white/10 px-6 py-7 sm:px-9">
          <EnergyScale evaluation={evaluation} />
          <p className="mt-4 text-xs leading-6 text-slate-500">
            {age <= 78
              ? "Mifflin–St Jeor sonucu yalnız ikincil dinlenme enerjisi bilgisidir; bakım hedefi bu değerin aktivite çarpanıyla çoğaltılmasından üretilmez."
              : "Mifflin–St Jeor çalışmasının örneklemi 19–78 yaşla sınırlıdır; 79+ yaşta ekstrapole edilmiş ikincil RMR sayısı gösterilmez."}
          </p>
        </div>
      </section>

      {evaluation.scope.status === "limited" && (
        <div className="rounded-2xl border border-[#9f7b38]/25 bg-[#fff8e9] p-5 text-sm leading-7 text-[#604c28]">
          <strong className="block text-[#102536]">{evaluation.scope.reasons[0]?.title}</strong>
          {evaluation.scope.reasons[0]?.message}
        </div>
      )}

      <section className="rounded-[1.75rem] border border-[#11283a]/10 bg-[#fbfaf6] p-6 shadow-[0_24px_70px_rgba(17,40,58,.07)] sm:p-8 lg:p-10">
        <div className="flex items-start gap-4">
          <Target aria-hidden="true" className="mt-1 size-6 shrink-0 text-[#8c6a2d]" />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8c6a2d]">
              Hedef senaryoları
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-[#102536] sm:text-3xl">
              Kontrollü bir başlangıç seç.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5c6c78]">
              Bunlar kesin kilo değişimi vaatleri değil, aynı bakım tahmininden türetilen başlangıç
              seçenekleridir.
            </p>
          </div>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-3" role="group" aria-label="Hedef türü">
          {(Object.keys(goalLabels) as EnergyGoal[]).map((goalOption) => (
            <button
              key={goalOption}
              type="button"
              aria-pressed={goal === goalOption}
              onClick={() => onGoalChange(goalOption)}
              className={`min-h-14 rounded-xl border px-4 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38] ${
                goal === goalOption
                  ? "border-[#102536] bg-[#102536] text-white"
                  : "border-[#11283a]/12 bg-white text-[#536574] hover:border-[#9f7b38]/60"
              }`}
            >
              {goalLabels[goalOption]}
            </button>
          ))}
        </div>

        {goal === "lose" && (
          <>
            <div className="mt-6 grid gap-3 lg:grid-cols-3">
              {lossPolicy.options.map((option) => (
                <button
                  key={option.rate}
                  type="button"
                  disabled={!option.enabled}
                  aria-pressed={lossRate === option.rate}
                  aria-describedby={!option.enabled ? `loss-reason-${option.rate}` : undefined}
                  onClick={() => onLossRateChange(option.rate)}
                  className={`rounded-2xl border p-5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38] disabled:cursor-not-allowed ${
                    lossRate === option.rate && option.enabled
                      ? "border-[#9f7b38] bg-[#efe5d0]"
                      : "border-[#11283a]/12 bg-white"
                  } ${!option.enabled ? "opacity-60" : "hover:border-[#9f7b38]/60"}`}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="font-bold text-[#102536]">{option.label}</span>
                    {lossRate === option.rate && option.enabled && (
                      <Check aria-hidden="true" className="size-4 text-[#8c6a2d]" />
                    )}
                  </span>
                  <span className="mt-2 block text-xs leading-5 text-[#657581]">
                    {option.enabled
                      ? option.rate === 0.1
                        ? "Daha ölçülü başlangıç açığı."
                        : option.rate === 0.15
                          ? "Orta düzey başlangıç açığı."
                          : "Yalnız uygun profillerde daha yüksek başlangıç açığı."
                      : option.reason}
                  </span>
                  {!option.enabled && (
                    <span id={`loss-reason-${option.rate}`} className="sr-only">
                      {option.reason}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <p className="mt-4 text-xs leading-6 text-[#6a7882]">
              %10/%15/%20 oranları, BMI grupları, 500/750 kcal tavanları ve 1.200 kcal
              gösterim kapısı Energy Lab ürün politikasıdır; kanıtlanmış optimum oran veya
              biyolojik minimum olarak sunulmaz.
            </p>
          </>
        )}

        {goal === "gain" && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {([
              ["maintenance", "Bakım çevresinde başla", "Bakım tahminiyle aynı başlangıç senaryosu."],
              [
                "smallSurplus",
                "Küçük başlangıç fazlası · yaklaşık +%5",
                "+%5, optimum olduğu kanıtlanmış bir oran değildir; küçük ve kontrollü bir başlangıç senaryosudur.",
              ],
            ] as const).map(([mode, label, description]) => (
              <button
                key={mode}
                type="button"
                aria-pressed={gainMode === mode}
                onClick={() => onGainModeChange(mode)}
                className={`rounded-2xl border p-5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38] ${
                  gainMode === mode
                    ? "border-[#9f7b38] bg-[#efe5d0]"
                    : "border-[#11283a]/12 bg-white hover:border-[#9f7b38]/60"
                }`}
              >
                <span className="flex items-center justify-between gap-3 font-bold text-[#102536]">
                  {label}
                  {gainMode === mode && <Check aria-hidden="true" className="size-4 text-[#8c6a2d]" />}
                </span>
                <span className="mt-2 block text-xs leading-5 text-[#657581]">{description}</span>
              </button>
            ))}
          </div>
        )}

        <TargetResultCard
          scenario={targetScenario}
          selection={selection}
          deficitCapKcal={lossPolicy.deficitCapKcal}
        />

        {targetScenario.status === "available" && (
          <MacroTransfer scenario={targetScenario} weightKg={weightKg} />
        )}
      </section>
    </div>
  );
}

function TargetResultCard({
  scenario,
  selection,
  deficitCapKcal,
}: {
  scenario: TargetScenario;
  selection: GoalSelection;
  deficitCapKcal: number | null;
}) {
  const title =
    selection.goal === "maintain"
      ? "Başlangıç bakım hedefi"
      : selection.goal === "lose"
        ? "Başlangıç yağ kaybı hedefi"
        : selection.mode === "smallSurplus"
          ? "Küçük fazlalık senaryosu"
          : "Bakım çevresinde başlangıç";

  if (scenario.status === "unavailable") {
    return (
      <div className="mt-7 rounded-2xl border border-[#9f7b38]/30 bg-[#fff8e9] p-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8c6a2d]">{title}</p>
        <p className="mt-3 text-sm leading-7 text-[#604c28]">{scenario.message}</p>
      </div>
    );
  }

  const deficitPoints = scenario.points.filter(
    (point) => point.actualDeficitKcal !== undefined,
  );
  const deficitValues = deficitPoints.map((point) => point.actualDeficitKcal ?? 0);
  const capApplied =
    selection.goal === "lose" &&
    deficitCapKcal !== null &&
    deficitPoints.some((point) => {
      const actualDeficit = point.actualDeficitKcal ?? 0;
      const rawMaintenance = point.rawKcal + actualDeficit;
      return rawMaintenance * selection.rate - actualDeficit > 1e-8;
    });

  return (
    <div className="mt-7 overflow-hidden rounded-2xl border border-[#102536] bg-[#102536] p-6 text-white sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d0af69]">{title}</p>
          <p className="mt-3 text-3xl font-semibold sm:text-4xl">
            {formatKcalScenario(scenario.displayMin, scenario.displayMax)}
          </p>
        </div>
        {selection.goal === "lose" && deficitValues.length > 0 && (
          <p className="text-xs leading-6 text-slate-400 sm:max-w-xs sm:text-right">
            Gerçekleşen başlangıç açığı: {formatKcalScenario(
              roundToNearest50(Math.min(...deficitValues)),
              roundToNearest50(Math.max(...deficitValues)),
            )}.{" "}
            {capApplied
              ? `${deficitCapKcal?.toLocaleString("tr-TR")} kcal/gün ürün tavanı en az bir senaryoda devreye girdi.`
              : "Seçilen oran, uygulanabilir ürün tavanına ulaşmadı."}
          </p>
        )}
      </div>
    </div>
  );
}

function MacroTransfer({
  scenario,
  weightKg,
}: {
  scenario: Extract<TargetScenario, { status: "available" }>;
  weightKg: number;
}) {
  const router = useRouter();
  const [selectedProfile, setSelectedProfile] = useState<ActivityProfile | "">(
    scenario.points.length === 1 ? scenario.points[0].profile : "",
  );
  const selectedPoint = scenario.points.find((point) => point.profile === selectedProfile);

  function handleContinue() {
    if (!selectedPoint) return;
    writeEnergyLabHandoff(window.sessionStorage, {
      rawTargetKcal: selectedPoint.rawKcal,
      displayTargetKcal: selectedPoint.displayKcal,
      goal: scenario.goal,
      weightKg,
      activityProfile: selectedPoint.profile,
    });
    router.push("/calculators/macro?source=energy-lab");
  }

  return (
    <div className="mt-6 flex flex-col gap-5 rounded-2xl border border-[#9f7b38]/20 bg-[#f3ecdd] p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
      <div className="max-w-2xl">
        <p className="font-bold text-[#102536]">Bu hedefle makrolarını planla</p>
        <p className="mt-2 text-sm leading-6 text-[#5e6e79]">
          Yuvarlanmamış iç hedef güvenli biçimde bu tarayıcı oturumunda aktarılır; sağlık ve kapsam
          cevapları URL’ye yazılmaz.
        </p>
        {scenario.points.length > 1 && (
          <label className="mt-4 block max-w-md text-sm font-bold text-[#102536]">
            Makro planı için aktivite senaryosu
            <select
              value={selectedProfile}
              onChange={(event) => setSelectedProfile(event.target.value as ActivityProfile)}
              className="mt-2 min-h-12 w-full rounded-xl border border-[#11283a]/20 bg-white px-4 text-[#102536] outline-none focus:border-[#9f7b38] focus:ring-2 focus:ring-[#9f7b38]/20"
            >
              <option value="">Senaryo seç</option>
              {scenario.points.map((point) => (
                <option key={point.profile} value={point.profile}>
                  {activityLabel(point.profile)} · {point.displayKcal.toLocaleString("tr-TR")} kcal
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      <button
        type="button"
        disabled={!selectedPoint}
        onClick={handleContinue}
        className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#102536] bg-[#102536] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#173247] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Makro Planlayıcı’ya geç
        <ArrowRight aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}

function EnergyScale({ evaluation }: { evaluation: ReadyEnergyEvaluation }) {
  const { points } = evaluation.maintenance;
  const span = evaluation.maintenance.rawMax - evaluation.maintenance.rawMin;
  const padding = Math.max(200, span * 0.5);
  const domainMin = evaluation.maintenance.rawMin - padding;
  const domainMax = evaluation.maintenance.rawMax + padding;
  const position = (value: number) => ((value - domainMin) / (domainMax - domainMin)) * 100;
  const firstPosition = position(points[0].rawKcal);
  const lastPosition = position(points.at(-1)?.rawKcal ?? points[0].rawKcal);

  return (
    <div
      role="img"
      aria-label={
        points.length === 1
          ? `Bakım enerjisi işareti yaklaşık ${points[0].displayKcal.toLocaleString("tr-TR")} kilokalori.`
          : `İki aktivite senaryosu yaklaşık ${evaluation.maintenance.displayMin.toLocaleString("tr-TR")} ile ${evaluation.maintenance.displayMax.toLocaleString("tr-TR")} kilokalori arasında.`
      }
    >
      <div className="relative h-3 rounded-full bg-white/10">
        {points.length === 1 ? (
          <span
            aria-hidden="true"
            className="absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-[#071523] bg-[#d0af69] shadow-[0_0_0_1px_rgba(208,175,105,.5)]"
            style={{ left: `${firstPosition}%` }}
          />
        ) : (
          <span
            aria-hidden="true"
            className="absolute top-0 h-full rounded-full bg-[#d0af69]"
            style={{ left: `${firstPosition}%`, width: `${lastPosition - firstPosition}%` }}
          />
        )}
      </div>
      <div className="mt-4 flex justify-between gap-4 text-xs text-slate-500">
        {points.map((point) => (
          <span key={point.profile}>
            {activityLabel(point.profile)} · {point.displayKcal.toLocaleString("tr-TR")} kcal
          </span>
        ))}
      </div>
    </div>
  );
}

function ResultMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[.04] p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-[#ead5a8]">{value}</p>
    </div>
  );
}

function FormSection({
  number,
  title,
  children,
  last = false,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <section className={last ? "pt-8" : "border-b border-[#11283a]/10 py-8 first:pt-0"}>
      <div className="mb-6 flex items-center gap-3">
        <span className="font-mono text-xs font-bold text-[#8c6a2d]">{number}</span>
        <h3 className="text-xl font-semibold text-[#102536]">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function NumberField({
  id,
  label,
  unit,
  optional,
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
  optional?: boolean;
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
        <span>
          {label}
          {optional && <span className="ml-1 font-normal text-[#7b8790]">(isteğe bağlı)</span>}
        </span>
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
        aria-describedby={[helper ? helperId : "", error ? errorId : ""].filter(Boolean).join(" ") || undefined}
        className="mt-2 min-h-12 w-full rounded-xl border border-[#11283a]/15 bg-white px-4 font-normal text-[#102536] outline-none transition placeholder:text-[#9ba3a9] focus:border-[#9f7b38] focus:ring-2 focus:ring-[#9f7b38]/20"
      />
      {helper && (
        <span id={helperId} className="mt-2 block text-xs font-normal leading-5 text-[#6b7883]">
          {helper}
        </span>
      )}
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </label>
  );
}

function SelectField({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: readonly (readonly [string, string])[];
  onChange: (value: string) => void;
}) {
  return (
    <label htmlFor={id} className="block text-sm font-bold text-[#102536]">
      {label}
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-12 w-full rounded-xl border border-[#11283a]/15 bg-white px-4 font-normal text-[#102536] outline-none transition focus:border-[#9f7b38] focus:ring-2 focus:ring-[#9f7b38]/20"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue || "empty"} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
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

function validateForm(form: FormState): Record<string, string> {
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
  if (form.activityProfiles.length < 1 || form.activityProfiles.length > 2) {
    errors.activityProfiles = "En az bir günlük hareket profili seçilmelidir.";
  }
  validateOptionalNumber(form.trainingDays, 0, 7, "Antrenman günü", "trainingDays", errors, true);
  validateOptionalNumber(
    form.trainingMinutes,
    0,
    1200,
    "Haftalık antrenman süresi",
    "trainingMinutes",
    errors,
  );
  validateOptionalNumber(form.dailySteps, 0, 100000, "Günlük adım", "dailySteps", errors, true);
  if (form.safetyStatus === "unanswered") {
    errors.safetyStatus = "Kapsam kontrolü için bir yanıt seçilmelidir.";
  }
  if (form.safetyStatus === "applies" && form.safetyFlags.length === 0) {
    errors.safetyFlags = "Sana uyan en az bir durumu seçmelisin.";
  }

  return errors;
}

function validateOptionalNumber(
  value: string,
  minimum: number,
  maximum: number,
  label: string,
  field: string,
  errors: Record<string, string>,
  integer = false,
) {
  if (!value) return;
  const numericValue = Number(value);
  if (
    !Number.isFinite(numericValue) ||
    numericValue < minimum ||
    numericValue > maximum ||
    (integer && !Number.isInteger(numericValue))
  ) {
    errors[field] = `${label} ${minimum} ile ${maximum} arasında${integer ? " tam sayı" : ""} olmalıdır.`;
  }
}

function calculateCompletion(form: FormState, goal: EnergyGoal): number {
  const completed = [
    form.age,
    form.sex,
    form.heightCm,
    form.weightKg,
    form.activityProfiles.length > 0,
    goal,
    form.safetyStatus !== "unanswered",
  ].filter(Boolean).length;
  return Math.round((completed / 7) * 100);
}

function formatKcalScenario(minimum: number, maximum: number): string {
  if (minimum === maximum) {
    return `Yaklaşık ${minimum.toLocaleString("tr-TR")} kcal/gün`;
  }
  return `Yaklaşık ${minimum.toLocaleString("tr-TR")}–${maximum.toLocaleString("tr-TR")} kcal/gün`;
}

function activityLabel(profile: ActivityProfile): string {
  return activityOptions.find((option) => option.value === profile)?.shortTitle ?? profile;
}

function bmiPolicyLabel(bmi: number): string {
  if (bmi < 16) return "<16 kapsamı";
  if (bmi < 18.5) return "<18,5 kuralı";
  if (bmi < 25) return "18,5–24,9 kuralı";
  if (bmi < 50) return "25+ kuralı";
  return "50+ kapsamı";
}
