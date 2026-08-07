import type { AICoachMode, PromptRequest } from "@/types/chat";

export const coachModes: readonly { value: AICoachMode; label: string }[] = [
  { value: "general", label: "Genel Fitness" },
  { value: "training", label: "Antrenman" },
  { value: "nutrition", label: "Beslenme" },
  { value: "supplements", label: "Supplementler" },
  { value: "recovery", label: "Toparlanma" },
  { value: "weight-loss", label: "Yağ Kaybı" },
  { value: "muscle-gain", label: "Kas Kazanımı" },
];

const modeInstructions: Record<AICoachMode, string> = {
  general: "Fitness sorusunu güvenli, kanıta dayalı ve uygulanabilir bir çerçevede ele al.",
  training: "Antrenman hacmi, yoğunluğu, teknik ve toparlanmayı birlikte değerlendir.",
  nutrition: "Beslenme önerilerini enerji dengesi, protein ve sürdürülebilirlik bağlamında açıkla.",
  supplements: "Takviyeleri kanıt düzeyi, kullanım bağlamı ve belirsizlikleriyle birlikte değerlendir.",
  recovery: "Uyku, yük yönetimi, stres ve toparlanma davranışlarına öncelik ver.",
  "weight-loss": "Enerji açığını sürdürülebilir davranışlar ve kas kütlesini koruma bağlamında ele al.",
  "muscle-gain": "Kas gelişimini yeterli enerji, protein, progresif yüklenme ve toparlanma bağlamında ele al.",
};

export function buildCoachPrompt(request: PromptRequest): string {
  const profile = Object.entries(request.userProfile ?? {})
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ");
  const memory = request.memory
    .slice(-6)
    .map((message) => `${message.role}: ${message.content}`)
    .join("\n");

  return [
    "Sen Trainology AI Coach'sun: bilimsel, arkadaş canlısı ve profesyonel ol.",
    "Abartı, bro-science ve kesin sağlık iddialarından kaçın; belirsizliği açıkça belirt.",
    "Yanıtı Özet, Açıklama, Pratik öneri ve Kanıt notu şeklinde yapılandır.",
    modeInstructions[request.mode],
    request.educationMode
      ? "Eğitim modu açık: terimleri tanımla, analoji ve kısa örnek kullan."
      : "Eğitim modu kapalı: kısa, uygulanabilir bir yanıt ver.",
    `Kanıt önceliği: ${request.evidencePriority}. Çıktı formatı: ${request.format}.`,
    request.context ? `Ek bağlam: ${request.context}` : "",
    profile ? `Kullanıcı profili: ${profile}` : "",
    memory ? `Konuşma hafızası:\n${memory}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}
