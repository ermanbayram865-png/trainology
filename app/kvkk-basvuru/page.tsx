import type { Metadata } from "next";

import LegalPage, { LegalList, LegalSection, legalLinkClass } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "KVKK Başvurusu",
  description: "Erman Bayram’a, Trainology kapsamında KVKK başvurusu iletmek için yöntem ve başvuru metni rehberi.",
  alternates: { canonical: "/kvkk-basvuru" },
};

const templateFields = [
  "Ad ve soyad",
  "Başvuru sahibinin iletişim bilgisi",
  "Veri sorumlusuyla ilişkiniz veya önceki temas bilgisi",
  "Talebinizin açık açıklaması",
  "Talebe ilişkin gerekli destekleyici bilgiler",
  "Tercih ettiğiniz cevap yöntemi",
  "Tarih",
] as const;

export default function KvkkBasvuruPage() {
  return (
    <LegalPage title="KVKK Başvurusu" description="KVKK kapsamındaki haklarınızı kullanmak için başvuru yöntemleri ve metin şablonu.">
      <LegalSection title="1. Başvurunun muhatabı">
        <p>Veri sorumlusu <strong className="text-white">Erman Bayram</strong>, marka adı <strong className="text-white">Trainology</strong>’dir.</p>
        <p>KVKK başvuruları için: <a className={legalLinkClass} href="mailto:kvkk@trainology.com.tr">kvkk@trainology.com.tr</a></p>
        <p>Bu adres yalnızca kişisel veri ve KVKK başvuruları içindir. Genel iletişim için <a className={legalLinkClass} href="mailto:info@trainology.com.tr">info@trainology.com.tr</a> kullanılmalıdır.</p>
      </LegalSection>

      <LegalSection title="2. Başvuru yöntemleri">
        <p>Normal e-postayla yapılan resmî başvurularda, mümkünse daha önce Trainology’ye bildirdiğiniz ve ilgili yazışmalarda kayıtlı bulunan e-posta adresini kullanın. Güvenli elektronik imza veya mobil imzayla imzalanmış başvurular da ilgili mevzuattaki yöntemlere uygun biçimde iletilebilir.</p>
        <p>Trainology’nin şu anda yayımlanmış bir KEP adresi bulunmamaktadır. Bu sayfada fiziksel ev adresi yayımlanmaz.</p>
      </LegalSection>

      <LegalSection title="3. Kimlik doğrulama ve veri minimizasyonu">
        <p>Başvurunun niteliğine göre başvuru sahibinin kimliğini ve talep konusu verilerle ilişkisini doğrulamak için gerekli sınırlı ek bilgiler istenebilir. Gereksiz T.C. kimlik belgesi fotokopisi, sağlık belgesi veya talep için gerekli olmayan özel nitelikli veri göndermeyin.</p>
      </LegalSection>

      <LegalSection title="4. Başvuru metni şablonu">
        <p>E-postanızda aşağıdaki alanlara yer verebilirsiniz:</p>
        <div className="rounded-2xl border border-[#C9A14A]/20 bg-[#C9A14A]/5 p-5 sm:p-6">
          <LegalList>{templateFields.map((field) => <li key={field}>{field}</li>)}</LegalList>
        </div>
        <p>Bu sayfa yalnızca rehber ve metin şablonudur; tarayıcıda veya sunucuda başvuru verisi saklayan bir form değildir.</p>
      </LegalSection>

      <LegalSection title="5. Cevap süresi">
        <p>Başvurular talebin niteliğine göre mümkün olan en kısa sürede ve kural olarak en geç 30 gün içinde cevaplandırılır. İşlemin ayrıca maliyet gerektirmesi hâlinde, Kişisel Verileri Koruma Kurulu tarafından belirlenen tarifedeki ücret uygulanabilir.</p>
      </LegalSection>
    </LegalPage>
  );
}
