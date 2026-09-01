# 🎨 Study Case: Front End — Customer App

## 1. Tujuan (Objective)

Kamu akan membangun **website e-commerce kopi dari sisi pembeli (customer)** — tempat orang bisa lihat-lihat produk, masukin ke keranjang, checkout, bayar, dan kasih review. Tapi bukan sekadar tampilan statis: **semua data harus benar-benar datang dari API asli** yang sudah disediakan mentor (bukan data dummy/hardcode).

Kenapa begini? Karena inti dari latihan ini adalah **belajar menghubungkan Front End ke REST API sungguhan**, meliputi:
- Login/register dan menyimpan sesi user (token).
- Menampilkan data dari API (list, detail, pagination).
- Mengirim data ke API (tambah ke cart, checkout, review, dll) dan menangani hasilnya (sukses/gagal).
- Mengatur state aplikasi (misal: isi cart harus konsisten di seluruh halaman).

Singkatnya: **kalau backend mati atau di-restart, data yang kamu tampilkan juga ikut berubah** — karena semuanya live dari API, bukan dari file JSON lokal.

---

## 2. Yang Disediakan

- **API:** `<link Render — menyusul>`
- **Swagger:** `<link Swagger — menyusul>`
- **Figma:** `<link Figma — menyusul>`

Cek Swagger untuk detail tiap endpoint (parameter, request body, contoh response) — kalau bingung endpoint mana ngapain, itu sumber kebenaran utama kamu. Figma jadi acuan tampilan begitu sudah rilis; sebelum itu, ikuti daftar fitur di bagian 6.

---

## 3. Kamu Berperan Sebagai: **Customer**

Bayangkan kamu user biasa yang belanja kopi online. Kamu akan register/login sebagai role `CUSTOMER`, dan **tidak akan pernah** punya akses admin di tugas ini — semua fitur yang kamu bangun murni dari kacamata pembeli.

---

## 4. Tech Stack

| Kategori | Ketentuan |
|---|---|
| Framework | **React** atau **Next.js** — pilih salah satu |
| Bahasa | **JavaScript** atau **TypeScript** — bebas |
| Styling | **WAJIB TailwindCSS** |
| State Management | Bebas (Redux, Zustand, Context API, Jotai, dll) |
| Data Fetching | Bebas (TanStack Query, SWR, Axios, `fetch` native, dll) |
| Desain | Menyusul (Figma) — sementara implementasikan sesuai daftar fitur di bagian 6 |

**Jangan hardcode base URL API** — taruh di environment variable (`.env`) supaya gampang diganti nanti.

---

## 5. Endpoint yang Boleh & Tidak Boleh Dipakai

API-nya sendiri sebenarnya punya lebih banyak endpoint dari yang kamu butuhkan (ada bagian untuk admin toko, ada juga bagian untuk dashboard internal). Supaya jelas, endpoint dibagi 3 kelompok:

### ✅ Wajib dipakai — ini yang jadi fitur aplikasi kamu

**Auth**
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

**Katalog (read-only)**
- `GET /coffee-categories`, `GET /coffee-categories/:id`
- `GET /coffees`, `GET /coffees/:id` (mendukung pagination/search/filter/sort — cek Swagger)
- `GET /coffee-images`, `GET /coffee-images/:id`

**Favorites**
- `POST /favorites`, `GET /favorites`, `DELETE /favorites/:id`

**Reviews**
- `GET /reviews`, `GET /reviews/product/:productId`
- `POST /reviews`, `PATCH /reviews/:id`, `DELETE /reviews/:id`

**Cart**
- `POST /cart`, `GET /cart`, `GET /cart/:id`, `PATCH /cart/:id`, `DELETE /cart/:id`

**Orders**
- `POST /orders/checkout`
- `GET /orders`, `GET /orders/:id`

**Payments**
- `POST /payments`, `GET /payments`, `GET /payments/:id`

### ⛔ Tidak boleh dipakai (khusus admin toko, di luar peran kamu)

- `POST` / `PATCH` / `DELETE` `/coffees`
- `POST` / `PATCH` / `DELETE` `/coffee-categories`
- `POST` / `PATCH` / `DELETE` `/coffee-images`
- `PATCH /orders/:id/status`
- `PATCH /payments/:id/status`
- Semua endpoint `/order-status-history/*`
- Semua endpoint `/audit-logs/*`

### ⏭️ Diabaikan (bukan urusan kamu sama sekali)

- `GET /health`, `GET /stats`, `GET /monitoring`, `GET /activities`
- Semua endpoint `/public/*`

---

## 6. Fitur yang Harus Ada

1. **Autentikasi**
   - User bisa register akun baru.
   - User bisa login, dan sesudah login token tersimpan supaya request selanjutnya otomatis terautentikasi.
   - Ada cara untuk logout (hapus token dari sisi client).
   - Halaman/route yang butuh login (cart, favorit, checkout, dll) tidak bisa diakses kalau belum login — redirect ke login.

