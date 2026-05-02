"use client";
import { ShoppingCart, Package, Flame } from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useAddToCart } from "@/hooks/useCart";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { mutate: addToCart, isPending } = useAddToCart();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const handleAdd = () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    addToCart({ productId: product.id, quantity: 1 });
  };

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/70">
      {/* Clickable image area */}
      {/* Image */}
      <Link href={`/products/${product.id}`} className="relative h-52 overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-50 block">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package className="h-20 w-20 text-indigo-100 transition-colors group-hover:text-indigo-200" />
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <span className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-gray-500 shadow-sm ring-1 ring-gray-200">
              Stok Yok
            </span>
          </div>
        )}

        {isLowStock && (
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-orange-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
            <Flame className="h-3 w-3" />
            Son {product.stock} adet
          </div>
        )}

        {product.categoryName && !isLowStock && (
          <div className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-600 shadow-sm backdrop-blur-sm">
            {product.categoryName}
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex-1">
          <Link href={`/products/${product.id}`} className="font-semibold leading-snug text-gray-900 line-clamp-1 hover:text-indigo-600 transition-colors">
            {product.name}
          </Link>
          <p className="mt-1.5 min-h-[2.5rem] text-sm leading-relaxed text-gray-400 line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Fiyat</p>
            <p className="text-xl font-bold text-gray-900">{formatPrice(product.price)}</p>
          </div>
          {!isOutOfStock && (
            <p className="text-xs text-gray-400">{product.stock} adet</p>
          )}
        </div>

        <button
          onClick={handleAdd}
          disabled={isPending || isOutOfStock}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ShoppingCart className="h-4 w-4" />
          {isPending ? "Ekleniyor..." : "Sepete Ekle"}
        </button>
      </div>
    </div>
  );
}
