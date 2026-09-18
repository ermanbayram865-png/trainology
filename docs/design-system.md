# Trainology Design System

## Amaç

Bu sistem, Trainology arayüzlerinde tekrar kullanılabilir, tutarlı ve responsive bileşenler oluşturmak için ortak API ve görsel kuralları tanımlar. Semantik foundation token'larının kaynak dosyası `app/globals.css` içindeki `:root` bloğudur.

## Foundation token rolleri

### Renk

- Site: `--site-background`, `--site-surface`, `--site-surface-elevated`, `--site-text-primary`, `--site-text-secondary`
- Marka: `--brand-gold`, `--brand-gold-hover`, `--brand-gold-muted`
- Calculator: `--calculator-paper`, `--calculator-paper-secondary`, `--calculator-navy`, `--calculator-text-on-paper`, `--calculator-text-on-navy`
- Durum: `--state-error`
- Kenarlık ve odak: `--border-dark`, `--border-light`, `--border-emphasis`, `--border-error`, `--focus-ring`, `--focus-ring-shadow`

Mevcut `--background`, `--surface`, `--gold` ve `--calculator-*` değişkenleri geriye uyumluluk için semantik rollere bağlı alias olarak korunur.

### Tipografi

- `display`: Ana marka/hero ifadesi; en yüksek görsel vurgu.
- `page-title`: Sayfanın tek ana başlığı.
- `section-title`: Ana içerik bölümü başlığı.
- `card-title`: Kart veya panel başlığı.
- `body`: Varsayılan okuma metni.
- `body-small`: Yardımcı açıklama metni.
- `caption`: Kısa dipnot veya meta bilgi.
- `technical-label`: Yalnız kısa teknik etiketler; uppercase ve geniş harf aralığı bu rolle sınırlıdır.

Her rolün `size`, `leading` ve gerektiğinde `weight`/`tracking` token'ı vardır. Font ailesi Geist'tır.

### Boşluk

- Bölümler: `--space-section`, `--space-section-compact`
- Paneller: `--space-panel`, `--space-panel-compact`
- İçerik: `--space-field-group`, `--space-content-gap`, `--space-inline-action`

### Radius

Dört rol kullanılır: `--radius-control`, `--radius-panel`, `--radius-card`, `--radius-feature`. Yeni tek-seferlik radius değerleri eklenmez.

### Gölge

Yalnız `--shadow-subtle`, `--shadow-elevated` ve `--shadow-result` yeni foundation rolleri olarak kullanılır. Glow, neon ve glassmorphism foundation desenleri değildir. Eski shadow değişkenleri yalnız mevcut kullanımları bozmamak için uyumluluk alias'ı olarak kalır.

### Container

- `--container-editorial` / `.container-editorial`: Dar, uzun-form okuma alanı.
- `--container-wide` / `.container-wide`: Geniş site bölümleri.
- `--container-calculator` / `.container-calculator`: Calculator akışları.

Container utility'leri mobilde `1.5rem` yatay boşluk kullanır. Mevcut sayfalar ayrı pilot ve görsel QA olmadan topluca bu sınıflara taşınmaz.

## Tasarım kuralları

- Ana arka plan `#050505`; site yüzeyleri `#0C0C0C` ve `#111111` kullanır.
- Vurgu rengi altındır: temel ton `#C9A14A`, hover tonu `#D4AF37`.
- Calculator ailesi paper `#FBFAF6` ve navy `#102536` kimliğini korur.
- Varsayılan kart kenarlığı düşük kontrastlıdır; vurgu kenarlığı yalnız hiyerarşi veya etkileşim gerektiğinde kullanılır.
- Klavye odağı tek, görünür altın focus ring ile gösterilir. Native semantik kontroller ve yaklaşık 44–48 px etkileşim hedefleri korunur.
- Yeni bileşenler `className` ile yalnızca bağlamsal yerleşim için genişletilebilir; temel renk, boşluk ve durum stilleri variant'lar üzerinden korunur.

## Responsive kurallar

- Varsayılan düzen mobil önceliklidir.
- Yatay sayfa boşluğu `px-6`, geniş ekranlarda ilgili container rolüyle genişler.
- Başlık rolleri `clamp()` ile mobil ölçekte başlar ve kontrollü büyür.
- Grid bileşenleri mobilde tek kolon, orta ve geniş ekranlarda içerik ihtiyacına göre büyür.
- Etkileşim hedefleri yaklaşık 44–48 px tutulur; CTA'lar dar ekranda satır kırmaya izin verir.
- Mevcut `prefers-reduced-motion` davranışı korunur; foundation katmanı yeni animasyon, parallax veya scroll efekti eklemez.

