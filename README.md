# Zanfiiliate (PWA)

Folder ini siap di-upload ke GitHub lalu di-deploy ke Vercel. Semua file ada di satu level (tanpa subfolder) supaya mudah di-upload dari HP.

| File | Fungsi |
|---|---|
| index.html | Aplikasi Zanfiiliate v162 |
| manifest.webmanifest | Data aplikasi untuk tombol "Install" |
| sw.js | Service worker (bisa dibuka tanpa internet setelah kunjungan pertama) |
| vercel.json | Pengaturan header Vercel |
| icon-192.png, icon-512.png, icon-maskable-512.png, apple-touch-icon.png, favicon-32.png | Ikon dari gambar Anda |

## Langkah dari HP

### 1. Upload ke GitHub
1. Ekstrak ZIP di HP (Files / File Manager).
2. Buka github.com di browser, login, ketuk **+ → New repository**. Nama: `zanfiiliate`. Pilih **Private** (disarankan), lalu **Create repository**.
3. Di halaman repo yang masih kosong, ketuk **uploading an existing file**.
4. Ketuk area upload, pilih **semua file** hasil ekstrak (bukan ZIP-nya).
5. Tunggu semua file terunggah, isi pesan commit (misal `upload v162`), ketuk **Commit changes**.

Jika browser HP tidak bisa memilih banyak file sekaligus, upload dalam 2-3 kali tahap (Add file → Upload files).

### 2. Deploy di Vercel
1. Buka vercel.com, **Continue with GitHub**.
2. Ketuk **Add New → Project**, pilih repo `zanfiiliate`, ketuk **Import**.
3. Biarkan semua default: Framework Preset = **Other**, Build Command kosong, Output Directory kosong.
4. Ketuk **Deploy**. Setelah selesai Anda mendapat alamat seperti `zanfiiliate.vercel.app`.

### 3. Pasang sebagai aplikasi
- **Android (Chrome):** buka alamatnya → menu ⋮ → **Install app** (atau **Tambahkan ke layar utama**).
- **iPhone (Safari):** buka alamatnya → tombol Bagikan → **Tambah ke Layar Utama**.

## Update versi baru
1. Di repo GitHub ketuk **Add file → Upload files**, lalu upload `index.html` versi baru (nama sama, otomatis menimpa).
2. Buka `sw.js`, ubah angka pada baris `const VERSION = 'zanfiiliate-v162-1';` (misal jadi `'zanfiiliate-v163-1'`), lalu commit.
3. Vercel otomatis deploy ulang. Buka aplikasi dua kali agar versi baru aktif.

## Catatan penting
- **Login tim dan sinkronisasi (menu Tim, /api/fg/..., /api/dr/sync) butuh server di Netlify** dan tidak ikut terbawa ke Vercel. Di Vercel fitur itu tidak akan berfungsi, sedangkan fitur lain yang menyimpan data di browser tetap berjalan.
- Data tersimpan di browser/perangkat masing-masing. Alamat Vercel berbeda dari alamat Netlify lama, jadi data lama tidak otomatis pindah; gunakan fitur ekspor/cadangan di aplikasi bila ada.
- Pada HTML, sisa Netlify (skrip otomatis `/.netlify/...` dan gambar pratinjau milik situs lain) sudah dihapus. Selain itu isi aplikasi tidak diubah.
