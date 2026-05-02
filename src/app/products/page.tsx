"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, ArrowRight, Package, Tag } from "lucide-react";
import api from "@/lib/api";
import { ApiResponse, PageResponse, Product, Category } from "@/types";
import ProductCard from "@/components/product/ProductCard";

const CATEGORY_ICONS: Record<string, string> = {
  "Electronics": "💻",
  "Clothing": "👗",
  "Books": "📚",
  "Home & Garden": "🏠",
  "Sports": "⚽",
};

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [page, setPage] = useState(0);

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Category[]>>("/api/categories");
      return data.data;
    },
    staleTime: Infinity,
  });

  const { data, isLoading } = useQuery<PageResponse<Product>>({
    queryKey: ["products", search, selectedCategory, page],
    queryFn: async () => {
      let endpoint: string;
      if (search) {
        endpoint = `/api/products/search?q=${encodeURIComponent(search)}&page=${page}&size=12`;
      } else if (selectedCategory) {
        endpoint = `/api/products/category/${selectedCategory}?page=${page}&size=12`;
      } else {
        endpoint = `/api/products?page=${page}&size=12`;
      }
      const { data } = await api.get<ApiResponse<PageResponse<Product>>>(endpoint);
      return data.data;
    },
  });

  const handleSearch = () => {
    setSearch(input.trim());
    setSelectedCategory(null);
    setPage(0);
  };

  const handleCategory = (id: number | null) => {
    setSelectedCategory(id);
    setInput("");
    setSearch("");
    setPage(0);
  };

  const activeCategory = categories?.find((c) => c.id === selectedCategory);

  return (
    <div>
      {/* Search header */}
      <section className="border-b border-gray-100 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-6 text-2xl font-black text-gray-900">Ürünler</h1>

          <div className="flex overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-400/20 transition-all">
            <div className="flex flex-1 items-center gap-3 px-5">
              <Search className="h-5 w-5 shrink-0 text-gray-400" />
              <input
                type="text"
                placeholder="Ürün ara..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 bg-transparent py-3.5 text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
              {input && (
                <button
                  onClick={() => { setInput(""); setSearch(""); setPage(0); }}
                  className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                >
                  ×
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              className="m-2 flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Ara <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Category filter */}
          {categories && categories.length > 0 && (
            <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <button
                onClick={() => handleCategory(null)}
                className={`flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  selectedCategory === null && !search
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Tag className="h-3.5 w-3.5" />
                Tümü
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategory(cat.id)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    selectedCategory === cat.id
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <span>{CATEGORY_ICONS[cat.name] ?? "🏷️"}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Products grid */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {search
                ? `"${search}" için sonuçlar`
                : activeCategory
                ? activeCategory.name
                : "Tüm Ürünler"}
            </h2>
            {data && (
              <p className="mt-0.5 text-sm text-gray-500">{data.totalElements} ürün</p>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="h-52 animate-pulse bg-gray-100" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-3/4 animate-pulse rounded-full bg-gray-100" />
                  <div className="h-3 w-full animate-pulse rounded-full bg-gray-100" />
                  <div className="mt-4 h-10 w-full animate-pulse rounded-xl bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        ) : data?.content.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100">
              <Package className="h-10 w-10 text-gray-300" />
            </div>
            <p className="text-lg font-semibold text-gray-900">Ürün bulunamadı</p>
            <p className="text-sm text-gray-500">Farklı bir arama terimi veya kategori deneyin</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data?.content.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-40"
            >
              ← Önceki
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(data.totalPages, 5) }, (_, i) => {
                const p = page < 3 ? i : page - 2 + i;
                if (p >= data.totalPages) return null;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`h-9 w-9 rounded-lg text-sm font-medium transition ${
                      p === page ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {p + 1}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={data.last}
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-40"
            >
              Sonraki →
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
