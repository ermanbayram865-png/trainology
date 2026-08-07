import CalculatorResultCard from "@/components/calculators/CalculatorResultCard";
import CalculatorSection from "@/components/calculators/CalculatorSection";
import Badge from "@/components/ui/Badge";
import type { CalculatorResult } from "@/lib/calculators";
import type { PerformanceAnalysis, PerformanceCategory } from "@/types/performance";

type PerformanceDashboardProps = { analysis: PerformanceAnalysis; hasBodyWeight: boolean };

const confidenceLabels = { low: "Düşük veri kapsamı", medium: "Orta veri kapsamı", high: "Yüksek veri kapsamı" } as const;

function categoryLabel(category: PerformanceCategory) {
  return category === "push" ? "İtiş" : category === "pull" ? "Çekiş" : "Alt vücut";
}

export default function PerformanceDashboard({ analysis, hasBodyWeight }: PerformanceDashboardProps) {
  const scoreResults: CalculatorResult[] = analysis.categories.map((category) => ({
    title: category.label,
    value: category.score ?? "—",
    unit: category.score === undefined ? "" : "/ 100",
    color: category.score === undefined ? "neutral" : "gold" as const,
    explanation: category.score === undefined ? "Yeterli veri yok" : hasBodyWeight
      ? `Göreli kuvvet ortalaması: ${category.averageRelativeStrength?.toFixed(2)}× vücut ağırlığı`
      : `Vücut ağırlığı girilmediği için tahmini 1RM ortalaması: ${category.averageEstimatedOneRepMax?.toFixed(1)} kg`,
  }));
  const opportunity = analysis.opportunityCategories.map(categoryLabel).join(", ");
  const stronger = analysis.strongerCategories.map(categoryLabel).join(", ");

  return (
    <div className="space-y-6">
      <CalculatorResultCard
        title="Performans Dashboard"
        description="Bu puan, yalnızca girdiğin hareketlerin kendi içindeki göreli dağılımını özetleyen Trainology iç değerlendirmesidir; klinik veya bilimsel olarak doğrulanmış bir performans skoru değildir."
        results={[
          { title: "Trainology Performance Score", value: analysis.overallScore ?? "—", unit: analysis.overallScore === undefined ? "" : "/ 100", color: "gold", explanation: analysis.overallScore === undefined ? "En az iki hareket için geçerli veri gir." : "Kullanıcının kendi hareket dağılımına göre hesaplandı." },
          { title: "Veri Güveni", value: confidenceLabels[analysis.confidence], color: analysis.confidence === "high" ? "success" : "neutral", explanation: `${analysis.activeExerciseCount}/6 hareket girdisi; bu yalnızca veri kapsamını ifade eder.` },
          { title: "Set Hacmi", value: analysis.totalVolume.toLocaleString("tr-TR"), unit: "kg", color: "neutral", explanation: "Ağırlık × tekrar × set" },
          ...(analysis.estimatedWeeklyVolume ? [{ title: "Tahmini Haftalık Hacim", value: analysis.estimatedWeeklyVolume.toLocaleString("tr-TR"), unit: "kg", color: "neutral" as const, explanation: "Seçilen haftalık antrenman günü ile tahmini çarpım." }] : []),
        ]}
      />
      <CalculatorResultCard title="Kuvvet Dağılımı" description="Kategori skorları dış benchmark’a değil, yalnızca senin aktif hareketlerin arasındaki göreli kuvvet dağılımına dayanır." results={scoreResults} />
      <CalculatorSection title="Hareket Bazlı Tahminler" description="Tahmini 1RM Epley formülüyle hesaplanır; RIR yalnızca set bağlamı için gösterilir.">
        <div className="space-y-4">
          {analysis.exercises.map((exercise) => (
            <div key={exercise.id} className="grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
              <div><p className="font-semibold text-white">{exercise.name}</p><p className="mt-1 text-sm text-neutral-400">{exercise.weight} kg × {exercise.repetitions} tekrar × {exercise.sets} set{exercise.rir !== undefined ? ` · RIR ${exercise.rir}` : ""}</p></div>
              <div className="sm:text-right"><p className="text-lg font-semibold text-[#D6B25E]">{exercise.estimatedOneRepMax.toFixed(1)} kg</p><p className="text-xs text-neutral-500">{exercise.relativeStrength ? `${exercise.relativeStrength.toFixed(2)}× vücut ağırlığı` : "Vücut ağırlığı girilmedi"}</p></div>
            </div>
          ))}
        </div>
      </CalculatorSection>
      <CalculatorSection title="Denge ve Gelişim Fırsatları" description="Bu yorum bir tıbbi değerlendirme veya kesin zayıf nokta tanısı değildir.">
        <div className="flex flex-wrap gap-3">
          {stronger && <Badge variant="success">Görece güçlü: {stronger}</Badge>}
          {opportunity && <Badge variant="warning">Gelişim fırsatı: {opportunity}</Badge>}
          {analysis.balancedCategories.length > 0 && <Badge variant="neutral">Dengeli görünen alanlar: {analysis.balancedCategories.map(categoryLabel).join(", ")}</Badge>}
          {analysis.categories.filter((category) => category.score === undefined).map((category) => <Badge key={category.category} variant="neutral">{category.label}: Yeterli veri yok</Badge>)}
        </div>
        <p className="mt-5 text-sm leading-6 text-neutral-400">{opportunity ? `${opportunity} kategorisinde daha az göreli veri görünüyor. Programında teknik kalitesini koruyarak bu hareket örüntülerine düzenli yer vermeyi değerlendirebilirsin.` : "Mevcut veri, kategoriler arasında belirgin bir göreli fark göstermiyor. Düzenli kayıt alarak zaman içindeki değişimi izlemen daha anlamlı olacaktır."}</p>
      </CalculatorSection>
    </div>
  );
}
