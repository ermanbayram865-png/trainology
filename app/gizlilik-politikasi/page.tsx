import type { Metadata } from "next";

import LegalPage, { LegalList, LegalSection, legalLinkClass } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description: "Trainology internet sitesinin gizlilik yaklaşımı ve kullanıcı verilerinin korunmasına ilişkin politika.",
  alternates: { canonical: "/gizlilik-politikasi" },
};

export default function GizlilikPolitikasiPage() {
  return (
    <LegalPage title="Gizlilik Politikası" description="Trainology’nin mevcut lansman sürümündeki veri işleme ve gizlilik yaklaşımı.">
      <p>Trainology, kullanıcıların gizliliğine saygı duyar ve yalnızca sitenin güvenli çalışması ile doğrudan gönderilen talepler için gerekli olabilecek sınırlı verileri işler.</p>

      <LegalSection title="1. Mevcut hizmet kapsamı">
        <p>Mevcut sürümde:</p>
        <LegalList>
          <li>Üyelik, hesap veya kullanıcı profili,</li>
          <li>İletişim formu ya da bülten aboneliği,</li>
          <li>Ödeme, satış veya ücretli abonelik,</li>
          <li>Kişiselleştirilmiş reklam, davranışsal takip veya pazarlama profili,</li>
          <li>Google Analytics, Meta Pixel, Clarity, Hotjar veya benzeri analiz araçları</li>
        </LegalList>
        <p>bulunmamaktadır.</p>
      </LegalSection>

      <LegalSection title="2. Oluşabilecek sınırlı veriler">
        <p>Siteye erişimde hosting altyapısında IP adresi, erişim zamanı, istenen sayfa, tarayıcı/cihaz bilgisi ve hata veya güvenlik kaydı gibi sınırlı teknik veriler oluşabilir.</p>
        <p><a className={legalLinkClass} href="mailto:trainology.fit@outlook.com">trainology.fit@outlook.com</a> adresine kendi isteğinizle e-posta gönderirseniz e-posta adresiniz, adınız, mesajınız ve eklediğiniz dosyalar iletişimi yürütmek ve talebinizi yanıtlamak amacıyla işlenebilir.</p>
      </LegalSection>

      <LegalSection title="3. Hesaplayıcılar">
        <p>Hesaplayıcılara girilen boy, kilo, yaş, cinsiyet, aktivite ve performans bilgileri cihazınızda işlenir; sunucuya veya üçüncü tarafa gönderilmez ve kalıcı olarak saklanmaz.</p>
      </LegalSection>

      <LegalSection title="4. Paylaşım ve hizmet sağlayıcılar">
        <p>Trainology kişisel verileri satmaz ve reklam profili oluşturmak amacıyla paylaşmaz. Sınırlı veriler yalnızca web sitesi ve e-posta hizmetinin gerektirdiği ölçüde hizmet sağlayıcılar tarafından işlenebilir veya hukuken zorunlu olduğunda yetkili mercilere iletilebilir.</p>
        <p>Hizmet sağlayıcıların veri işleme lokasyonlarına ilişkin doğrulanmış bilgiler değişirse bu politika güncellenir.</p>
      </LegalSection>

      <LegalSection title="5. Özel nitelikli veriler ve güvenlik">
        <p>Trainology sağlık raporu, teşhis, laboratuvar sonucu veya başka özel nitelikli veri istemez. E-postayla talebiniz için gereksiz sağlık verisi, kimlik belgesi veya finansal bilgi göndermeyin. Geçerli saklama sebebi bulunmayan gereksiz veriler silinir.</p>
        <p>Yetkisiz erişim, kayıp ve kötüye kullanıma karşı hizmetin niteliğiyle uyumlu makul teknik ve idari tedbirler uygulanır; internet üzerinden hiçbir iletim veya saklama yöntemi mutlak güvenlik garantisi vermez.</p>
      </LegalSection>

      <LegalSection title="6. Saklama, üçüncü taraf bağlantıları ve değişiklikler">
        <p>Veriler amaç için gerekli süre ve hukuki yükümlülükler dikkate alınarak tutulur; süre sonunda silme, yok etme veya anonimleştirme uygulanır. Doğrulanmamış kesin saklama süreleri belirtilmez.</p>
        <p>Trainology’deki üçüncü taraf bağlantılar hedef sitelerin kendi koşullarına tabidir. Veri işleyen yeni bir özellik eklenmeden önce bu politika ve ilgili KVKK metinleri yeniden değerlendirilir.</p>
      </LegalSection>

      <LegalSection title="7. İletişim">
        <p>Genel iletişim, gizlilik soruları ve KVKK başvuruları için <a className={legalLinkClass} href="mailto:trainology.fit@outlook.com">trainology.fit@outlook.com</a> adresini kullanabilirsiniz.</p>
      </LegalSection>
    </LegalPage>
  );
}
