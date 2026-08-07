"use client";

import { useMemo, useState } from "react";

import CalculatorSection from "@/components/calculators/CalculatorSection";
import ExerciseInput from "@/components/performance/ExerciseInput";
import PerformanceDashboard from "@/components/performance/PerformanceDashboard";
import CTAButton from "@/components/ui/CTAButton";
import { analyzePerformance, PERFORMANCE_EXERCISES } from "@/lib/performance";
import type { PerformanceExerciseInput, PerformanceUserProfile } from "@/types/performance";

type FieldErrors = Record<string, string | undefined>;

const initialProfile: PerformanceUserProfile = { gender: "prefer-not-to-say", age: "", bodyWeight: "", experience: "beginner", weeklyTrainingDays: "", goal: "general" };
const initialExercises: PerformanceExerciseInput[] = PERFORMANCE_EXERCISES.map((exercise, index) => ({ id: exercise.id, enabled: index < 3, weight: "", repetitions: "", sets: "", rir: "" }));

function isWithin(value: string, minimum: number, maximum: number) {
  const number = Number(value);
  return Number.isFinite(number) && number >= minimum && number <= maximum;
}

export default function PerformanceAnalysis() {
  const [profile, setProfile] = useState<PerformanceUserProfile>(initialProfile);
  const [exercises, setExercises] = useState<PerformanceExerciseInput[]>(initialExercises);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const bodyWeight = isWithin(profile.bodyWeight, 30, 300) ? Number(profile.bodyWeight) : undefined;
  const weeklyTrainingDays = isWithin(profile.weeklyTrainingDays, 1, 7) ? Number(profile.weeklyTrainingDays) : undefined;
  const analysis = useMemo(() => analyzePerformance(exercises, bodyWeight, weeklyTrainingDays), [bodyWeight, exercises, weeklyTrainingDays]);

  function updateExercise(nextExercise: PerformanceExerciseInput) {
    setExercises((current) => current.map((exercise) => exercise.id === nextExercise.id ? nextExercise : exercise));
    setErrors((current) => ({ ...current, [nextExercise.id]: undefined }));
    setIsSubmitted(false);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: FieldErrors = {};
    const enabledExercises = exercises.filter((exercise) => exercise.enabled);
    if (enabledExercises.length < 2) nextErrors.general = "Anlamlı bir karşılaştırma için en az iki hareketi dahil et.";
    if (profile.age && !isWithin(profile.age, 15, 100)) nextErrors.age = "Yaş 15 ile 100 arasında olmalı.";
    if (profile.bodyWeight && !isWithin(profile.bodyWeight, 30, 300)) nextErrors.bodyWeight = "Vücut ağırlığı 30 ile 300 kg arasında olmalı.";
    if (profile.weeklyTrainingDays && !isWithin(profile.weeklyTrainingDays, 1, 7)) nextErrors.weeklyTrainingDays = "Haftalık gün sayısı 1 ile 7 arasında olmalı.";
    for (const exercise of enabledExercises) {
      if (!isWithin(exercise.weight, 1, 500) || !isWithin(exercise.repetitions, 1, 20) || !isWithin(exercise.sets, 1, 20)) nextErrors[exercise.id] = "Ağırlık (1–500), tekrar (1–20) ve set (1–20) alanlarını doldur.";
      if (exercise.rir && !isWithin(exercise.rir, 0, 10)) nextErrors[exercise.id] = "RIR 0 ile 10 arasında olmalı.";
    }
    setErrors(nextErrors);
    setIsSubmitted(Object.keys(nextErrors).length === 0);
  }

  function handleReset() {
    setProfile(initialProfile);
    setExercises(initialExercises);
    setErrors({});
    setIsSubmitted(false);
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-8 xl:grid-cols-2 xl:items-start">
        <form onSubmit={handleSubmit} className="space-y-6">
          <CalculatorSection title="Profil Bilgilerin" description="Bu alanların tümü isteğe bağlıdır; vücut ağırlığı göreli kuvvet yorumunu, antrenman günleri tahmini haftalık hacmi destekler.">
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField label="Cinsiyet" value={profile.gender} onChange={(value) => setProfile({ ...profile, gender: value as PerformanceUserProfile["gender"] })} options={[["prefer-not-to-say", "Belirtmek istemiyorum"], ["female", "Kadın"], ["male", "Erkek"]]} />
              <NumberField label="Yaş" value={profile.age} error={errors.age} min={15} max={100} onChange={(value) => setProfile({ ...profile, age: value })} />
              <NumberField label="Vücut ağırlığı" unit="kg" value={profile.bodyWeight} error={errors.bodyWeight} min={30} max={300} step={0.1} onChange={(value) => setProfile({ ...profile, bodyWeight: value })} />
              <NumberField label="Haftalık antrenman günü" value={profile.weeklyTrainingDays} error={errors.weeklyTrainingDays} min={1} max={7} onChange={(value) => setProfile({ ...profile, weeklyTrainingDays: value })} />
              <SelectField label="Deneyim seviyesi" value={profile.experience} onChange={(value) => setProfile({ ...profile, experience: value as PerformanceUserProfile["experience"] })} options={[["beginner", "Başlangıç"], ["intermediate", "Orta"], ["advanced", "İleri"]]} />
              <SelectField label="Öncelikli hedef" value={profile.goal} onChange={(value) => setProfile({ ...profile, goal: value as PerformanceUserProfile["goal"] })} options={[["general", "Genel fitness"], ["muscle", "Kas kazanımı"], ["strength", "Kuvvet"]]} />
            </div>
          </CalculatorSection>
          <CalculatorSection title="Hareket Performansın" description="Yalnızca yaptığın hareketleri dahil et. Her aktif hareket için son temsilî setinin ağırlık, tekrar ve set bilgisini gir.">
            <div className="space-y-4">
              {PERFORMANCE_EXERCISES.map((definition) => {
                const value = exercises.find((exercise) => exercise.id === definition.id);
                return value ? <ExerciseInput key={definition.id} definition={definition} value={value} errors={errors[definition.id] ? { weight: errors[definition.id] } : {}} onChange={updateExercise} /> : null;
              })}
            </div>
            {errors.general && <p className="mt-4 text-sm text-amber-300">{errors.general}</p>}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row"><CTAButton type="submit" className="w-full sm:w-auto">Performansımı Analiz Et</CTAButton><CTAButton type="button" variant="ghost" onClick={handleReset} className="w-full sm:w-auto">Formu Sıfırla</CTAButton></div>
          </CalculatorSection>
        </form>
        {isSubmitted ? <PerformanceDashboard analysis={analysis} hasBodyWeight={bodyWeight !== undefined} /> : <CalculatorSection title="Performans Dashboard" description="Geçerli en az iki hareket girdisiyle analizini başlattığında sonuçların burada görünecek." className="min-h-full"><p className="text-sm leading-6 text-neutral-400">Bu araç tek seferlik performans fotoğrafı sunar. Düzenli kayıtlar ve aynı teknik standartları zaman içindeki değişimi daha anlamlı hale getirir.</p></CalculatorSection>}
      </div>
      <CalculatorSection title="Metodoloji ve Sınırlılıklar" description="Sonuçların nasıl üretildiğini açıkça gösterir.">
        <div className="space-y-3 text-sm leading-6 text-neutral-400"><p>Tahmini 1RM, mevcut Trainology Epley fonksiyonuyla ağırlık × (1 + tekrar / 30) yaklaşımı kullanılarak hesaplanır.</p><p>Hacim, ağırlık × tekrar × set olarak gösterilir. Bu değer tek başına antrenman kalitesini veya hipertrofi potansiyelini belirlemez; teknik, hareket açıklığı, efor, toparlanma ve program bağlamı da önemlidir.</p><p>Trainology Performance Score, dış normlar veya klinik eşikler kullanmaz. Aktif hareketlerdeki göreli kuvvet dağılımını 0–100 ölçeğinde özetleyen dahili, karşılaştırmalı bir göstergedir.</p><p>Bu analiz tıbbi tanı, sakatlık riski değerlendirmesi veya bireysel antrenman reçetesi değildir. Teknik, ölçüm doğruluğu ve günlük performans sonucu etkileyebilir.</p></div>
      </CalculatorSection>
    </div>
  );
}

type NumberFieldProps = { label: string; unit?: string; value: string; error?: string; min: number; max: number; step?: number; onChange: (value: string) => void };
function NumberField({ label, unit, value, error, min, max, step = 1, onChange }: NumberFieldProps) {
  return <label className="block text-sm font-medium text-neutral-200">{label}{unit ? <span className="ml-1 text-neutral-500">({unit})</span> : null}<input type="number" min={min} max={max} step={step} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-black/30 px-3 text-white outline-none transition focus:border-[#C9A14A]/70" />{error && <span className="mt-1 block text-xs text-amber-300">{error}</span>}</label>;
}
type SelectFieldProps = { label: string; value: string; options: readonly (readonly [string, string])[]; onChange: (value: string) => void };
function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  return <label className="block text-sm font-medium text-neutral-200">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-black/30 px-3 text-white outline-none transition focus:border-[#C9A14A]/70">{options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}</select></label>;
}
