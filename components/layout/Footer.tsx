import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050505]">
      <div className="mx-auto max-w-7xl px-6 py-16">

        <div className="grid gap-12 md:grid-cols-4">

          {/* Brand */}

          <div>
            <Image
              src="/images/logo.png"
              alt="Trainology"
              width={48}
              height={48}
              className="mb-6"
            />

            <p className="max-w-xs text-sm leading-7 text-neutral-400">
              Bilimsel araştırmaları herkesin anlayabileceği şekilde sunan yeni
              nesil fitness platformu.
            </p>
          </div>

          {/* Platform */}

          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-yellow-500">
              Platform
            </h3>

            <div className="flex flex-col gap-3 text-neutral-400">

              <Link href="/">Ana Sayfa</Link>

              <Link href="/calculators">Hesaplayıcılar</Link>

              <Link href="/movements">Hareket Kütüphanesi</Link>

              <Link href="/supplements">Supplementler</Link>

            </div>
          </div>

          {/* Features */}

          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-yellow-500">
              Sistemler
            </h3>

            <div className="flex flex-col gap-3 text-neutral-400">

              <Link href="/ai-coach">AI Coach</Link>

              <Link href="/about">Hakkımızda</Link>

              <Link href="/calculators">Yakında...</Link>

            </div>
          </div>

          {/* Copyright */}

          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-yellow-500">
              Trainology
            </h3>

            <p className="text-sm leading-7 text-neutral-400">
              Kanıta dayalı fitness platformu.
            </p>

            <p className="mt-8 text-xs text-neutral-500">
              © 2026 Trainology
              <br />
              Tüm hakları saklıdır.
            </p>
          </div>

        </div>

        <div className="mt-12 border-t border-white/5 pt-8">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A14A]/80">
            Yasal Uyarı
          </h3>
          <div className="mt-4 max-w-4xl space-y-2 text-xs leading-6 text-neutral-500">
            <p>Trainology içerikleri eğitim ve bilgilendirme amacıyla hazırlanmıştır.</p>
            <p>Sunulan bilgiler profesyonel sağlık tavsiyesi, tanı veya tedavi yerine geçmez.</p>
            <p>Hesaplama araçları genel bilgilendirme amaçlı tahminler sunar. Sonuçlar kişisel faktörlere göre değişebilir.</p>
          </div>
        </div>

      </div>
    </footer>
  );
}
