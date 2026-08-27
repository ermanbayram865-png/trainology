"use client";

import { ChevronDown } from "lucide-react";

import {
  FFMI_REFERENCE_BAND_LABELS,
  FFMI_REFERENCE_METADATA,
  interpretWithFFMISourceReference,
  type BodyFatMeasurementMethod,
  type FFMIReferenceBand,
  type FFMIReferenceComparison,
  type FFMIReferenceSex,
} from "@/lib/calculators";

const REFERENCE_CONTEXT_LABELS: Readonly<Record<FFMIReferenceSex, string>> = {
  men: "Erkek referansı",
  women: "Kadın referansı",
};

const BROAD_REFERENCE_BAND_COPY: Readonly<
  Record<FFMIReferenceBand, Readonly<{ label: string; position: string }>>
> = {
  below_p5: {
    label: "Referans grubunun en alt bölümünde",
    position: "en alt bölümünde",
  },
  p5_p10: {
    label: "Referans grubunun en alt bölümünde",
    position: "en alt bölümünde",
  },
  p10_p25: {
    label: "Referans grubunun alt bölümünde",
    position: "alt bölümünde",
  },
  p25_p50: {
    label: "Referans grubunun orta %50’sinde",
    position: "orta bölümünde",
  },
  p50_p75: {
    label: "Referans grubunun orta %50’sinde",
    position: "orta bölümünde",
  },
  p75_p90: {
    label: "Referans grubunun üst bölümünde",
    position: "üst bölümünde",
  },
  p90_p95: {
    label: "Referans grubunun üst bölümünde",
    position: "üst bölümünde",
  },
  p95_or_above: {
    label: "Referans grubunun en üst bölümünde",
    position: "en üst bölümünde",
  },
};

function technicalBandLabel(band: FFMIReferenceBand) {
  return FFMI_REFERENCE_BAND_LABELS[band].replace(" aralığında", "");
}

export default function FFMIReferenceComparator({
  ffmi,
  fmi,
  ageYears,
  referenceSex,
  measurementMethod,
}: {
  ffmi: number;
  fmi: number;
  ageYears: number;
  referenceSex: FFMIReferenceSex | "";
  measurementMethod: BodyFatMeasurementMethod;
}) {
  const interpretation = interpretWithFFMISourceReference({
    ageYears,
    sex: referenceSex,
    measurementMethod,
    ffmi,
    fmi,
  });
  const comparison =
    interpretation.type === "SUCCESS" ? interpretation.comparison : null;

  return (
    <section
      className="rounded-xl border border-[#9f7b38]/25 bg-[#efe5d0]/25"
      aria-live="polite"
    >
      <div className="px-4 py-3 [@media(min-width:1024px)_and_(max-height:850px)]:px-3.5 [@media(min-width:1024px)_and_(max-height:850px)]:py-2">
        <p className="text-sm font-bold text-[#102536]">Bu sayı ne anlama geliyor?</p>
        <p className="mt-1 text-xs leading-5 text-[#5c6c78] [@media(min-width:1024px)_and_(max-height:850px)]:leading-4">
          FFMI yükseldikçe boya göre yağsız kütle artar. Ancak daha yüksek FFMI tek
          başına daha sağlıklı veya daha iyi anlamına gelmez.
        </p>

        {interpretation.type === "SUCCESS" ? (
          <div className="mt-2.5 border-t border-[#9f7b38]/20 pt-2.5 [@media(min-width:1024px)_and_(max-height:850px)]:mt-2 [@media(min-width:1024px)_and_(max-height:850px)]:pt-2">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#71808b]">
                {interpretation.confidence === "matched"
                  ? "Referans grubundaki konumun"
                  : "Yaklaşık referans konumun"}
              </p>
              <p className="text-xs font-semibold text-[#6a5429]">
                {interpretation.comparison.ageMin}–{interpretation.comparison.ageMax} yaş ·{" "}
                {REFERENCE_CONTEXT_LABELS[interpretation.comparison.sex]}
              </p>
            </div>
            <div className="mt-2 grid gap-2 sm:grid-cols-2 [@media(min-width:1024px)_and_(max-height:850px)]:mt-1.5">
              <ReferenceBandItem
                label="FFMI"
                band={interpretation.comparison.ffmi.band}
                descriptionPrefix="Boyuna göre yağsız kütlen"
              />
              <ReferenceBandItem
                label="Yağ İndeksi (FMI)"
                band={interpretation.comparison.fmi.band}
                descriptionPrefix="Yağ indeksin"
              />
            </div>
            <p className="mt-2 text-xs font-semibold text-[#6a5429] [@media(min-width:1024px)_and_(max-height:850px)]:mt-1.5">
              Kore yetişkin referansı · KNHANES 2022–2023
            </p>
            <p className="mt-1 text-xs leading-5 text-[#5c6c78] [@media(min-width:1024px)_and_(max-height:850px)]:leading-4">
              Bu, sağlık veya “iyi/kötü” fizik değerlendirmesi değildir.
            </p>
          </div>
        ) : (
          <UnavailableInterpretation
            reason={interpretation.reason}
            measurementMethod={measurementMethod}
          />
        )}
      </div>

      <ReferenceMethodologyDisclosure comparison={comparison} />
    </section>
  );
}

