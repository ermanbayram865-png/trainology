export const SUPPLEMENT_DISCLAIMER = [
  "Takviye kullanımı kişisel ihtiyaçlar, hedefler ve mevcut sağlık durumu dikkate alınarak değerlendirilmelidir.",
  "Supplement bilgileri eğitim amaçlıdır ve kişisel sağlık önerisi yerine geçmez.",
] as const;

type SupplementDisclaimerProps = {
  className?: string;
};

export default function SupplementDisclaimer({
  className,
}: SupplementDisclaimerProps) {
  return (
    <div className={`space-y-2 text-sm leading-6 text-neutral-500 ${className ?? ""}`}>
      {SUPPLEMENT_DISCLAIMER.map((message) => (
        <p key={message}>{message}</p>
      ))}
    </div>
  );
}