2. **Katalog Produk**
   - User bisa lihat daftar kategori kopi.
   - User bisa lihat daftar produk (dengan pagination, karena API-nya paginated).
   - User bisa lihat detail 1 produk, termasuk gambar-gambarnya dan review yang sudah ada.
   - (Opsional tapi disarankan) User bisa cari/filter produk sesuai parameter yang didukung API.

3. **Favorit**
   - User bisa menandai/membatalkan produk sebagai favorit dari halaman produk.
   - User bisa lihat daftar produk favoritnya.

4. **Keranjang Belanja**
   - User bisa menambahkan produk ke cart (dengan jumlah/quantity).
   - User bisa lihat isi cart beserta total harga.
   - User bisa ubah jumlah item di cart.
   - User bisa hapus item dari cart.

5. **Checkout & Order**
   - User bisa checkout dari isi cart-nya menjadi sebuah order.
   - User bisa lihat riwayat order-nya.
   - User bisa lihat detail 1 order (item apa saja, total, status).

6. **Pembayaran**
   - Setelah order dibuat, user bisa membuat pembayaran untuk order tersebut.
   - User bisa lihat status pembayarannya.

7. **Review**
   - User bisa memberi review (rating + komentar) untuk sebuah produk.
   - User bisa mengedit/menghapus review miliknya sendiri.
   - User bisa melihat review-review produk lain (punya user lain).

8. **Penanganan Umum**
   - Setiap request ke API harus menangani kondisi: *loading*, *sukses*, dan *error* — jangan biarkan UI diam/blank saat gagal atau lama.
   - Validasi input dasar di form sebelum dikirim ke API (misal: email harus format email, password tidak boleh kosong, quantity harus > 0, dll).
   - Tampilkan pesan error yang informatif ke user (bukan menampilkan raw JSON error).

---

## 7. Catatan Teknis: Bentuk Response API

Supaya gampang bikin API client/helper generik, semua response dari API mengikuti pola konsisten:

**Sukses:**
```json
{ "success": true, "message": "opsional", "data": { } }
```
Untuk list dengan pagination (contoh: `GET /coffees`), ada tambahan `meta`:
```json
{ "success": true, "meta": { "page": 1, "limit": 10, "total": 42, "totalPages": 5 }, "data": [] }
```

**Error:**
```json
{
  "success": false,
  "statusCode": 400,
  "error": "Bad Request",
  "message": "pesan error di sini",
  "timestamp": "...",
  "path": "/endpoint"
}
```

Auth pakai **Bearer token** (JWT) di header `Authorization: Bearer <token>`, didapat dari response `POST /auth/login`.

---

## 8. Deliverables

- [ ] Source code di repository (GitHub/GitLab), history commit yang wajar (bukan 1 commit besar).
- [ ] `README.md` project kamu sendiri: cara install & run, environment variable yang dibutuhkan.
- [ ] (Opsional, nilai plus) Link deploy (Vercel/Netlify/dll).

---

## 9. Kriteria Penilaian

| No | Kriteria | Bobot |
|---|---|---|
| 1 | **Kelengkapan integrasi endpoint wajib** — semua endpoint di bagian 5 (✅) terpakai dan berfungsi | 35% |
| 2 | **Auth & proteksi akses** — login/register/logout benar, token tersimpan & terpakai otomatis, route yang butuh login benar-benar terproteksi | 15% |
| 3 | **Arsitektur, state management & kualitas kode** — struktur folder jelas, pemisahan concern, penamaan konsisten | 20% |
| 4 | **UI/UX & penanganan loading/error/empty state** — rapi, responsif, tidak ada UI diam/blank saat loading/gagal | 20% |
| 5 | **Kepatuhan scope** — tidak menyentuh endpoint di bagian 5 (⛔) | 10% |
| | **Total** | **100%** |

**Catatan penalti:** penggunaan endpoint yang dilarang (⛔) akan mengurangi nilai pada poin 1 dan 5, meskipun secara teknis endpoint tersebut "berhasil" dipanggil.

---

## 10. FAQ Singkat

**Q: Boleh pakai UI library (shadcn/ui, MUI, dll) di atas Tailwind?**

A: Boleh, selama tetap pakai TailwindCSS sebagai basisnya.

**Q: Kalau butuh data awal (misal katalog kosong), gimana?**

A: Data katalog sudah di-seed oleh mentor — kamu tinggal konsumsi lewat endpoint `GET` yang tersedia untuk customer.

**Q: Boleh coding diluar design Figma yang sudah jadi?**

A: Ya, namun Styling detail menyesuaikan dengan konsep Figma. Jadi maksudnya boleh menambahkan design lain tapi jangan jauh2 dari design figma ya

**Q: Kalau API lagi error/down pas development, gimana?**

A: Cek dulu langsung lewat Swagger (tombol "Try it out"). Kalau memang API-nya down, infokan ke mentor.

**Q: Perlu bikin unit test juga?**

A: Tidak wajib untuk tugas ini — fokus utamanya ke fungsi dan integrasi API sesuai bagian 5 & 6.

---

Selamat mengerjakan! 🚀
