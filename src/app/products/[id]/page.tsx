"use client";
import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ShoppingCart, ArrowLeft, Package, Flame, CheckCircle, Tag, Star, Mail } from "lucide-react";
import api from "@/lib/api";
import { ApiResponse, Product, ReviewSummary } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useAddToCart } from "@/hooks/useCart";
import { useAuthStore } from "@/store/auth.store";
import Link from "next/link";

function StarDisplay({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const s = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${s} ${i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
        />
      ))}
    </span>
  );
}

function ReviewPopover({ summary }: { summary: ReviewSummary }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (summary.totalCount === 0) return null;

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-xl border border-gray-100 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
      >
        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        {summary.averageRating.toFixed(1)}
        <span className="text-gray-400">({summary.totalCount})</span>
        <span className="ml-1 text-xs text-gray-400">Son 5 değerlendirme {open ? "↑" : "↓"}</span>
      </button>

      {open && summary.last5.length > 0 && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-80 rounded-2xl border border-gray-100 bg-white p-3 shadow-xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Son 5 Değerlendirme
          </p>
          <div className="space-y-2">
            {summary.last5.map((r) => (
              <div key={r.id} className="flex items-start justify-between gap-2 rounded-xl bg-gray-50 px-3 py-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold text-gray-800">{r.userName}</span>
                    <StarDisplay rating={r.rating} />
                  </div>
                  {r.comment && (
                    <p className="mt-0.5 truncate text-xs text-gray-500">{r.comment}</p>
                  )}
                </div>
                <a
                  href={`mailto:${r.userEmail}?subject=Değerlendirmeniz hakkında&body=Merhaba ${r.userName},%0A%0ADeğerlendirmeniz için teşekkür ederiz!`}
                  className="shrink-0 rounded-lg p-1.5 text-gray-400 transition hover:bg-indigo-50 hover:text-indigo-600"
                  title={`${r.userEmail} adresine mail gönder`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Mail className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { mutate: addToCart, isPending } = useAddToCart();

  const { data: product, isLoading, isError } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Product>>(`/api/products/${id}`);
      return data.data;
    },
  });

  const { data: reviewSummary } = useQuery<ReviewSummary>({
    queryKey: ["review-summary", id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<ReviewSummary>>(
        `/api/products/${id}/reviews/summary`
      );
      return data.data;
    },
  });

  const handleAdd = () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    addToCart({ productId: Number(id), quantity: 1 });
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="h-96 animate-pulse rounded-2xl bg-gray-100" />
          <div className="space-y-4">
            <div className="h-6 w-1/3 animate-pulse rounded-full bg-gray-100" />
            <div className="h-8 w-2/3 animate-pulse rounded-full bg-gray-100" />
            <div className="h-4 w-full animate-pulse rounded-full bg-gray-100" />
            <div className="h-4 w-5/6 animate-pulse rounded-full bg-gray-100" />
            <div className="mt-6 h-12 w-full animate-pulse rounded-xl bg-gray-100" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100">
          <Package className="h-10 w-10 text-gray-300" />
        </div>
        <p className="text-lg font-semibold text-gray-900">Ürün bulunamadı</p>
        <Link href="/products" className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700">
          Ürünlere Dön
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2 text-sm text-gray-400">
        <Link href="/products" className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Ürünler
        </Link>
        <span>/</span>
        {product.categoryName && (
          <>
            <span className="text-gray-500">{product.categoryName}</span>
            <span>/</span>
          </>
        )}
        <span className="truncate text-gray-700 font-medium">{product.name}</span>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Image */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-50 shadow-sm">
          <div className="flex h-80 items-center justify-center lg:h-[420px]">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <Package className="h-32 w-32 text-indigo-100" />
            )}
          </div>

          {isLowStock && (
            <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-orange-500 px-3 py-1.5 text-sm font-semibold text-white shadow">
              <Flame className="h-3.5 w-3.5" />
              Son {product.stock} adet
            </div>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
              <span className="rounded-full bg-white px-5 py-2 text-sm font-bold text-gray-500 shadow ring-1 ring-gray-200">
                Stok Tükendi
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          {product.categoryName && (
            <div className="mb-3 flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-indigo-400" />
              <span className="text-sm font-medium text-indigo-600">{product.categoryName}</span>
            </div>
          )}

          <h1 className="text-3xl font-black leading-snug text-gray-900">{product.name}</h1>

          {/* Rating */}
          {reviewSummary && (
            <div className="mt-2">
              {reviewSummary.totalCount > 0 ? (
                <ReviewPopover summary={reviewSummary} />
              ) : (
                <span className="text-xs text-gray-400">Henüz değerlendirme yok</span>
              )}
            </div>
          )}

          <p className="mt-4 leading-relaxed text-gray-500">{product.description}</p>

          {/* Stock status */}
          <div className="mt-5">
            {isOutOfStock ? (
              <span className="text-sm font-medium text-red-500">Stok yok</span>
            ) : (
              <div className="flex items-center gap-1.5 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">Stokta var</span>
                <span className="text-gray-400">({product.stock} adet)</span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="mt-6 rounded-2xl bg-gray-50 px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Fiyat</p>
            <p className="mt-1 text-4xl font-black text-gray-900">{formatPrice(product.price)}</p>
            <p className="mt-1 text-sm text-green-600 font-medium">Ücretsiz kargo</p>
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-3">
            <button
              onClick={handleAdd}
              disabled={isPending || isOutOfStock}
              className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-indigo-600 px-6 py-4 text-base font-bold text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ShoppingCart className="h-5 w-5" />
              {isPending ? "Ekleniyor..." : isOutOfStock ? "Stok Tükendi" : "Sepete Ekle"}
            </button>
            <Link
              href="/products"
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 py-3.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Alışverişe Devam Et
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