### Desktop yoğunluk katmanı

- `1024–1599 px` aralığında tipografi ve spacing rolleri yaklaşık `%92` görsel yoğunluğa normalize edilir; bu gerçek CSS ölçülerinden oluşur, `zoom` veya `transform: scale()` değildir.
- Navbar, genel section, page header, card, container gutter ve footer aynı semantic desktop-density katmanını tüketir.
- `1600 px` ve üzerindeki büyük desktoplarda temel token değerleri korunur; premium whitespace kaybolmaz.
- Mobil tokenlar ve 44–48 px etkileşim hedefleri desktop normalizasyonundan etkilenmez.
- Calculator sayfalarındaki `max-height: 850px` compact contract yalnız düşük-height desktop için ikinci, sınırlı bir katmandır; global yoğunluk sisteminin yerine geçmez.

## Bileşen listesi ve API

Shared primitive'ler foundation token'larını doğrudan tüketir. Public prop sözleşmeleri presentation katmanından bağımsız tutulur.

### Ortak presentation contract'ları

- Butonlar: 48 px minimum yükseklik, control radius, açık primary/secondary hiyerarşisi, görünür altın focus ve sakin renk/elevation geçişleri.
- Kartlar: card radius, düşük kontrastlı border ve düşük yoğunluklu elevation. Hover sırasında konum değiştirmez.
- Form kontrolleri: `.calculator-input`, `.calculator-choice`, `.calculator-label`, `.calculator-helper` ve `.calculator-error` ortak durum dilini taşır.
- Selection yüzeyleri: `data-selected`, native radio/checkbox state'i ve `:focus-within` üzerinden selected, unselected, focus ve disabled sunumunu korur.
- Disclosure: `.calculator-disclosure` native `details/summary` semantiğiyle kullanılır; JavaScript accordion gerektirmez.
- Sonuçlar: `.calculator-result` dark, `.calculator-result-light` light sonuç yüzeyi sözleşmesidir.
- Badge: kategori, durum veya teknik sınıflandırma için technical-label tipografi rolünü kullanır.

### `Badge`

Kısa durum, kategori veya etiket göstermek için kullanılır.

- Props: `children`, `variant`, `className`
- Variant'lar: `gold`, `neutral`, `success`, `warning`

### `Card`

Genel amaçlı yüzey bileşenidir. `href` verildiğinde kart, Next.js `Link` olarak davranır.

- Props: `title`, `description`, `icon`, `href`, `onClick`, `variant`, `children`, `className`
- Variant'lar: `default`, `gold`, `subtle`

### `Section`

Sayfa bölümlerini ortak dikey ritim ve maksimum genişlikle sarmalar.

- Props: `title`, `subtitle`, `description`, `children`, `className`, `contentClassName`

### `PageHeader`

Sayfa başlık alanını standartlaştırır.

- Props: `badge`, `title`, `description`, `alignment`, `className`
- `alignment`: `left` veya `center`

### `CTAButton`

Birincil kullanıcı aksiyonları için buton veya link bileşenidir. `href` verildiğinde link olarak render edilir.

- Props: `children`, `href`, `variant`, `className` ve standart button props'ları
- Variant'lar: `primary`, `secondary`, `ghost`

### `CalculatorCard`

Trainology'nin resmi hesaplayıcı katalog kartıdır.

- Props: `title`, `description`, `icon`, `category`, `status`, `href`, `className`
- `status`: `active`, `comingSoon` veya `new`

## Kullanım ilkeleri

- Yeni sayfa geliştirmelerinde önce uygun `ui` bileşeni seçilir; aynı kart veya CTA stili yeniden yazılmaz.
- Var olan sayfalara geçiş, görsel regresyon kontrolüyle sayfa bazında ve ayrıca onay alınarak yapılır.
- Variant yeterli değilse önce bileşen API'si değerlendirilir; sayfa içinde kopya Tailwind sınıfları oluşturmaktan kaçınılır.
- Calculator science, validation ve result sözleşmeleri görsel token değişikliklerinden bağımsızdır.
