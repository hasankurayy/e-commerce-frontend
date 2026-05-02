"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, Eye, EyeOff, CheckCircle } from "lucide-react";
import api from "@/lib/api";
import { ApiResponse, TokenResponse } from "@/types";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";

const perks = [
  "Anında ücretsiz hesap oluşturun",
  "Siparişlerinizi takip edin",
  "Güvenli ödeme altyapısı",
  "7/24 müşteri desteği",
];

export default function RegisterPage() {
  const router = useRouter();
  const { setTokens } = useAuthStore();
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post<ApiResponse<TokenResponse>>("/api/auth/register", form);
      setTokens(data.data.accessToken, data.data.refreshToken);
      toast.success("Kayıt başarılı! Hoş geldiniz.");
      router.push("/");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Kayıt başarısız");
    } finally {
      setLoading(false);
    }
  };

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value });

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Left brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-900 p-12 text-white lg:flex lg:w-5/12">
        <div className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-0 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            <Package className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold">E-Ticaret</span>
        </div>

        <div className="relative">
          <h2 className="text-4xl font-black leading-tight">
            Aramıza
            <span className="block bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent">
              katılın
            </span>
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Dakikalar içinde hesabınızı oluşturun ve alışverişe başlayın.
          </p>
          <div className="mt-8 space-y-3.5">
            {perks.map((perk) => (
              <div key={perk} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-violet-400" />
                <span className="text-sm text-slate-300">{perk}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-slate-600">© 2025 E-Ticaret · N11 Bootcamp</p>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <Package className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">E-Ticaret</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Hesap Oluştur</h1>
            <p className="mt-1.5 text-sm text-gray-500">Bilgilerinizi doldurun</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Ad</label>
                <input
                  type="text"
                  required
                  value={form.firstName}
                  onChange={update("firstName")}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="Ali"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Soyad</label>
                <input
                  type="text"
                  required
                  value={form.lastName}
                  onChange={update("lastName")}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="Yılmaz"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">E-posta</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={update("email")}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                placeholder="ornek@mail.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Şifre</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={form.password}
                  onChange={update("password")}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 pr-11 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="En az 8 karakter"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Telefon <span className="text-gray-400 font-normal">(opsiyonel)</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={update("phone")}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                placeholder="05XX XXX XX XX"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? "Hesap oluşturuluyor..." : "Hesap Oluştur →"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Zaten hesabın var mı?{" "}
            <Link href="/auth/login" className="font-semibold text-indigo-600 hover:text-indigo-800">
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
