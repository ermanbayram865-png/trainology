import Card from "@/components/ui/Card";

type ArticleMetadataProps = {
  evidenceLevel: string;
  publishedDate: string;
  updatedDate: string;
  readingTime: string;
  author: string;
  reviewedBy: string;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export default function ArticleMetadata({
  evidenceLevel,
  publishedDate,
  updatedDate,
  readingTime,
  author,
  reviewedBy,
}: ArticleMetadataProps) {
  const entries = [
    { label: "Kanıt seviyesi", value: evidenceLevel },
    { label: "Yayın tarihi", value: formatDate(publishedDate) },
    { label: "Güncelleme", value: formatDate(updatedDate) },
    { label: "Okuma süresi", value: readingTime },
    { label: "Yazar", value: author },
    { label: "Bilimsel inceleme", value: reviewedBy },
  ];

  return (
    <Card variant="subtle" className="max-w-4xl p-6">
      <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry) => (
          <div key={entry.label}>
            <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
              {entry.label}
            </dt>
            <dd className="mt-2 text-sm leading-6 text-neutral-300">{entry.value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
