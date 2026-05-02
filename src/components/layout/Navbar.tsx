"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Package, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useCart } from "@/hooks/useCart";
import api from "@/lib/api";
import { toast } from "sonner";

export default function Navbar() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { data: cart } = useCart();
  const itemCount = cart?.totalItems ?? 0;

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      await api.post("/api/auth/logout", { refreshToken }).catch(() => {});
    }
    logout();
    toast.success("Çıkış yapıldı");
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-sm shadow-indigo-200 transition-shadow group-hover:shadow-indigo-300">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">
              n<span className="text-indigo-600"> 55</span>
            </span>
          </Link>

          {/* Right */}
          <div className="flex items-center gap-1.5">
            {isAuthenticated ? (
              <>
                <div className="hidden items-center sm:flex">
                  <span className="text-sm font-medium text-gray-700">{user?.firstName} {user?.lastName}</span>
                </div>

                <div className="mx-2 hidden h-5 w-px bg-gray-200 sm:block" />

                <Link
                  href="/products"
                  className="hidden rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-indigo-600 sm:block"
                >
                  Ürünler
                </Link>

                <Link
                  href="/orders"
                  className="hidden rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-indigo-600 sm:block"
                >
                  Siparişlerim
                </Link>

                <Link
                  href="/cart"
                  className="relative rounded-xl p-2.5 text-gray-600 transition-colors hover:bg-gray-50"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white ring-2 ring-white">
                      {itemCount > 9 ? "9+" : itemCount}
                    </span>
                  )}
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:block">Çıkış</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="rounded-xl px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/auth/register"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-indigo-200 transition-colors hover:bg-indigo-700"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
