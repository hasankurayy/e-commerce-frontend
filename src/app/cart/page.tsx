"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus, ShoppingBag, MapPin, ArrowRight } from "lucide-react";
import { useCart, useUpdateCartItem, useRemoveFromCart } from "@/hooks/useCart";
import { useAuthStore } from "@/store/auth.store";
import { formatPrice } from "@/lib/utils";
import api from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";

export default function CartPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const { data: cart, isLoading } = useCart();
  const { mutate: updateItem } = useUpdateCartItem();
  const { mutate: removeItem } = useRemoveFromCart();
  const [orderLoading, setOrderLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [showOrderForm, setShowOrderForm] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 px-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100">
          <ShoppingBag className="h-10 w-10 text-gray-300" />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900">Sepetinizi görmek için giriş yapın</p>
          <p className="mt-1 text-sm text-gray-500">Hesabınıza giriş yaparak sepetinize erişin</p>
        </div>
        <Link href="/auth/login" className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition">
          Giriş Yap
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-8 w-32 animate-pulse rounded-lg bg-gray-200 mb-8" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
          <div className="h-64 animate-pulse rounded-2xl bg-gray-100" />
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 px-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100">
          <ShoppingBag className="h-10 w-10 text-gray-300" />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900">Sepetiniz boş</p>
          <p className="mt-1 text-sm text-gray-500">Alışverişe başlamak için ürünleri keşfedin</p>
        </div>
        <Link href="/" className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition">
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  const handleOrder = async () => {
    if (!address.trim()) {
      toast.error("Teslimat adresi giriniz");
      return;
    }
    setOrderLoading(true);
    try {
      const { data } = await api.post<{ success: boolean; data: { id: number } }>(
        "/api/orders", { shippingAddress: address }
      );
      router.push(`/payment/${data.data.id}`);
    } catch {
      toast.error("Sipariş oluşturulamadı");
      setOrderLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Sepetim</h1>
        <p className="mt-1 text-sm text-gray-500">{cart.totalItems} ürün</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="space-y-3 lg:col-span-2">
          {cart.items.map((item) => (
            <div key={item.itemId} className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 text-xl font-bold text-indigo-300">
                {item.productName.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-gray-900">{item.productName}</p>
                <p className="text-sm text-gray-400">{formatPrice(item.unitPrice)} / adet</p>
              </div>

              {/* Qty controls */}
              <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1">
                <button
                  onClick={() => updateItem({ productId: item.productId, quantity: item.quantity - 1 })}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 hover:bg-white hover:text-gray-900 transition"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-8 text-center text-sm font-semibold text-gray-900">{item.quantity}</span>
                <button
                  onClick={() => updateItem({ productId: item.productId, quantity: item.quantity + 1 })}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 hover:bg-white hover:text-gray-900 transition"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              <div className="text-right">
                <p className="font-bold text-gray-900">{formatPrice(item.subtotal)}</p>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="mt-1 rounded-lg p-1 text-gray-300 hover:bg-red-50 hover:text-red-500 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="h-fit rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sticky top-24">
          <h2 className="mb-5 text-base font-bold text-gray-900">Sipariş Özeti</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Ara toplam ({cart.totalItems} ürün)</span>
              <span className="font-medium">{formatPrice(cart.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Kargo</span>
              <span className="font-medium text-green-600">Ücretsiz</span>
            </div>
            <div className="my-4 border-t border-dashed border-gray-100 pt-4 flex justify-between">
              <span className="font-bold text-gray-900">Toplam</span>
              <span className="text-lg font-bold text-gray-900">{formatPrice(cart.totalAmount)}</span>
            </div>
          </div>

          {showOrderForm ? (
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <MapPin className="h-4 w-4 text-indigo-500" />
                Teslimat Adresi
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Mahalle, cadde, sokak, bina no..."
                rows={3}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 resize-none"
              />
              <button
                onClick={handleOrder}
                disabled={orderLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700 disabled:opacity-60"
              >
                {orderLoading ? "Yönlendiriliyor..." : "Ödemeye Geç"}
              </button>
              <button
                onClick={() => setShowOrderForm(false)}
                className="w-full rounded-xl py-2 text-sm text-gray-500 hover:text-gray-700 transition"
              >
                Geri dön
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowOrderForm(true)}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700"
            >
              Sipariş Ver <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
