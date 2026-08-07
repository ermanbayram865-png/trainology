import type { Supplement } from "@/lib/supplements/types";

const image = "/images/hero/flask.png";

export const supplements: readonly Supplement[] = [
  {
    id: "creatine-monohydrate",
    name: "Creatine Monohydrate",
    slug: "creatine-monohydrate",
    category: "Performance",
    evidenceLevel: "Strong Evidence",
    purpose: "Yüksek yoğunluklu egzersiz kapasitesini ve kuvvet antrenmanı adaptasyonlarını desteklemek.",
    description: "Kreatin monohidrat, kas hücrelerindeki fosfokreatin depolarını destekleyen ve en çok araştırılmış spor supplementlerinden biridir.",
    benefits: [
      "Bazı kişilerde yüksek yoğunluklu tekrar eden efor performansını destekleyebilir.",
      "Direnç antrenmanıyla birlikte yağsız kütle ve kuvvet kazanımlarına katkı sağlayabilir.",
      "Uygun dozlarda sağlıklı yetişkinlerde iyi çalışılmış bir güvenlik profiline sahiptir.",
    ],
    usage: "Genel yaklaşım olarak her gün 3–5 g kullanılır. Yükleme protokolü zorunlu değildir; bireysel tolerans ve uzman önerisi dikkate alınmalıdır.",
    considerations: [
      "Başlangıçta vücut ağırlığında su tutulumuna bağlı artış görülebilir.",
      "Böbrek hastalığı veya düzenli ilaç kullanımı olan kişiler sağlık uzmanına danışmalıdır.",
      "Ürün kalitesi ve içerik doğrulaması önemlidir.",
    ],
    sources: [
      "International Society of Sports Nutrition: creatine supplementation position stand.",
      "Kreider RB et al. Common questions and misconceptions about creatine supplementation.",
    ],
    image,
  },
  {
    id: "caffeine",
    name: "Caffeine",
    slug: "caffeine",
    category: "Performance",
    evidenceLevel: "Strong Evidence",
    purpose: "Uyanıklığı ve uygun koşullarda egzersiz performansını desteklemek.",
    description: "Kafein, merkezi sinir sistemi üzerinde etkili olan ve farklı egzersiz türlerinde performans çıktılarıyla ilişkilendirilmiş yaygın bir bileşendir.",
    benefits: [
      "Bazı dayanıklılık ve yüksek yoğunluklu egzersiz performanslarını destekleyebilir.",
      "Algılanan eforu bazı koşullarda azaltabilir.",
      "Dikkat ve uyanıklığı geçici olarak artırabilir.",
    ],
    usage: "Araştırmalarda sıklıkla egzersizden yaklaşık 30–60 dakika önce 1–3 mg/kg ile başlanıp bireysel toleransa göre değerlendirilir.",
    considerations: [
      "Uyku kalitesini etkileyebilir; kullanım saati önemlidir.",
      "Kaygı, çarpıntı veya mide rahatsızlığı gibi yan etkiler görülebilir.",
      "Hamilelik, kalp ritim sorunları ve ilaç kullanımı durumunda uzman görüşü alınmalıdır.",
    ],
    sources: [
      "International Society of Sports Nutrition: caffeine and exercise performance position stand.",
      "Guest NS et al. International society of sports nutrition position stand: caffeine and exercise performance.",
    ],
    image,
  },
  {
    id: "omega-3",
    name: "Omega-3",
    slug: "omega-3",
    category: "Health",
    evidenceLevel: "Moderate Evidence",
    purpose: "Beslenme yoluyla yeterli alınmadığında omega-3 yağ asidi alımını desteklemek.",
    description: "EPA ve DHA içeren omega-3 yağ asitleri, özellikle balık tüketimi düşük kişilerde genel beslenme kalitesini desteklemek için değerlendirilebilir.",
    benefits: [
      "Bazı bireylerde kan trigliserit düzeylerinin yönetimine katkı sağlayabilir.",
      "Genel kardiyometabolik sağlık bağlamında değerlendirilebilir.",
      "Egzersiz sonrası toparlanma belirteçleri üzerindeki etkiler kişiye ve bağlama göre değişebilir.",
    ],
    usage: "Kullanım miktarı ürünün EPA ve DHA içeriğine göre değerlendirilmelidir. Beslenme alışkanlıkları ve sağlık durumu dikkate alınarak uzman görüşü alınması uygundur.",
    considerations: [
      "Kan sulandırıcı kullanımı olan kişiler özellikle dikkatli olmalıdır.",
      "Ürünün oksidasyon durumu ve bağımsız kalite testleri önemlidir.",
      "Faydalar, temel beslenme düzeninin yerine geçmez.",
    ],
    sources: [
      "American Heart Association scientific advisories on omega-3 fatty acids.",
      "NIH Office of Dietary Supplements: Omega-3 Fatty Acids Fact Sheet.",
    ],
    image,
  },
] as const;

export function getSupplementBySlug(slug: string) {
  return supplements.find((supplement) => supplement.slug === slug);
}
