# Toko Dinal - Fullstack Headless E-Commerce 🍔

Proyek ini adalah solusi E-Commerce modern yang menggunakan arsitektur **Headless**. Terbagi menjadi dua aplikasi terpisah yang saling terhubung:
1.  **Admin Dashboard (CMS):** Untuk mengelola produk, kategori, dan toko.
2.  **Storefront (Frontend):** Tampilan website untuk pembeli.

## 🚀 Teknologi yang Digunakan

### Backend / Admin (Root Folder)
* **Framework:** Next.js 15 (App Router)
* **Language:** TypeScript
* **Database:** MySQL (via Prisma ORM)
* **Auth:** Clerk Authentication
* **Storage:** Cloudinary (untuk gambar produk)
* **Styling:** Tailwind CSS + Shadcn UI

### Frontend / Store (Folder `/frontend`)
* **Framework:** Next.js 16
* **Styling:** Tailwind CSS
* **Data Fetching:** Native Fetch API (Server Side Rendering)

---

## 🛠️ Cara Menjalankan Project (Localhost)

Karena ini adalah *Monorepo* (dua aplikasi dalam satu folder), Anda perlu menjalankan dua terminal.

### 1. Jalankan Admin Dashboard (Port 3000)
Ini adalah "Dapur" tempat Anda input data produk.

```bash
# Install dependencies
npm install

# Setup Database (Pastikan .env sudah diisi)
npx prisma generate
npx prisma db push

# Jalankan Server
npm run dev
