"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

import Badge from "@/components/ui/Badge";
import type { UserProfile } from "@/types/chat";

const tabs = ["Antrenman Programı", "Beslenme Planı", "Supplement Rehberi"] as const;
const fields: readonly { key: keyof UserProfile; label: string; placeholder: string }[] = [
  { key: "goal", label: "Hedef", placeholder: "Örn. Kas kazanımı" },
  { key: "experience", label: "Deneyim", placeholder: "Başlangıç / Orta / İleri" },
  { key: "gender", label: "Cinsiyet", placeholder: "İsteğe bağlı" },
  { key: "age", label: "Yaş", placeholder: "Örn. 30" },
  { key: "height", label: "Boy", placeholder: "Örn. 175 cm" },
  { key: "weight", label: "Kilo", placeholder: "Örn. 70 kg" },
  { key: "trainingDays", label: "Antrenman günü", placeholder: "Örn. Haftada 3 gün" },
  { key: "equipment", label: "Ekipman", placeholder: "Örn. Tam salon" },
  { key: "injuries", label: "Sakatlık / sınırlama", placeholder: "Varsa belirt" },
  { key: "timeAvailable", label: "Mevcut süre", placeholder: "Örn. 45 dakika" },
];

export default function ProgramGenerator({ onProfileChange }: { onProfileChange: (profile: UserProfile) => void }) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>(tabs[0]);
  const [profile, setProfile] = useState<UserProfile>({});
  const [notice, setNotice] = useState<string | null>(null);

  function updateProfile(key: keyof UserProfile, value: string) {
    const next = { ...profile, [key]: value };
    setProfile(next);
    onProfileChange(next);
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-[#0B0B0B] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><div className="flex items-center gap-2"><Sparkles className="size-4 text-[#C9A14A]" /><h2 className="text-lg font-semibold text-white">Program Oluşturucu</h2></div><p className="mt-1 text-sm text-neutral-500">API bağlanmaya hazır planlama arayüzü.</p></div><Badge variant="neutral">Yakında</Badge></div>
      <div className="mt-5 flex gap-2 overflow-x-auto border-b border-white/10 pb-3">{tabs.map((tab) => <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition ${activeTab === tab ? "bg-[#C9A14A]/10 text-[#C9A14A]" : "text-neutral-500 hover:text-white"}`}>{tab}</button>)}</div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">{fields.map((field) => <label key={field.key} className="text-xs font-medium text-neutral-400">{field.label}<input value={profile[field.key] ?? ""} onChange={(event) => updateProfile(field.key, event.target.value)} placeholder={field.placeholder} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-[#C9A14A]/60" /></label>)}</div>
      <button type="button" onClick={() => setNotice(`${activeTab} için profil bilgilerin kaydedildi. API entegrasyonu eklendiğinde burada taslak oluşturulacak.`)} className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-[#C9A14A]/30 bg-[#C9A14A]/10 px-4 py-3 text-sm font-semibold text-[#C9A14A] transition hover:bg-[#C9A14A]/15">Taslağı hazırla</button>
      {notice && <p role="status" className="mt-3 text-xs leading-5 text-neutral-500">{notice}</p>}
    </section>
  );
}
