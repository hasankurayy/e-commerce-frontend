"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CreditCard, Lock, CheckCircle, XCircle, RefreshCw, ShieldCheck } from "lucide-react";
import api from "@/lib/api";
import { ApiResponse } from "@/types";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

interface IyzicoInitResponse {
  paymentId: number;
  token: string;
  checkoutFormContent: string;
  paymentPageUrl: string;
  amount: number;
}

export default function PaymentPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();
  const formContainerRef = useRef<HTMLDivElement>(null);

  const [initData, setInitData] = useState<IyzicoInitResponse | null>(null);
  const [orderAmount, setOrderAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "failed">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const { data: orderData } = await api.get<ApiResponse<{ totalAmount: number }>>(
          `/api/orders/${orderId}`
        );
        const amount = orderData.data.totalAmount;
        setOrderAmount(amount);

        const { data } = await api.post<ApiResponse<IyzicoInitResponse>>("/api/payments/initiate", {
          orderId: Number(orderId),
          amount,
        });
        setInitData(data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Ödeme başlatılamadı");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [orderId]);

  // Iyzico inline form'u DOM'a enjekte et — React innerHTML script execute etmez
  useEffect(() => {
    if (!initData?.checkoutFormContent || !formContainerRef.current) return;

    const container = formContainerRef.current;
    container.innerHTML = initData.checkoutFormContent;

    Array.from(container.querySelectorAll("script")).forEach((oldScript) => {
      const newScript = document.createElement("script");
      if (oldScript.src) {
        newScript.src = oldScript.src;
        newScript.async = false;
      } else {
        newScript.textContent = oldScript.textContent ?? "";
      }
      document.head.appendChild(newScript);
    });
  }, [initData]);

  const checkPaymentResult = async () => {
    if (!initData?.token) return;
    setChecking(true);
    try {
      const { data } = await api.get<ApiResponse<any>>(`/api/payments/result/${initData.token}`);
      const status = data.data?.status;
      if (status === "COMPLETED") {
        setPaymentStatus("success");
        toast.success("Ödeme başarılı! Siparişiniz onaylandı.");
        setTimeout(() => router.push("/orders"), 2000);
      } else if (status === "FAILED") {
        setPaymentStatus("failed");
        toast.error("Ödeme başarısız. Kart bilgilerini kontrol edin.");
      } else {
        toast.info("Ödeme henüz tamamlanmadı. Formu doldurup tekrar deneyin.");
      }
    } catch {
      toast.error("Sonuç sorgulanamadı, tekrar deneyin.");
    } finally {
      setChecking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-gray-500">Ödeme formu hazırlanıyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <XCircle className="h-12 w-12 text-red-400" />
        <p className="text-lg font-semibold text-gray-900">Ödeme başlatılamadı</p>
        <p className="text-sm text-gray-500">{error}</p>
        <Link href="/orders" className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition">
          Siparişlerime Dön
        </Link>
      </div>
    );
  }

  if (paymentStatus === "success") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 px-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">Ödeme Başarılı!</p>
          <p className="mt-2 text-sm text-gray-500">Siparişiniz onaylandı. Yönlendiriliyorsunuz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50">
          <CreditCard className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Güvenli Ödeme</h1>
          <p className="text-sm text-gray-500">
            Sipariş #{orderId}
            {orderAmount && (
              <span className="ml-2 font-semibold text-gray-900">{formatPrice(orderAmount)}</span>
            )}
          </p>
        </div>
      </div>

      {/* Iyzico Form */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-gray-50 px-5 py-3.5">
          <Lock className="h-4 w-4 text-green-500" />
          <span className="text-xs font-medium text-gray-500">Iyzico ile SSL korumalı ödeme</span>
          <ShieldCheck className="ml-auto h-4 w-4 text-indigo-400" />
        </div>

        {/* Iyzico inline form render edilir */}
        <div ref={formContainerRef} className="min-h-[380px] p-2" />
      </div>

      {/* Sandbox test kartı */}
      <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3.5">
        <p className="mb-2 text-sm font-semibold text-amber-800">🧪 Sandbox Test Kartı</p>
        <div className="space-y-1 font-mono text-xs text-amber-700">
          <p>Kart No: <strong>5528790000000008</strong></p>
          <p>Son Kullanma: <strong>12/30</strong> &nbsp;·&nbsp; CVV: <strong>123</strong></p>
          <p>Ad Soyad: <strong>Test User</strong></p>
        </div>
      </div>

      {/* Ödemeyi Doğrula */}
      <div className="mt-5 space-y-3">
        <button
          onClick={checkPaymentResult}
          disabled={checking}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${checking ? "animate-spin" : ""}`} />
          {checking ? "Kontrol ediliyor..." : "Ödemeyi Doğrula"}
        </button>

        {paymentStatus === "failed" && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            <XCircle className="h-4 w-4 shrink-0" />
            Ödeme başarısız. Kart bilgilerini kontrol edip tekrar deneyin.
          </div>
        )}

        <Link href="/orders" className="block text-center text-sm text-gray-400 hover:text-gray-600 transition">
          Siparişlerime dön
        </Link>
      </div>
    </div>
  );
}
