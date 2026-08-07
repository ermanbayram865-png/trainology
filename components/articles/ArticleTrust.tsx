import Card from "@/components/ui/Card";

type ArticleTrustProps = {
  evidenceLevel: string;
  reviewedBy: string;
};

export default function ArticleTrust({ evidenceLevel, reviewedBy }: ArticleTrustProps) {
  return (
    <Card
      title="Yayın standardı"
      description="Bu içerik eğitim amaçlıdır; kanıt seviyesi, kaynaklar ve bilimsel inceleme bilgisi açıkça gösterilir."
      variant="gold"
      className="max-w-4xl"
    >
      <p className="text-sm leading-7 text-neutral-400">
        Kanıt seviyesi: <span className="text-neutral-200">{evidenceLevel}</span>
        <br />
        Bilimsel inceleme: <span className="text-neutral-200">{reviewedBy}</span>
      </p>
    </Card>
  );
}
