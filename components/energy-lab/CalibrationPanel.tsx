"use client";

import { CalendarDays, Database, LineChart, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  clearCalibrationEntries,
  readCalibrationEntries,
  removeCalibrationEntry,
  summarizeCalibration,
  upsertCalibrationEntry,
  writeCalibrationEntries,
  type BiologicalSex,
  type CalibrationEntry,
} from "@/lib/energy-lab";

type CalibrationPanelProps = {
  sex: BiologicalSex | "";
};

const qualityLabels = {
  missing: "Eksik",
  partial: "Kısmi",
  sufficient: "Yeterli",
} as const;

export default function CalibrationPanel({ sex }: CalibrationPanelProps) {
  const [entries, setEntries] = useState<CalibrationEntry[]>([]);
  const [date, setDate] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [cycleNote, setCycleNote] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [storageMessage, setStorageMessage] = useState("");
  const [isStorageReady, setIsStorageReady] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    queueMicrotask(() => {
      if (isCancelled) return;
      setEntries(readCalibrationEntries(window.localStorage));
      setDate(toLocalIsoDate(new Date()));
      setIsStorageReady(true);
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  const summary = useMemo(() => summarizeCalibration(entries), [entries]);
  const existingEntry = entries.find((entry) => entry.date === date);

  function handleDateChange(nextDate: string) {
    setDate(nextDate);
    setError("");
    const savedEntry = entries.find((entry) => entry.date === nextDate);
    setWeightKg(savedEntry ? String(savedEntry.weightKg) : "");
    setCycleNote(savedEntry?.cycleNote ?? "");
    setNote(savedEntry?.note ?? "");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const numericWeight = Number(weightKg);

    if (!date) {
      setError("Kayıt tarihi seçilmelidir.");
      return;
    }

    if (!Number.isFinite(numericWeight) || numericWeight < 25 || numericWeight > 400) {
      setError("Günlük kilo 25 ile 400 kg arasında olmalıdır.");
      return;
    }

    const nextEntries = upsertCalibrationEntry(entries, {
      date,
      weightKg: numericWeight,
      ...(cycleNote.trim() ? { cycleNote: cycleNote.trim() } : {}),
      ...(note.trim() ? { note: note.trim() } : {}),
    });

    try {
      setEntries(writeCalibrationEntries(window.localStorage, nextEntries));
      setError("");
      setStorageMessage(existingEntry ? "Aynı tarihteki kayıt güncellendi." : "Kayıt bu cihazda saklandı.");
      window.setTimeout(() => setStorageMessage(""), 2200);
    } catch {
      setError("Kayıt bu cihazda saklanamadı. Tarayıcı depolama ayarlarını kontrol edin.");
    }
  }

  function handleDelete(entryDate: string) {
    const nextEntries = removeCalibrationEntry(entries, entryDate);
    try {
      setEntries(writeCalibrationEntries(window.localStorage, nextEntries));
      if (date === entryDate) handleDateChange("");
    } catch {
      setError("Kayıt silinemedi. Lütfen tekrar deneyin.");
    }
  }

  function handleClearAll() {
    const confirmed = window.confirm(
      "Bu cihazdaki tüm Energy Lab ağırlık trendi kayıtları kalıcı olarak silinsin mi?",
    );
    if (!confirmed) return;

    try {
      clearCalibrationEntries(window.localStorage);
      setEntries([]);
      setWeightKg("");
      setCycleNote("");
      setNote("");
      setStorageMessage("Tüm kayıtlar bu cihazdan silindi.");
    } catch {
      setError("Kayıtlar temizlenemedi. Lütfen tekrar deneyin.");
    }
  }

  return (
    <section
      id="kalibrasyon"
      aria-labelledby="calibration-title"
      className="border-y border-[#11283a]/10 bg-[#071523] px-6 py-20 text-white sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#d0af69]">
              Ağırlık Trendi Kalibrasyonu
            </p>
            <h2 id="calibration-title" className="mt-5 text-4xl font-semibold sm:text-5xl">
              Tahminini doğrula.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Başlangıç tahminini tek bir tartı ölçümüyle değil, zaman içindeki ağırlık trendiyle
              birlikte değerlendir. Kayıtlar belirli bir enerji alımına veya tahmin başlangıcına
              bağlanmadığı için bu modül tahmini tek başına doğrulamaz, gerçek bakım kalorini
              ölçmez ve otomatik kalori değişikliği uygulamaz.
            </p>
          </div>

          <div className="rounded-2xl border border-[#d0af69]/25 bg-white/[.04] p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <Database aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#d0af69]" />
              <div>
                <p className="font-semibold text-white">Veriler bu cihazda saklanır.</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Tarih, kilo ve isteğe bağlı notlar sunucuya veya analiz servisine gönderilmez.
                  Kayıtları tek tek ya da topluca silebilirsin.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-7 xl:grid-cols-[minmax(0,.78fr)_minmax(0,1.22fr)]">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-[1.75rem] border border-white/10 bg-[#0b1d2b] p-6 shadow-[0_24px_70px_rgba(0,0,0,.22)] sm:p-8"
          >
            <div className="flex items-center gap-3">
              <CalendarDays aria-hidden="true" className="size-5 text-[#d0af69]" />
              <h3 className="text-xl font-semibold">Günlük kayıt</h3>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-semibold text-slate-200">
                Tarih
                <input
                  type="date"
                  value={date}
                  max={toLocalIsoDate(new Date())}
                  onChange={(event) => handleDateChange(event.target.value)}
                  className="mt-2 min-h-12 w-full rounded-xl border border-white/15 bg-[#071523] px-4 text-white outline-none transition focus:border-[#d0af69] focus:ring-2 focus:ring-[#d0af69]/25"
                />
              </label>
              <label className="text-sm font-semibold text-slate-200">
                Günlük vücut ağırlığı
                <span className="ml-2 font-normal text-slate-500">kg</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min="25"
                  max="400"
                  step="0.1"
                  value={weightKg}
                  onChange={(event) => {
                    setWeightKg(event.target.value);
                    setError("");
                  }}
                  aria-invalid={Boolean(error)}
                  className="mt-2 min-h-12 w-full rounded-xl border border-white/15 bg-[#071523] px-4 text-white outline-none transition focus:border-[#d0af69] focus:ring-2 focus:ring-[#d0af69]/25"
                  placeholder="Örn. 72,4"
                />
              </label>
            </div>

            {sex === "female" && (
              <label className="mt-5 block text-sm font-semibold text-slate-200">
                Döngü notu <span className="font-normal text-slate-500">(isteğe bağlı)</span>
                <input
                  type="text"
                  maxLength={120}
                  value={cycleNote}
                  onChange={(event) => setCycleNote(event.target.value)}
                  className="mt-2 min-h-12 w-full rounded-xl border border-white/15 bg-[#071523] px-4 text-white outline-none transition focus:border-[#d0af69] focus:ring-2 focus:ring-[#d0af69]/25"
                  placeholder="Örn. döngünün ilk günü"
                />
              </label>
            )}

            <label className="mt-5 block text-sm font-semibold text-slate-200">
              Kısa kişisel not <span className="font-normal text-slate-500">(isteğe bağlı)</span>
              <textarea
                maxLength={280}
                rows={3}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                className="mt-2 w-full resize-y rounded-xl border border-white/15 bg-[#071523] px-4 py-3 text-white outline-none transition focus:border-[#d0af69] focus:ring-2 focus:ring-[#d0af69]/25"
                placeholder="Örn. seyahat, yüksek tuzlu öğün veya farklı tartım saati"
              />
            </label>

            {existingEntry && (
              <p className="mt-4 text-sm leading-6 text-[#ead5a8]">
                Bu tarihte bir kayıt var. Kaydettiğinde yeni satır oluşturmak yerine mevcut kayıt
                güncellenecek.
              </p>
            )}
            {error && (
              <p role="alert" className="mt-4 text-sm leading-6 text-rose-200">
                {error}
              </p>
            )}
            <p aria-live="polite" className="mt-4 min-h-5 text-sm text-[#d0af69]">
              {storageMessage}
            </p>

            <button
              type="submit"
              disabled={!isStorageReady}
              className="mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-[#d0af69] bg-[#d0af69] px-6 py-3 text-sm font-bold text-[#071523] transition hover:bg-[#dfc17e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {existingEntry ? "Kaydı güncelle" : "Günü kaydet"}
            </button>
          </form>

          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <Metric
                label="Tamamlanan günlük kayıt"
                value={`${summary.completedDays}/28`}
                detail={`${summary.observationDays} takvim günlük son pencere`}
              />
              <Metric
                label="İlk 7 gün ortalaması"
                value={formatAverage(summary.firstSevenAverage)}
                detail={`${summary.firstSevenCount}/7 geçerli gün`}
              />
              <Metric
                label="Son 7 gün ortalaması"
                value={formatAverage(summary.lastSevenAverage)}
                detail={`${summary.lastSevenCount}/7 geçerli gün`}
              />
            </div>

            <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0b1d2b] p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <LineChart aria-hidden="true" className="size-5 text-[#d0af69]" />
                    <h3 className="text-xl font-semibold">Trend görünümü</h3>
                  </div>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                    {summary.stageMessage}
                  </p>
                </div>
                <span className="inline-flex w-fit rounded-full border border-[#d0af69]/25 bg-[#d0af69]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#ead5a8]">
                  Veri kalitesi · {qualityLabels[summary.dataQuality]}
                </span>
              </div>

              <div className="mt-7 h-2 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
                <div
                  className="h-full rounded-full bg-[#d0af69] transition-[width] duration-500 motion-reduce:transition-none"
                  style={{ width: `${summary.progress * 100}%` }}
                />
              </div>

              <div className="mt-8">
                <TrendChart entries={summary.entries} directionMessage={summary.directionMessage} />
              </div>

              <div className="mt-7 rounded-2xl border border-white/10 bg-black/15 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d0af69]">
                  Yönsel sonuç
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-200">{summary.directionMessage}</p>
              </div>

              {summary.rapidLossCaution && (
                <div className="mt-4 rounded-2xl border border-[#d0af69]/35 bg-[#d0af69]/10 p-5 text-sm leading-7 text-[#f0dfba]">
                  Son 28 takvim günü eksiksiz kaydedildi ve ilk yedi gün ortalamasına göre son
                  yedi gün ortalamasında %4’ten fazla düşüş görünüyor. Bu kanıtlanmış bir
                  tıbbi sınır veya tanı değil; ürün içi temkinli bir yeniden değerlendirme
                  noktasıdır. Gerekirse profesyonel destek alın.
                </div>
              )}

              <p className="mt-5 text-xs leading-6 text-slate-500">
                14/28 gün aşamaları ile ilk ve son yedi gün karşılaştırması, Energy Lab’in
                şeffaf ürün sezgisidir; klinik eşik, istatistiksel güven aralığı veya ölçülmüş
                TDEE değildir.
              </p>
            </div>

            {entries.length > 0 && (
              <div className="rounded-[1.75rem] border border-white/10 bg-[#0b1d2b] p-6 sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Son kayıtlar</h3>
                    <p className="mt-1 text-sm text-slate-400">En yeni 8 kayıt gösteriliyor.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 px-4 text-sm font-semibold text-slate-300 transition hover:border-rose-300/50 hover:text-rose-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d0af69]"
                  >
                    <Trash2 aria-hidden="true" className="size-4" />
                    Tüm veriyi temizle
                  </button>
                </div>

                <ul className="mt-6 divide-y divide-white/10">
                  {[...entries]
                    .reverse()
                    .slice(0, 8)
                    .map((entry) => (
                      <li key={entry.date} className="flex items-start justify-between gap-4 py-4">
                        <div>
                          <p className="font-semibold text-white">
                            {formatDate(entry.date)} · {formatWeight(entry.weightKg)} kg
                          </p>
                          {(entry.cycleNote || entry.note) && (
                            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">
                              {[entry.cycleNote, entry.note].filter(Boolean).join(" · ")}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDelete(entry.date)}
                          aria-label={`${formatDate(entry.date)} kaydını sil`}
                          className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:border-rose-300/40 hover:text-rose-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d0af69]"
                        >
                          <Trash2 aria-hidden="true" className="size-4" />
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b1d2b] p-5">
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </div>
  );
}

function TrendChart({
  entries,
  directionMessage,
}: {
  entries: readonly CalibrationEntry[];
  directionMessage: string;
}) {
  if (entries.length < 2) {
    return (
      <div className="flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-white/15 bg-black/10 px-6 text-center text-sm leading-6 text-slate-500">
        Trend çizgisi için en az iki farklı güne ait kayıt ekleyin.
      </div>
    );
  }

  const visibleEntries = entries.slice(-60);
  const weights = visibleEntries.map((entry) => entry.weightKg);
  const minimum = Math.min(...weights);
  const maximum = Math.max(...weights);
  const spread = maximum - minimum || 1;
  const width = 640;
  const height = 210;
  const padding = 22;
  const points = visibleEntries.map((entry, index) => {
    const x =
      padding +
      (index / Math.max(visibleEntries.length - 1, 1)) * (width - padding * 2);
    const y = padding + ((maximum - entry.weightKg) / spread) * (height - padding * 2);
    return `${x},${y}`;
  });

  return (
    <figure>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Ağırlık trendi grafiği. ${directionMessage}`}
        className="h-auto w-full overflow-visible rounded-2xl border border-white/10 bg-[#071523]"
      >
        {[0.25, 0.5, 0.75].map((position) => (
          <line
            key={position}
            x1={padding}
            x2={width - padding}
            y1={height * position}
            y2={height * position}
            stroke="rgba(255,255,255,.08)"
            strokeWidth="1"
          />
        ))}
        <polyline
          points={points.join(" ")}
          fill="none"
          stroke="#d0af69"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((point, index) => {
          const [cx, cy] = point.split(",");
          return <circle key={visibleEntries[index].date} cx={cx} cy={cy} r="4" fill="#f5e7c6" />;
        })}
      </svg>
      <figcaption className="mt-3 flex justify-between gap-4 text-xs text-slate-500">
        <span>{formatDate(visibleEntries[0].date)}</span>
        <span>{formatDate(visibleEntries.at(-1)?.date ?? "")}</span>
      </figcaption>
    </figure>
  );
}

function formatAverage(value: number | null): string {
  return value === null ? "—" : `${formatWeight(value)} kg`;
}

function formatWeight(value: number): string {
  return value.toLocaleString("tr-TR", { maximumFractionDigits: 2 });
}

function formatDate(value: string): string {
  if (!value) return "";
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function toLocalIsoDate(date: Date): string {
  const localTime = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localTime.toISOString().slice(0, 10);
}
