# E-Commerce Frontend

Next.js 16 ile geliştirilmiş e-ticaret arayüzü.

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

## Ek Özellikler

### Sipariş Durum Takibi
Siparişler sayfasında her sipariş kartı açıldığında görsel bir ilerleme çubuğu gösterilir:

```
Ödendi → Hazırlanıyor → Kargoda → Teslim Edildi
```

Tamamlanan aşamalar dolu mor, aktif aşama çerçeveli, gelecek aşamalar gri renkte gösterilir. Durum geçişleri backend tarafından otomatik olarak her dakika ilerletilir.

### Ürün Değerlendirme Sistemi
- **Siparişler sayfası:** Teslim edilmiş (`DELIVERED`) siparişlerdeki her ürün için yıldız derecelendirme widget'ı çıkar. Yıldıza tıklanınca değerlendirme anında gönderilir. Daha önce değerlendirilmişse readonly yıldız + "Değerlendirdiniz" etiketi gösterilir.
- **Ürün detay sayfası:** Ortalama puan ve değerlendirme sayısı badge olarak gösterilir. Badge'e tıklanınca son 5 değerlendiriciyi gösteren popup açılır; her satırda kullanıcı adı, yıldız puanı ve yanında bir **mail ikonu** bulunur. Mail ikonuna tıklanınca `mailto:` protokolü ile mail uygulaması açılır ve ilgili kullanıcıya direkt mesaj yazılabilir.

---

## Sayfalar

| Route | Açıklama |
|-------|----------|
| `/` | Landing page — giriş yapılıysa hoş geldin mesajı |
| `/products` | Ürün listeleme — arama, kategori filtresi, pagination |
| `/products/[id]` | Ürün detay — puan özeti, son 5 değerlendirici popup'ı |
| `/cart` | Sepet yönetimi |
| `/orders` | Sipariş geçmişi — durum timeline, ürün değerlendirme |
| `/payment/[orderId]` | Iyzico ödeme formu |

---

## Teknolojiler

| | |
|--|--|
| Framework | Next.js 16 (App Router) |
| State | Zustand (auth + cart, localStorage persist) |
| Server State | TanStack React Query |
| HTTP | Axios (JWT interceptor + auto refresh) |
| Stil | Tailwind CSS v4 |
| Bildirimler | Sonner |

---

## Lokal Kurulum

```bash
npm install
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:8080
npm run dev                   # http://localhost:3001
```
