"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Package, ChevronDown, ChevronUp,
  Clock, CheckCircle, XCircle, Truck, MapPin, Tag, Star
} from "lucide-react";
import api from "@/lib/api";
import { ApiResponse, PageResponse, Order, OrderStatus, ReviewSummary } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import Link from "next/link";

const statusConfig: Record<OrderStatus, { label: string; bg: string; text: string; dot: string }> = {
  PENDING_PAYMENT:    { label: "Ödeme Bekleniyor", bg: "bg-amber-50",   text: "text-amber-700",  dot: "bg-amber-400" },
  PAYMENT_PROCESSING: { label: "Ödeme İşleniyor",  bg: "bg-blue-50",    text: "text-blue-700",   dot: "bg-blue-400" },
  PAYMENT_FAILED:     { label: "Ödeme Başarısız",  bg: "bg-red-50",     text: "text-red-700",    dot: "bg-red-400" },
  PAID:               { label: "Ödendi",            bg: "bg-indigo-50",  text: "text-indigo-700", dot: "bg-indigo-500" },
  PROCESSING:         { label: "Hazırlanıyor",      bg: "bg-purple-50",  text: "text-purple-700", dot: "bg-purple-500" },
  SHIPPED:            { label: "Kargoda",           bg: "bg-sky-50",     text: "text-sky-700",    dot: "bg-sky-500" },
  DELIVERED:          { label: "Teslim Edildi",     bg: "bg-green-50",   text: "text-green-700",  dot: "bg-green-500" },
  REFUND_REQUESTED:   { label: "İade Talebi",       bg: "bg-orange-50",  text: "text-orange-700", dot: "bg-orange-400" },
  REFUNDED:           { label: "İade Edildi",       bg: "bg-gray-50",    text: "text-gray-600",   dot: "bg-gray-400" },
  CANCELLED:          { label: "İptal Edildi",      bg: "bg-red-50",     text: "text-red-600",    dot: "bg-red-400" },
};

const TRACKING_STEPS: { status: OrderStatus; label: string; icon: React.ElementType }[] = [
  { status: "PAID",       label: "Ödendi",          icon: CheckCircle },
  { status: "PROCESSING", label: "Hazırlanıyor",     icon: Package },
  { status: "SHIPPED",    label: "Kargoda",          icon: Truck },
  { status: "DELIVERED",  label: "Teslim Edildi",    icon: CheckCircle },
];

const TRACKING_STATUSES = new Set<OrderStatus>(["PAID", "PROCESSING", "SHIPPED", "DELIVERED"]);