function UnavailableInterpretation({
  reason,
  measurementMethod,
}: {
  reason: "unsupported_measurement_method" | "unsupported_age" | "invalid_reference_category" | "invalid_numeric_input";
  measurementMethod: BodyFatMeasurementMethod;
}) {
  if (reason === "unsupported_age") {
    return (
      <p className="mt-2.5 border-t border-[#9f7b38]/20 pt-2.5 text-xs leading-5 text-[#5c6c78]">
        Bu yaş için kaynakta yayımlanmış uygun bir yetişkin referans grubu bulunmadığından
        sayısal konum göstermiyoruz.
      </p>
    );
  }

  if (reason === "invalid_reference_category" || reason === "invalid_numeric_input") {
    return (
      <p className="mt-2.5 border-t border-[#9f7b38]/20 pt-2.5 text-xs leading-5 text-[#5c6c78]">
        Kaynak karşılaştırması için yaş ve referans kategorisi gerekir.
      </p>
    );
  }

  const isVisualEstimate = measurementMethod === "visual_estimate";
  return (
    <p className="mt-2.5 border-t border-[#9f7b38]/20 pt-2.5 text-xs leading-5 text-[#5c6c78]">
      {isVisualEstimate
        ? "Yağ oranını görsel olarak tahmin ettiğin için referans grubundaki konumunu güvenilir biçimde göstermiyoruz."
        : "Referans karşılaştırması için daha güvenilir bir yağ oranı ölçümü gerekir."}
    </p>
  );
}

function ReferenceBandItem({
  label,
  band,
  descriptionPrefix,
}: {
  label: string;
  band: FFMIReferenceBand;
  descriptionPrefix: string;
}) {
  const copy = BROAD_REFERENCE_BAND_COPY[band];
  return (
    <div className="rounded-xl border border-[#11283a]/10 bg-white px-3.5 py-2.5 [@media(min-width:1024px)_and_(max-height:850px)]:px-3 [@media(min-width:1024px)_and_(max-height:850px)]:py-2">
      <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#71808b]">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-[#102536]">{copy.label}</p>
      <p className="mt-1 text-xs leading-5 text-[#5c6c78] [@media(min-width:1024px)_and_(max-height:850px)]:leading-4">
        {descriptionPrefix}, bu araştırmadaki benzer yetişkinlerin dağılımında {copy.position} yer alıyor.
      </p>
    </div>
  );
}

function ReferenceMethodologyDisclosure({
  comparison,
}: {
  comparison: FFMIReferenceComparison | null;
}) {
  return (
    <details className="border-t border-[#9f7b38]/20 px-4 py-0.5">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 text-xs font-bold text-[#6a5429] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38] [&::-webkit-details-marker]:hidden">
        Bilimsel kaynak ve yöntem
        <ChevronDown aria-hidden="true" className="size-4 shrink-0" />
      </summary>
      <div className="border-t border-[#9f7b38]/15 pt-2 text-xs leading-5 text-[#5c6c78]">
        <p>{FFMI_REFERENCE_METADATA.displayLabel}</p>
        {comparison && (
          <p className="mt-1">
            Yaş grubu: {comparison.ageMin}–{comparison.ageMax} · Referans kategorisi:{" "}
            {REFERENCE_CONTEXT_LABELS[comparison.sex]} · FFMI teknik aralığı:{" "}
            {technicalBandLabel(comparison.ffmi.band)} · FMI teknik aralığı:{" "}
            {technicalBandLabel(comparison.fmi.band)}
          </p>
        )}
        <p className="mt-1">
          P değerleri, sonucun araştırmadaki referans grubunda yaklaşık nerede bulunduğunu gösterir.
          Kesim noktaları kaynağın yayımladığı P5, P10, P25, P50, P75, P90 ve P95
          değerleridir; arada percentile tahmini yapılmaz.
        </p>
        <p className="mt-1">
          Kaynak referansı InBody 970 doğrudan segmental çok frekanslı BIA ölçümlerine
          dayanır. DEXA ve deri kıvrımı sonuçlarında konum yaklaşık olarak sunulur;
          farklı yöntem ve ölçüm koşulları sonuçları etkileyebilir.
        </p>
        <p className="mt-1 text-[0.7rem] text-[#71808b]">
          Kaynak: {FFMI_REFERENCE_METADATA.publication} · DOI {FFMI_REFERENCE_METADATA.doi} ·
          PMID {FFMI_REFERENCE_METADATA.pmid} · Table 2
        </p>
      </div>
    </details>
  );
}
