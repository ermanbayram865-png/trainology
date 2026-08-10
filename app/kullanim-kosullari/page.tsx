import type { Metadata } from "next";

import LegalPage, { LegalList, LegalSection, legalLinkClass } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Kullanım Koşulları",
  description: "Trainology fitness bilgi platformunun kullanımına ilişkin koşullar.",
  alternates: { canonical: "/kullanim-kosullari" },
};

export default function KullanimKosullariPage() {
  return (
    <LegalPage title="Kullanım Koşulları" description="Trainology içeriklerinin ve hesaplama araçlarının kullanımına ilişkin temel koşullar.">
      <p>Bu koşullar, kanundan doğan ve sözleşmeyle sınırlandırılamayan tüketici veya kullanıcı haklarını ortadan kaldırmaz.</p>

      <LegalSection title="1. Platformun amacı">
        <p>Trainology; egzersiz, antrenman bilimi, beslenme ve sağlıklı yaşam hakkında genel bilgilendirme araçları sunar. Mevcut sürümde üyelik, kişiye özel koçluk, tıbbi hizmet, ürün satışı, ödeme veya ücretli abonelik bulunmaz.</p>
      </LegalSection>

      <LegalSection title="2. Tıbbi hizmet sunulmaz">
        <p>Trainology içerikleri tıbbi teşhis, tedavi veya kişiye özel sağlık hizmeti değildir; doktor veya yetkili sağlık profesyonelinin muayene ve değerlendirmesinin yerine geçmez.</p>
        <p>Egzersiz ve beslenme kararlarında sağlık durumunuz, kullandığınız ilaçlar, gebelik, hastalık, yaralanma ve diğer bireysel koşullar dikkate alınmalıdır. Ağrı, yaralanma veya hastalık durumunda uygun profesyonel yardım alın; acil belirtilerde çevrim içi içeriğe dayanmak yerine acil sağlık hizmetine başvurun.</p>
      </LegalSection>

      <LegalSection title="3. Hesaplayıcılar ve bilimsel yaklaşım">
        <LegalList>
          <li>Hesaplayıcı sonuçları genel bilgilendirme amaçlı tahminlerdir ve kesin sonuç garantisi vermez.</li>
          <li>Sonuçlar kişisel koşullar, ölçüm doğruluğu ve kullanılan yönteme göre değişebilir.</li>
          <li>Bilimsel kaynak kullanılması hatasızlık, değişmezlik veya içeriğin herkese uygun olduğu garantisini oluşturmaz.</li>
          <li>Belirli bir kas kazanımı, kilo değişimi, performans artışı veya sağlık sonucu garanti edilmez.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="4. Egzersiz güvenliği">
        <p>Egzersizde deneyim düzeyinizi, teknik yeterliliğinizi, ekipmanı ve ortam güvenliğini dikkate alın. Ağrı veya olağandışı rahatsızlık hâlinde egzersizi durdurun.</p>
      </LegalSection>

      <LegalSection title="5. Kullanım sorumluluğu">
        <p>Kullanıcı içerikleri kendi koşullarını dikkate alarak değerlendirir ve makul güvenlik önlemlerini alır. Trainology, kendi makul kontrolü dışında kalan kesintilerden veya içeriğin uyarılar dikkate alınmadan ya da hukuka aykırı kullanımından, yürürlükteki hukukun izin verdiği ölçüde sorumlu tutulamaz. Bu hüküm kasıt, ağır kusur veya kanunen sınırlandırılamayan hakları ortadan kaldırmaz.</p>
      </LegalSection>

      <LegalSection title="6. Fikrî mülkiyet">
        <p>Trainology marka içerikleri, özgün metinler, tasarım sistemi, grafikler ve görseller ilgili mevzuat kapsamında korunabilir. İçeriklerin tamamı veya esaslı bir bölümü izinsiz kopyalanamaz, yeniden yayımlanamaz, satılamaz ya da marka izlenimi yaratacak şekilde kullanılamaz. Mevzuatın izin verdiği alıntılarda Trainology ve ilgili bağlantı kaynak gösterilmelidir.</p>
      </LegalSection>

      <LegalSection title="7. Haricî bağlantılar ve değişiklikler">
        <p>Üçüncü taraf bağlantılarının içerik ve hizmetleri Trainology’nin kontrolü dışında olabilir ve hedef sitelerin kendi koşullarına tabidir. Site içeriği ve özellikleri güvenlik, bakım, mevzuat veya proje ihtiyaçlarıyla güncellenebilir, kesintiye uğrayabilir veya kaldırılabilir.</p>
      </LegalSection>

      <LegalSection title="8. Uygulanacak hukuk ve iletişim">
        <p>Bu koşullar Türkiye Cumhuriyeti hukukuna tabidir; görevli ve yetkili mercilere ilişkin emredici hükümler saklıdır.</p>
        <p>Sorularınız için <a className={legalLinkClass} href="mailto:trainology.fit@outlook.com">trainology.fit@outlook.com</a> adresine yazabilirsiniz.</p>
      </LegalSection>
    </LegalPage>
  );
}
