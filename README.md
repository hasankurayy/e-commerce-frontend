# E-Commerce Frontend

Next.js 15 ile geliştirilmiş e-ticaret arayüzü.

Canlı demo: **[n55-frontend.vercel.app](https://n55-frontend.vercel.app)**  
Backend repo: **[e-commerce-backend](https://github.com/hasankurayy/e-commerce-backend)**

---

## Test Kartı (Iyzico Sandbox)

| Alan | Değer |
|------|-------|
| Kart No | `5528790000000008` |
| Son Kullanma | `12/30` |
| CVV | `123` |
| 3D Şifre | `a` |

---

## Teknolojiler

| | |
|--|--|
| Framework | Next.js 15 (App Router) |
| State | Zustand (auth + cart, localStorage persist) |
| Server State | TanStack React Query |
| HTTP | Axios (JWT interceptor + auto refresh) |
| Stil | Tailwind CSS v4 |
| Bildirimler | Sonner |

---

## Sayfalar

| Route | Açıklama |
|-------|----------|
| `/` | Landing page |
| `/products` | Ürün listeleme — arama, kategori filtresi, pagination |
| `/products/[id]` | Ürün detay |
| `/cart` | Sepet yönetimi |
| `/orders` | Sipariş geçmişi |
| `/payment/[orderId]` | Iyzico ödeme formu |

---

## Lokal Kurulum

```bash
npm install
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:8080
npm run dev                   # http://localhost:3001
```
