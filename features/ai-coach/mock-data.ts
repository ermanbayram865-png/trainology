import type { Conversation } from "@/types/chat";

const now = new Date().toISOString();

export const initialConversations: Conversation[] = [
  {
    id: "welcome",
    title: "Trainology ile başla",
    updatedAt: now,
    pinned: true,
    messages: [
      {
        id: "welcome-message",
        role: "assistant",
        createdAt: now,
        content: "Merhaba, ben Trainology AI Coach. Hedeflerini bilimsel ama anlaşılır bir çerçevede birlikte değerlendirebiliriz.",
        answer: {
          summary: "Hedefini, deneyimini ve mevcut rutinini paylaşarak başlayabilirsin.",
          explanation: "Yanıtlarım eğitim amaçlıdır; belirsizlikleri açıklar ve uygulanabilir sonraki adımlara odaklanırım.",
          practicalAdvice: [
            "Hedefini seç: kas kazanımı, yağ kaybı, performans veya genel sağlık.",
            "Mevcut antrenman ve beslenme düzeninden kısaca bahset.",
          ],
          evidenceNote: "Gerektiğinde bilimsel kaynak kartlarıyla kanıt bağlamı eklerim.",
        },
      },
    ],
  },
  {
    id: "protein-chat",
    title: "Protein hedefi",
    updatedAt: new Date(Date.now() - 86_400_000).toISOString(),
    messages: [],
  },
  {
    id: "training-chat",
    title: "Haftalık antrenman düzeni",
    updatedAt: new Date(Date.now() - 3 * 86_400_000).toISOString(),
    messages: [],
  },
];