function OrderTimeline({ status }: { status: OrderStatus }) {
  if (!TRACKING_STATUSES.has(status)) return null;
  const currentIdx = TRACKING_STEPS.findIndex((s) => s.status === status);

  return (
    <div className="mb-4 rounded-xl border border-gray-100 bg-white px-4 py-4">
      <div className="relative flex items-start justify-between">
        <div className="absolute left-0 right-0 top-4 mx-auto h-0.5 bg-gray-100" style={{ left: "calc(12.5%)", right: "calc(12.5%)" }} />
        {TRACKING_STEPS.map((step, idx) => {
          const done = idx < currentIdx;
          const active = idx === currentIdx;
          const Icon = step.icon;
          return (
            <div key={step.status} className="relative z-10 flex flex-1 flex-col items-center gap-1.5">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
                done    ? "border-indigo-500 bg-indigo-500 text-white" :
                active  ? "border-indigo-500 bg-white text-indigo-600 shadow-sm shadow-indigo-200" :
                          "border-gray-200 bg-white text-gray-300"
              }`}>
                <Icon className="h-4 w-4" />
              </div>
              <span className={`text-center text-[11px] font-medium leading-tight ${
                active ? "text-indigo-600" : done ? "text-gray-700" : "text-gray-400"
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProductRating({ productId }: { productId: number }) {
  const queryClient = useQueryClient();
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");

  const { data: summary } = useQuery<ReviewSummary>({
    queryKey: ["review-summary", productId],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<ReviewSummary>>(
        `/api/products/${productId}/reviews/summary`
      );
      return data.data;
    },
  });

  const { mutate: submitReview, isPending } = useMutation({
    mutationFn: (rating: number) =>
      api.post(`/api/products/${productId}/reviews`, { rating, comment: comment || undefined }),
    onSuccess: () => {
      toast.success("Değerlendirmeniz kaydedildi!");
      queryClient.invalidateQueries({ queryKey: ["review-summary", productId] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Değerlendirme gönderilemedi");
    },
  });

  const myReview = summary?.myReview;

  if (myReview) {
    return (
      <div className="mt-1.5 flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} className={`h-4 w-4 ${i <= myReview.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} />
        ))}
        <span className="text-xs text-gray-400">Değerlendirdiniz</span>
      </div>
    );
  }

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            disabled={isPending}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => submitReview(i)}
            className="transition-transform hover:scale-110 disabled:opacity-50"
          >
            <Star className={`h-5 w-5 ${i <= hovered ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} />
          </button>
        ))}
        <span className="ml-1 text-xs text-gray-400">Değerlendir</span>
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);
  const s = statusConfig[order.status];

  return (
    <div className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow ${open ? "shadow-md" : "hover:shadow-md"}`}>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-gray-50/50"
      >
        {/* Left */}
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <Package className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900">Sipariş #{order.id}</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-400">
              <Clock className="h-3 w-3" />
              {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex shrink-0 items-center gap-3">
          <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${s.bg} ${s.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
            {s.label}
          </span>
          <span className="hidden font-bold text-gray-900 sm:block">{formatPrice(order.totalAmount)}</span>
          {open
            ? <ChevronUp className="h-4 w-4 text-gray-400" />
            : <ChevronDown className="h-4 w-4 text-gray-400" />
          }
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-50 bg-gray-50/30 px-5 py-5">
          <OrderTimeline status={order.status} />
          {/* Items */}
          <div className="mb-4 divide-y divide-gray-100 rounded-xl border border-gray-100 bg-white overflow-hidden">
            {order.items.map((item, i) => (
              <div key={i} className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-400">
                      {item.productName.charAt(0)}
                    </div>
                    <span className="text-sm text-gray-700">
                      {item.productName}
                      <span className="ml-1.5 text-gray-400">×{item.quantity}</span>
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{formatPrice(item.subtotal)}</span>
                </div>
                {order.status === "DELIVERED" && (
                  <div className="ml-11">
                    <ProductRating productId={item.productId} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Meta */}
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2 text-gray-600">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
              <span>{order.shippingAddress}</span>
            </div>
            {order.trackingNumber && (
              <div className="flex items-center gap-2 text-gray-600">
                <Tag className="h-4 w-4 shrink-0 text-gray-400" />
                <span>Takip: <span className="font-mono font-medium text-gray-900">{order.trackingNumber}</span></span>
              </div>
            )}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2 font-semibold text-gray-900">
                <span className="text-gray-500 font-normal">Toplam:</span>
                {formatPrice(order.totalAmount)}
              </div>
              {order.status === "DELIVERED" && (
                <div className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  Teslim Edildi
                </div>
              )}
              {(order.status === "CANCELLED" || order.status === "PAYMENT_FAILED") && (
                <div className="flex items-center gap-1.5 text-sm font-medium text-red-500">
                  <XCircle className="h-4 w-4" />
                  {statusConfig[order.status].label}
                </div>
              )}
              {order.status === "SHIPPED" && (
                <div className="flex items-center gap-1.5 text-sm font-medium text-sky-600">
                  <Truck className="h-4 w-4" />
                  Kargoda
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PaymentResultToast() {
  const searchParams = useSearchParams();
  useEffect(() => {
    const p = searchParams.get("payment");
    if (p === "success") toast.success("Ödeme başarılı! Siparişiniz onaylandı.");
    if (p === "failed")  toast.error("Ödeme başarısız. Tekrar deneyebilirsiniz.");
    if (p === "error")   toast.error("Ödeme işlemi sırasında hata oluştu.");
  }, [searchParams]);
  return null;
}

export default function OrdersPage() {
  const { isAuthenticated } = useAuthStore();
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery<PageResponse<Order>>({
    queryKey: ["orders", page],
    enabled: isAuthenticated,
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PageResponse<Order>>>(
        `/api/orders?page=${page}&size=10`
      );
      return data.data;
    },
  });

  if (!isAuthenticated) {
    return (
      <>
        <Suspense fallback={null}><PaymentResultToast /></Suspense>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 px-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100">
            <Package className="h-10 w-10 text-gray-300" />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">Siparişlerinizi görmek için giriş yapın</p>
            <p className="mt-1 text-sm text-gray-500">Geçmiş siparişlerinizi takip edin</p>
          </div>
          <Link href="/auth/login" className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition">
            Giriş Yap
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
    <Suspense fallback={null}><PaymentResultToast /></Suspense>
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Siparişlerim</h1>
        {data && (
          <p className="mt-1 text-sm text-gray-500">{data.totalElements} sipariş</p>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      ) : data?.content.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-24 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100">
            <Package className="h-10 w-10 text-gray-300" />
          </div>
          <p className="text-lg font-semibold text-gray-900">Henüz siparişiniz yok</p>
          <p className="text-sm text-gray-500">İlk siparişinizi oluşturmak için alışverişe başlayın</p>
          <Link href="/" className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition">
            Alışverişe Başla
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {data?.content.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>

          {data && data.totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-40"
              >
                ← Önceki
              </button>
              <span className="rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700">
                {page + 1} / {data.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={data.last}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-40"
              >
                Sonraki →
              </button>
            </div>
          )}
        </>
      )}
    </div>
    </>
  );
}
