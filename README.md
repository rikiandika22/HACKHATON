# AUTOSPEC - Jangan Tebak Spesifikasi Mobilmu 🏎️✨

Proyek platform pintar yang membantu Anda mengekstraksi dan mengecek spesifikasi, dimensi, konsumsi bbm terbongkar dari mobil serta mencari rekomendasi modifikasi. Penuh integrasi dengan UI/UX Modern ala pabrikan besar otomotif.

## Prasyarat Pra-Instalasi (Penting bagi Anggota Tim)
Sebelum bisa menjalankan *project* ini di komputer lokal, pastikan setiap anggota tim sudah menginstal:
1. **Node.js** (versi terbaru / Minimal v16 ke atas)
2. **PostgreSQL** lokal (beserta pgAdmin 4).

---

## 🚀 Panduan Setup & Menjalankan Aplikasi di Komputer Lokal

Ikuti langkah-langkah di bawah ini secara berturut-turut untuk menjalankan kloning repositori Github ini.

### 1. Proses Kloning & Set Up Tampilan (Frontend)
Salin keseluruhan arsip proyek ini ke mesin Anda:
```bash
git clone https://github.com/rikiandika22/HACKHATON.git
cd HACKHATON

# Instal semua dependensi eksternal dari package.json (Vite, AlpineJs, dll)
# node_modules akan tercipta di sini
npm install
```

### 2. Set Up Database dan Backend (Node.js)
Proyek ini mengandalkan *server* lokal dengan database PostgreSQL.
Masuk ke direktori `server` milik *backend*, lalu lakukan instalasi lagi:
```bash
cd server
npm install
```

### 3. Rahasia Konfigurasi: File `.env` (Wajib Dibuat Manual!)
File kredensial sengaja **tidak** diunggah ke Github oleh sistem Git demi keamanan aslinya.
Oleh karenanya, *setting* manual di bawah ini harus Anda jalankan:
1. Duplikat/Salin file **`server/.env.example`**.
2. Ubah nama salinannya menjadi **`.env`** biasa (tanpa imbuhan apa-apa di depannya).
3. Buka file `.env` yang baru dibuat dengan Code Editor (VS Code), lalu **ubah isinya menyesuaikan Username dan Password dari software PostgreSQL** di komputer Windows/Mac Anda. Contoh isinya harus mirip seperti ini:
```env
PORT=3000
DB_USER=postgres
DB_PASSWORD=sandi_yang_anda_buat_saat_install_postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=autospec
JWT_SECRET=super_secret_jwt_key_123
```

### 4. Buka pgAdmin dan Lakukan Migrasi Tabel Otomatis
Setelah kredensial `.env` Anda benar, sistem Node.JS bisa otomatis menyuntikkan *tabel-tabel database*.
- Buka PostgreSQL/pgAdmin di perangkat Anda, lalu klik-kanan -> **Buat database baru bernama `autospec`**.
- Kembali ke Terminal kompas Anda (di dalam folder **`server/`**), lalu jalankan perintah ini 1x:
```bash
node init_db.js
```
Jika sukses, tabel `users` untuk sesi Login dan Register sudah berhasil tercipta secara mandiri sekerdipan mata.

---

### 5. Akhirnya, Menjalankan Aplikasi Secara Penuh!
Aplikasi *fullstack* ini butuh 2 buah Terminal VS Code yang hidup berdampingan.

**Terminal 1 (Menjalankan Mesin Backend):**
Pastikan *directory* aktif Anda: `HACKHATON/server`
```bash
npm run dev
```

**Terminal 2 (Menjalankan Mesin Frontend):**
Pastikan *directory* letak Anda di luar (folder induk layar): `HACKHATON`
```bash
npm run dev
```

Buka URL **http://localhost:5173** (atau port lain sesuai dari Vite) di peramban web (*Browser*) manapun. Selamat bergabung ke AUTOSPEC! 🏁
