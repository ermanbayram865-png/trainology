import type { Metadata } from "next";

import LegalPage, { LegalList, LegalSection, legalLinkClass } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Çerez ve Yerel Depolama Politikası",
  description: "Trainology internet sitesindeki çerez ve localStorage kullanımına ilişkin açıklamalar.",
  alternates: { canonical: "/cerez-ve-yerel-depolama-politikasi" },
};

export default function CerezVeYerelDepolamaPolitikasiPage() {
  return (
    <LegalPage title="Çerez ve Yerel Depolama Politikası" description="Trainology’nin çerez kullanımı ve tarayıcıda saklanan favori tercihleri hakkında bilgi.">
      <LegalSection title="1. Mevcut çerez kullanımı">
        <p>Trainology’nin mevcut lansman sürümünde aktif bir uygulama çerezi tespit edilmemiştir. Analitik, reklam, pazarlama veya davranışsal takip çerezi kullanılmaz; bu amaçlarla çalışan bir izleme script’i bulunmaz.</p>
        <p>Zorunlu olmayan bir takip teknolojisi bulunmadığı için “Kabul Et / Reddet” çerez banner’ı gösterilmez.</p>
      </LegalSection>

      <LegalSection title="2. LocalStorage kullanımı">
        <p>LocalStorage klasik bir HTTP çerezi değildir; tercihlerin aynı cihaz ve tarayıcıda hatırlanmasını sağlayan yerel bir tarayıcı depolama alanıdır.</p>
        <p>Trainology yalnızca kullanıcının favoriye eklediği içeriklerin slug/kimlik değerlerini şu anahtarlarla saklar:</p>
        <LegalList>
          <li><code className="rounded bg-white/10 px-1.5 py-0.5 text-[#D6B25E]">trainology.favorite-movements</code>: favori hareket slug’ları</li>
          <li><code className="rounded bg-white/10 px-1.5 py-0.5 text-[#D6B25E]">trainology.favorite-supplements</code>: favori supplement slug’ları</li>
        </LegalList>
        <p>Ad, e-posta, sağlık bilgisi veya hesaplayıcı girdileri bu anahtarlarda saklanmaz.</p>
      </LegalSection>

      <LegalSection title="3. Favori kayıtlarının özellikleri">
        <LegalList>
          <li>Yalnızca işlemin yapıldığı cihaz ve tarayıcıda kalır.</li>
          <li>Hesap veya kullanıcı profili oluşturmaz ve başka cihazlarla eşitlenmez.</li>
          <li>Trainology sunucusuna, veritabanına, analitiğe veya üçüncü tarafa gönderilmez.</li>
          <li>Favoriler tek tek veya ilgili kütüphanedeki “Tüm favorileri temizle” seçeneğiyle silinebilir.</li>
          <li>Tarayıcı/site verilerinin temizlenmesi favorileri de silebilir.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="4. Gelecekteki değişiklikler">
        <p>İleride analitik, reklam veya isteğe bağlı başka bir çerez eklenirse bu politika teknoloji kullanılmadan önce güncellenir ve gerektiğinde ayrı bir tercih/izin mekanizması sunulur. Zorunlu olmayan teknolojiler gerekli izin alınmadan çalıştırılmaz.</p>
      </LegalSection>

      <LegalSection title="5. İletişim">
        <p>Çerezler ve yerel depolama hakkında sorularınız için <a className={legalLinkClass} href="mailto:info@trainology.com.tr">info@trainology.com.tr</a> adresine yazabilirsiniz.</p>
      </LegalSection>
    </LegalPage>
  );
}
