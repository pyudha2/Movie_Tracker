# TrackerList — Movie & Anime Tracker

Aplikasi web buat nge-track film dan anime yang mau/lagi/udah ditonton. User bisa cari judul, lihat detail, simpan ke watchlist pribadi, kasih rating, dan pantau progress lewat dashboard.

## Fitur

- **Auth** — Register & login pakai nama + password (NextAuth Credentials)
- **Browse Movie & Anime** — Search dan browse populer dari TMDB (Movie) dan Jikan/MyAnimeList (Anime)
- **Detail Page** — Sinopsis, genre, rating, dan info lengkap tiap judul
- **Watchlist** — Simpan judul ke 4 status: Plan to Watch, Watching, Completed, Dropped
- **Rating & Review** — Kasih rating pribadi buat judul yang udah selesai ditonton
- **Dashboard** — Statistik ringkas: total tracked, breakdown Movie/Anime, rata-rata rating, progress per status

## Tech Stack

| Kategori | Teknologi |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Database | MySQL + Prisma ORM v7 (`@prisma/adapter-mariadb`) |
| Auth | NextAuth.js (Credentials Provider) |
| State & Fetching | React Query (TanStack Query), Zustand |
| Form | React Hook Form + Zod |
| Data Eksternal | [TMDB API](https://www.themoviedb.org/documentation/api) (Movie), [Jikan API](https://jikan.moe/) (Anime) |
| Icon | Lucide React |
| Lainnya | Axios, React Hot Toast, use-debounce |

## Struktur Folder

```
app/
├── (auth)/
│   ├── login/
│   └── register/
├── api/
│   ├── auth/
│   ├── movies/
│   ├── watchlist/
│   └── dashboard/
├── (main)/
│   ├── detail/
│   │   ├── movie/[id]/
│   │   └── anime/[id]/
│   ├── watchlist/
│   └── dashboard/
├── page.tsx          # Browse page (halaman utama)
├── layout.tsx
└── providers.tsx

components/
├── Navbar.tsx
├── Footer.tsx
├── MovieCard.tsx
├── SearchBar.tsx
├── RatingStars.tsx
└── WatchlistButton.tsx

lib/
├── prisma.ts
├── auth.ts
├── tmdb.ts
└── jikan.ts

prisma/
└── schema.prisma
```

## Setup & Instalasi

### 1. Clone & install dependencies

```bash
git clone <repo-url>
cd movie-tracker
npm install
```

### 2. Setup environment variables

Buat file `.env` di root project:

```env
DATABASE_URL="mysql://root:password@localhost:3306/movie_tracker"
NEXTAUTH_SECRET="generate-pakai-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

TMDB_BASE_URL="https://api.themoviedb.org/3"
TMDB_API_KEY="tmdb-read-access-token"

NEXT_PUBLIC_JIKAN_BASE_URL="https://api.jikan.moe/v4"
```

> **Catatan:** `TMDB_API_KEY` pakai **Read Access Token** (v4 auth), bisa didapat gratis di [themoviedb.org](https://www.themoviedb.org/settings/api) setelah daftar akun.

### 3. Setup database

```bash
# Buat database dulu di MySQL
mysql -u root -p
CREATE DATABASE movie_tracker;
exit;

# Generate Prisma Client & jalankan migrasi
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Jalankan development server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Cara Pakai

1. **Register** akun baru di `/register`
2. **Browse** film/anime di halaman utama, toggle tab Movie/Anime buat ganti sumber data
3. Klik judul buat lihat **detail**, tekan tombol **Add to Watchlist**
4. Buka `/watchlist` buat kelola item yang udah disimpan — ubah status, kasih rating, atau hapus
5. Cek `/dashboard` buat lihat ringkasan statistik tracking lo

## Catatan Teknis

- **Movie (TMDB)** diambil lewat API route sendiri (`/api/movies`) supaya API key TMDB nggak ke-expose ke browser.
- **Anime (Jikan)** diambil langsung dari client-side karena Jikan API bersifat public (tanpa API key) dan pemanggilan lewat server sempat mengalami kendala koneksi (IPv6 resolution issue) di beberapa environment Windows.
- Data movie/anime tidak disimpan penuh ke database — hanya `mediaId`, `title`, dan `posterUrl` yang disimpan di tabel `Watchlist` untuk efisiensi, sisanya tetap difetch dari API eksternal saat dibutuhkan.

## Kredit Data

- Data film disediakan oleh [TMDB](https://www.themoviedb.org/). Aplikasi ini menggunakan TMDB API tapi tidak diendorse atau disertifikasi oleh TMDB.
- Data anime disediakan oleh [Jikan](https://jikan.moe/), unofficial MyAnimeList API.

## Status Pengembangan

Project ini dibuat untuk keperluan tugas/pembelajaran, dikembangkan secara bertahap sebagai bagian dari latihan fullstack development.

- [x] Setup project, database, dan autentikasi
- [x] Browse & search Movie/Anime
- [x] Detail page
- [x] Fitur Watchlist (CRUD + rating)
- [x] Dashboard statistik
- [ ] Halaman profil user
- [ ] Fitur review lebih lengkap
