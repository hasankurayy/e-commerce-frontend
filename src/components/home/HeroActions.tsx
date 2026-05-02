"use client";
import Link from "next/link";
import { ArrowRight, User } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

export default function HeroActions() {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Link
          href="/products"
          className="group flex items-center gap-2.5 rounded-2xl bg-indigo-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-indigo-900/50 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
        >
          Alışverişe Başla
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm">
          <User className="h-5 w-5 text-indigo-300" />
          Hoş geldin, {user?.firstName}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
      <Link
        href="/products"
        className="group flex items-center gap-2.5 rounded-2xl bg-indigo-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-indigo-900/50 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
      >
        Alışverişe Başla
        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
      </Link>
      <Link
        href="/auth/login"
        className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
      >
        Giriş Yap
      </Link>
      <Link
        href="/auth/register"
        className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
      >
        Ücretsiz Kayıt Ol
      </Link>
    </div>
  );
}
