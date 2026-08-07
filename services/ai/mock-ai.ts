import { evidenceLibrary } from "@/lib/evidence";
import { buildCoachPrompt } from "@/lib/prompts";
import type { CoachAnswer, PromptRequest } from "@/types/chat";

function createAnswer(input: string, request: PromptRequest): CoachAnswer {
  const normalizedInput = input.toLocaleLowerCase("tr-TR");
  const isCreatine = normalizedInput.includes("kreatin");
  const isProtein = normalizedInput.includes("protein");
  const isWorkout = normalizedInput.includes("antrenman") || normalizedInput.includes("workout");

  if (isCreatine) {
    return {
      summary: "Kreatin monohidrat, kuvvet ve yüksek yoğunluklu egzersiz performansı için en çok incelenen takviyelerden biridir.",
      explanation: request.educationMode
        ? "Kreatin, kas hücrelerindeki fosfokreatin sistemini destekler. Bu sistemi kısa süreli, yüksek şiddetli eforlarda yeniden şarj olan bir enerji tamponu gibi düşünebilirsin."
        : "Kreatin monohidrat, düzenli kullanımda bazı kişilerde kısa süreli yüksek şiddetli performansı destekleyebilir.",
      practicalAdvice: [
        "Genel kullanım yaklaşımı olarak günlük 3–5 g kreatin monohidrat değerlendirilebilir.",
        "Düzenlilik, yükleme protokolünden daha önemlidir; kişisel toleransı takip et.",
        "Mevcut sağlık durumu veya ilaç kullanımı varsa sağlık uzmanına danış.",
      ],
      evidenceNote: "Kanıt güçlü olsa da yanıt, antrenman düzeni, beslenme ve bireysel toleransa göre değişir.",
      sources: [evidenceLibrary[1]],
    };
  }

  if (isProtein) {
    return {
      summary: "Günlük protein ihtiyacı hedefe, toplam enerji alımına ve antrenman hacmine göre değişir.",
      explanation: request.educationMode
        ? "Protein, kas dokusunun onarımında kullanılan yapı taşlarını sağlar. Günlük toplam alım, tek bir öğünden daha belirleyici bir başlangıç noktasıdır."
        : "Aktif bireylerde günlük protein hedefi, hedefe ve antrenman yüküne göre planlanmalıdır.",
      practicalAdvice: [
        "Protein hedefini gün içine yayılabilen öğünlerle planla.",
        "Kas kazanımı veya yağ kaybında toplam enerji alımını birlikte değerlendir.",
        "Kişiselleştirilmiş başlangıç tahmini için Protein Hesaplayıcıyı kullan.",
      ],
      evidenceNote: "Bu bilgi genel bir çerçevedir; tıbbi beslenme önerisi yerine geçmez.",
      sources: [evidenceLibrary[0], evidenceLibrary[2]],
    };
  }

  return {
    summary: isWorkout
      ? "Etkili bir antrenman planı; hedef, deneyim, teknik yeterlilik ve toparlanma kapasitesini birlikte ele alır."
      : "Sorunu bilimsel çerçeve, uygulanabilir davranışlar ve kişisel bağlam üzerinden değerlendirmek en güvenli başlangıçtır.",
    explanation: request.educationMode
      ? "Fitness kararları tek bir kuraldan oluşmaz. Yük, hacim, beslenme, uyku ve günlük yaşam stresi birbirini etkileyen bir sistemdir; bu nedenle değişiklikleri küçük ve takip edilebilir tutmak faydalıdır."
      : "En iyi sonraki adım, mevcut hedefinle uyumlu küçük ve sürdürülebilir bir değişiklik seçmektir.",
    practicalAdvice: [
      "Bir sonraki 1–2 hafta için tek bir ölçülebilir davranış belirle.",
      "Performans, uyku ve toparlanma sinyallerini birlikte takip et.",
      "Belirsizlik varsa daha düşük riskli seçeneği tercih et ve sonucu gözlemle.",
    ],
    evidenceNote: "Bu yanıt eğitim amaçlıdır; kişisel sağlık durumun ve klinik ihtiyaçların farklı değerlendirme gerektirebilir.",
    sources: request.evidencePriority === "high" ? [evidenceLibrary[2]] : undefined,
  };
}

export async function getMockCoachAnswer(
  input: string,
  request: PromptRequest,
): Promise<CoachAnswer> {
  buildCoachPrompt(request);
  await new Promise((resolve) => setTimeout(resolve, 700));
  return createAnswer(input, request);
}
