import type { Metadata } from "next";

import LegalPage, { LegalSection, legalLinkClass } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Çerez ve Yerel Depolama Politikası",
  description: "Trainology internet sitesindeki çerez ve localStorage kullanımına ilişkin açıklamalar.",
  alternates: { canonical: "/cerez-ve-yerel-depolama-politikasi" },
};

export default function CerezVeYerelDepolamaPolitikasiPage() {
  return (
    <LegalPage title="Çerez ve Yerel Depolama Politikası" description="Trainology’nin mevcut çerez ve yerel depolama kullanımı hakkında bilgi.">
      <LegalSection title="1. Mevcut çerez kullanımı">
        <p>Trainology’nin mevcut lansman sürümünde aktif bir uygulama çerezi tespit edilmemiştir. Analitik, reklam, pazarlama veya davranışsal takip çerezi kullanılmaz; bu amaçlarla çalışan bir izleme script’i bulunmaz.</p>
        <p>Zorunlu olmayan bir takip teknolojisi bulunmadığı için “Kabul Et / Reddet” çerez banner’ı gösterilmez.</p>
      </LegalSection>

      <LegalSection title="2. LocalStorage kullanımı">
        <p>LocalStorage klasik bir HTTP çerezi değildir; tercihlerin aynı cihaz ve tarayıcıda hatırlanmasını sağlayan yerel bir tarayıcı depolama alanıdır.</p>
        <p>Trainology’nin mevcut sürümü uygulama işlevleri için localStorage alanında kayıt oluşturmaz.</p>
      </LegalSection>

      <LegalSection title="3. Gelecekteki değişiklikler">
        <p>İleride analitik, reklam veya isteğe bağlı başka bir çerez eklenirse bu politika teknoloji kullanılmadan önce güncellenir ve gerektiğinde ayrı bir tercih/izin mekanizması sunulur. Zorunlu olmayan teknolojiler gerekli izin alınmadan çalıştırılmaz.</p>
      </LegalSection>

      <LegalSection title="4. İletişim">
        <p>Çerezler ve yerel depolama hakkında sorularınız için <a className={legalLinkClass} href="mailto:trainology.fit@outlook.com">trainology.fit@outlook.com</a> adresine yazabilirsiniz.</p>
      </LegalSection>
    </LegalPage>
  );
}
