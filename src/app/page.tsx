import Link from "next/link";
import { Shield, Zap, ShoppingBag, Star, Truck, RefreshCw, Package } from "lucide-react";
import HeroActions from "@/components/home/HeroActions";

const features = [
  { icon: Shield, title: "Güvenli Ödeme", desc: "SSL korumalı, Iyzico altyapısıyla her işlem güvende.", color: "text-green-500", bg: "bg-green-50" },
  { icon: Zap, title: "Hızlı Kargo", desc: "Siparişiniz aynı gün kargoya verilir, kapınıza gelir.", color: "text-yellow-500", bg: "bg-yellow-50" },
  { icon: RefreshCw, title: "Kolay İade", desc: "14 gün içinde ücretsiz, zahmetsiz iade garantisi.", color: "text-indigo-500", bg: "bg-indigo-50" },
  { icon: Star, title: "Seçkin Ürünler", desc: "Her kategori titizlikle seçilmiş kaliteli ürünlerle dolu.", color: "text-violet-500", bg: "bg-violet-50" },
];

const stats = [
  { value: "500+", label: "Ürün" },
  { value: "10K+", label: "Mutlu Müşteri" },
  { value: "%99", label: "Memnuniyet" },
  { value: "1 Gün", label: "Kargo" },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 px-4 py-32 text-white">
        <div className="pointer-events-none absolute -left-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 bottom-0 h-[40rem] w-[40rem] rounded-full bg-violet-500/10 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.02] blur-2xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
            <span className="text-slate-300">Türkiye&apos;nin en yeni alışveriş deneyimi</span>
          </div>

          <h1 className="mb-6 text-5xl font-black leading-tight tracking-tight sm:text-6xl md:text-7xl">
            Alışverişin
            <span className="block bg-gradient-to-r from-indigo-300 via-violet-300 to-purple-300 bg-clip-text text-transparent">
              yeni adresi
            </span>
          </h1>

          <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-slate-400">
            İhtiyacınız olan her şeyi tek çatı altında bulun. Elektronikten spora, kitaptan eve — yüzlerce ürün, bir tık uzağınızda.
          </p>

          <HeroActions />

          {/* Trust badges */}
          <div className="mt-14 flex flex-wrap justify-center gap-8 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-400" />
              SSL Korumalı
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-blue-400" />
              Ücretsiz Kargo
            </div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-indigo-400" />
              Kolay İade
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400" />
              Garantili Ürünler
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-100 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-black text-indigo-600">{s.value}</p>
                <p className="mt-1 text-sm font-medium text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50/50 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-black text-gray-900 sm:text-4xl">
              Neden <span className="text-indigo-600">n 55</span>?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-500">
              Güvenli, hızlı ve kullanıcı odaklı alışveriş deneyimiyle fark yaratıyoruz.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${bg}`}>
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <h3 className="mb-2 font-bold text-gray-900">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-indigo-600 to-violet-700 px-4 py-24 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <Package className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mb-4 text-3xl font-black sm:text-4xl">
            Hemen keşfetmeye başlayın
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-indigo-200">
            Yüzlerce ürün arasından ihtiyacınıza en uygununu bulun. Arama yapın, kategorilere göz atın.
          </p>
          <Link
            href="/products"
            className="group inline-flex items-center gap-2.5 rounded-2xl bg-white px-8 py-4 text-base font-bold text-indigo-700 shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            Ürünleri Keşfet
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}
