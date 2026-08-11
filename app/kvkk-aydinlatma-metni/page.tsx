import type { Metadata } from "next";

import LegalPage, { LegalList, LegalSection, legalLinkClass } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description: "Trainology internet sitesinde işlenebilecek kişisel verilere ilişkin KVKK aydınlatma metni.",
  alternates: { canonical: "/kvkk-aydinlatma-metni" },
};

export default function KvkkAydinlatmaMetniPage() {
  return (
    <LegalPage
      title="KVKK Aydınlatma Metni"
      description="Trainology internet sitesinin kullanımı sırasında işlenebilecek sınırlı kişisel verilere ilişkin bilgilendirme."
    >
      <p>
        Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu’nun (“KVKK”) 10. maddesi uyarınca hazırlanmıştır.
        Aydınlatma metninin görüntülenmesi veya sitenin kullanılması açık rıza anlamına gelmez.
      </p>

      <LegalSection title="1. Veri sorumlusu">
        <p>Kişisel veriler bakımından veri sorumlusu <strong className="text-white">Erman Bayram</strong>’dır. Trainology marka adıdır.</p>
        <p>
          Genel iletişim ve KVKK başvuruları: <a className={legalLinkClass} href="mailto:trainology.fit@outlook.com">trainology.fit@outlook.com</a>
        </p>
      </LegalSection>

      <LegalSection title="2. İşlenebilecek kişisel veriler">
        <LegalList>
          <li><strong className="text-white">Teknik erişim ve güvenlik verileri:</strong> IP adresi, istek zamanı, istenen sayfa veya kaynak, tarayıcı/cihaz bilgisi ile hata ve güvenlik kayıtları gibi hosting altyapısında oluşabilecek sınırlı kayıtlar.</li>
          <li><strong className="text-white">İletişim verileri:</strong> Kendi isteğinizle e-posta gönderdiğinizde e-posta adresiniz, ad-soyadınız, mesajınız ve eklediğiniz dosyalar.</li>
          <li><strong className="text-white">Başvuru verileri:</strong> KVKK kapsamındaki başvurunun konusu, iletişim bilgileri ve başvuru sahibiyle ilgili veriler arasındaki ilişkiyi doğrulamak için gerekli olabilecek sınırlı bilgiler.</li>
          <li><strong className="text-white">Hukuki işlem verileri:</strong> Bir hakkın tesisi, kullanılması veya korunması için tutulması gereken sınırlı yazışma ve kayıtlar.</li>
          <li><strong className="text-white">Cihaz içi Energy Lab kalibrasyon verileri:</strong> Kullanıcının kendi isteğiyle eklediği tarih, günlük vücut ağırlığı, isteğe bağlı döngü notu ve kısa kişisel not. Bu kayıtlar yalnız kullanıcının tarayıcısındaki localStorage alanında tutulur ve Trainology sunucusuna aktarılmaz.</li>
        </LegalList>
        <p>Mevcut sürümde üyelik, kullanıcı hesabı, bülten, ödeme, abonelik, iletişim formu veya kullanıcı profili bulunmaz.</p>
        <p>Energy Lab’in hamilelik/emzirme, yeme bozukluğu veya RED-S riski ve profesyonel değerlendirme gerektirebilecek durumlara ilişkin güvenlik ve kapsam yanıtları yalnız mevcut kullanım sırasında cihazda değerlendirilir; localStorage veya sessionStorage alanına kaydedilmez ve Trainology sunucusuna gönderilmez.</p>
      </LegalSection>

      <LegalSection title="3. İşleme amaçları ve hukuki sebepler">
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
            <thead className="bg-white/[0.04] text-white"><tr><th className="p-4">Faaliyet</th><th className="p-4">Amaç</th><th className="p-4">Hukuki sebep</th></tr></thead>
            <tbody className="divide-y divide-white/10">
              <tr><td className="p-4">Teknik erişim ve güvenlik kayıtları</td><td className="p-4">Site güvenliği, kararlılığı, hata incelemesi ve kötüye kullanımın önlenmesi</td><td className="p-4">Temel hak ve özgürlükler gözetilerek KVKK m. 5/2-f kapsamında meşru menfaat</td></tr>
              <tr><td className="p-4">Kullanıcının gönderdiği e-posta</td><td className="p-4">Sorunun veya talebin değerlendirilmesi ve yanıtlanması</td><td className="p-4">Temel hak ve özgürlükler gözetilerek KVKK m. 5/2-f kapsamında meşru menfaat</td></tr>
              <tr><td className="p-4">KVKK başvuruları</td><td className="p-4">Başvurunun alınması, doğrulanması ve cevaplandırılması</td><td className="p-4">KVKK m. 5/2-ç kapsamında hukuki yükümlülük</td></tr>
              <tr><td className="p-4">Zorunlu hukuki kayıtlar</td><td className="p-4">Bir hakkın tesisi, kullanılması veya korunması</td><td className="p-4">KVKK m. 5/2-e</td></tr>
            </tbody>
          </table>
        </div>
      </LegalSection>

      <LegalSection title="4. Toplama yöntemi">
        <p>Veriler; hosting ve sunucu altyapısında otomatik oluşabilecek teknik kayıtlar, kullanıcının kendi isteğiyle gönderdiği e-postalar ve KVKK başvurularında doğrudan iletilen bilgiler yoluyla elektronik ortamda toplanabilir.</p>
        <p>Energy Lab kalibrasyon kayıtları tarayıcı tarafından doğrudan ilgili cihazın localStorage alanına yazılır. Trainology bu kayıtları bir sunucu, kullanıcı hesabı veya merkezi veri tabanı üzerinden toplamaz.</p>
      </LegalSection>

      <LegalSection title="5. Verilerin aktarılması">
        <p>Kişisel veriler yalnızca gerekli ölçüde; web hosting ve e-posta hizmetlerinin sunulmasını sağlayan hizmet sağlayıcılara ve hukuken zorunlu olması hâlinde yetkili kamu kurumları ile adli mercilere aktarılabilir.</p>
        <p>Energy Lab kalibrasyon kayıtları ile güvenlik ve kapsam yanıtları analytics hizmetlerine veya üçüncü taraflara aktarılmaz. Kalibrasyon kayıtları cihazdaki localStorage alanında kalır; güvenlik ve kapsam yanıtları ise kalıcı olarak saklanmaz.</p>
        <p>Hosting, uzak yedekler, e-posta altyapısı ve alt hizmet sağlayıcıların veri işleme ülkelerine ilişkin bilgiler sağlayıcılardan doğrulandıkça bu metin güncellenir. Doğrulanmamış bir yurt dışı aktarımı varmış veya hiç yokmuş gibi kesin bir beyanda bulunulmaz.</p>
      </LegalSection>

      <LegalSection title="6. Saklama ve imha">
        <p>Veriler, amaç için gerekli süre ve uygulanabilir hukuki yükümlülükler dikkate alınarak saklanır. Saklama sebebi sona eren veriler, uygun yönteme göre silinir, yok edilir veya anonim hâle getirilir. Doğrulanmamış kesin bir log ya da e-posta saklama süresi taahhüt edilmez.</p>
        <p>Energy Lab kalibrasyon kayıtları, kullanıcı tek tek veya topluca silene ya da tarayıcı verilerini temizleyene kadar yalnız ilgili cihazda kalır. Trainology sunucusunda bu kayıtların yedeği bulunmaz. Güvenlik ve kapsam yanıtları oturum sonrasında saklanmaz.</p>
      </LegalSection>

      <LegalSection title="7. Özel nitelikli kişisel veriler">
        <p>Energy Lab genel yetişkin hesaplayıcısının kapsamını belirlemek için yalnız geniş kapsamlı güvenlik seçimleri sunar; teşhis, sağlık raporu, laboratuvar sonucu veya ayrıntılı hastalık öyküsü talep etmez. Bu seçimler cihazda geçici olarak değerlendirilir ve saklanmaz. Kullanıcının kalibrasyona kendi isteğiyle eklediği döngü veya kişisel notlar yalnız cihazdaki localStorage alanında tutulur.</p>
        <p>E-postayla gereksiz sağlık verisi veya kimlik belgesi göndermeyin. Talep edilmeden iletilen bu tür veriler üzerinden kişisel teşhis ya da tıbbi değerlendirme yapılmaz; geçerli saklama sebebi bulunmayan gereksiz veriler silinir.</p>
      </LegalSection>

      <LegalSection title="8. KVKK kapsamındaki haklarınız">
        <p>KVKK’nın 11. maddesi uyarınca:</p>
        <LegalList>
          <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme ve işlenmişse bilgi talep etme,</li>
          <li>İşlenme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme,</li>
          <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,</li>
          <li>Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme,</li>
          <li>Kanundaki şartlarla silinmesini veya yok edilmesini isteme,</li>
          <li>Düzeltme, silme veya yok etmenin aktarılan üçüncü kişilere bildirilmesini isteme,</li>
          <li>Yalnızca otomatik sistemlerle analiz sonucu aleyhe bir sonuca itiraz etme,</li>
          <li>Kanuna aykırı işleme nedeniyle zararın giderilmesini talep etme</li>
        </LegalList>
        <p>KVKK’nın 11. maddesi kapsamındaki taleplerinizi, KVKK’nın 13. maddesi ve Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ’de belirtilen yöntemlere uygun olarak veri sorumlusuna iletebilirsiniz. Elektronik başvurular ve konuyla ilgili iletişim için <a className={legalLinkClass} href="mailto:trainology.fit@outlook.com">trainology.fit@outlook.com</a> adresini kullanabilirsiniz. Normal e-posta yoluyla yapılan resmî başvurularda, daha önce Trainology’ye bildirdiğiniz ve sistemde kayıtlı bulunan e-posta adresinin kullanılması gerekir. Başvurular, talebin niteliğine göre mümkün olan en kısa sürede ve en geç 30 gün içinde ücretsiz olarak cevaplandırılır. İşlemin ayrıca maliyet gerektirmesi hâlinde Kişisel Verileri Koruma Kurulu tarafından belirlenen tarifedeki ücret uygulanabilir.</p>
      </LegalSection>
    </LegalPage>
  );
}
