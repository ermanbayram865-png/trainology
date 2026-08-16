# Trainology Design System

## Amaç

Bu sistem, Trainology arayüzlerinde tekrar kullanılabilir, tutarlı ve responsive bileşenler oluşturmak için ortak API ve görsel kuralları tanımlar.

## Tasarım kuralları

- Ana arka plan `#050505`, kart yüzeyleri `#0B0B0B` ve `#0A0A0A` kullanır.
- Vurgu rengi altındır: temel ton `#C9A14A`, hover tonu `#D4AF37`.
- Kartlar `rounded-3xl`; çağrı butonları `rounded-xl` köşe yarıçapı kullanır.
- Varsayılan kart kenarlığı beyazın düşük opaklıklı tonudur. Hover durumunda altın vurgu uygulanır.
- Metin hiyerarşisi beyaz başlıklar, `neutral-400` açıklamalar ve küçük üst başlıklardan oluşur.
- Yeni bileşenler `className` ile yalnızca bağlamsal yerleşim için genişletilebilir; temel renk, boşluk ve durum stilleri variant’lar üzerinden korunur.

## Responsive kurallar

- Varsayılan düzen mobil önceliklidir.
- Yatay sayfa boşluğu `px-6`, geniş ekranlarda mevcut container kurallarıyla genişler.
- Başlıklar mobilde daha düşük ölçekle başlar; `PageHeader` başlığı `sm` kırılımında büyür.
- Grid bileşenleri mobilde tek kolon, orta ekranda iki kolon, geniş ekranda seçilen kolon sayısına geçer.
- Etkileşim hedefleri en az görünür ve rahat dokunulabilir boyutta tutulur; CTA’lar dar ekranda satır kırmaya izin verir.

## Bileşen listesi ve API

### `Badge`

Kısa durum, kategori veya etiket göstermek için kullanılır.

- Props: `children`, `variant`, `className`
- Variant’lar: `gold`, `neutral`, `success`, `warning`

### `Card`

Genel amaçlı yüzey bileşenidir. `href` verildiğinde kart, Next.js `Link` olarak davranır.

- Props: `title`, `description`, `icon`, `href`, `onClick`, `variant`, `children`, `className`
- Variant’lar: `default`, `gold`, `subtle`

### `Section`

Sayfa bölümlerini ortak dikey ritim ve maksimum genişlikle sarmalar.

- Props: `title`, `subtitle`, `description`, `children`, `className`, `contentClassName`

### `PageHeader`

Sayfa başlık alanını standartlaştırır.

- Props: `badge`, `title`, `description`, `alignment`, `className`
- `alignment`: `left` veya `center`

### `CTAButton`

Birincil kullanıcı aksiyonları için buton veya link bileşenidir. `href` verildiğinde link olarak render edilir.

- Props: `children`, `href`, `variant`, `className` ve standart button props’ları
- Variant’lar: `primary`, `secondary`, `ghost`

### `CalculatorCard`

Trainology’nin resmi hesaplayıcı katalog kartıdır.

- Props: `title`, `description`, `icon`, `category`, `status`, `href`, `className`
- `status`: `active`, `comingSoon` veya `new`

## Kullanım ilkeleri

- Yeni sayfa geliştirmelerinde önce uygun `ui` bileşeni seçilir; aynı kart veya CTA stili yeniden yazılmaz.
- Var olan sayfalara geçiş, görsel regresyon kontrolüyle sayfa bazında ve ayrıca onay alınarak yapılır.
- Variant yeterli değilse önce bileşen API’si değerlendirilir; sayfa içinde kopya Tailwind sınıfları oluşturmaktan kaçınılır.
