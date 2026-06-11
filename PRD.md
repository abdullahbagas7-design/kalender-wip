# PRD: Sistem Manajemen Kapasitas & Jadwal Undangan

## 1. Ringkasan Produk
Web App berbasis Mobile-First untuk memantau dan mengelola kapasitas jadwal undangan secara real-time. Sistem membatasi kapasitas harian dan memungkinkan manajemen tamu lengkap (CRUD) dengan antarmuka yang elegan dan intuitif.

## 2. Tech Stack
- Framework: Next.js (App Router)
- Styling: Tailwind CSS
- Database & Backend: Supabase
- Deployment: Vercel
- State Management: React Hooks (useState/useContext)

## 3. Panduan Desain (UI/UX)
- **Gaya Visual**: Glassmorphism modern dengan background blob gradasi (merah, biru, atau kombinasi) fixed di belakang.
- **Elemen UI**:
  - Semua card/frame menggunakan `backdrop-blur-2xl` dan transparansi tinggi
  - Rounded ekstrem (rounded-[2.5rem] atau lebih)
  - Shadow halus tanpa garis border kaku
  - Animasi hover dan transition yang smooth & satisfying
- **Interaksi**: Single-page experience tanpa navigasi antar halaman. Semua aksi menggunakan Bottom Sheet atau modal glass.
- **Navigasi**: Fixed bottom navigation dengan 3 menu utama.

## 4. Fitur Utama

### A. Kalender Kapasitas (Halaman Utama)
- Menampilkan kalender bulanan penuh dengan desain glassmorphism
- Indikator kapasitas menggunakan shadow (bukan warna dot):
  - � **Shadow Merah**: Kapasitas penuh
  - 🟡 **Shadow Kuning**: Hampir penuh
  - � **Shadow Hijau**: Longgar
  - Tanpa shadow: Kosong
- Klik tanggal menampilkan card glass dengan daftar tamu pada hari tersebut
- Highlight hari ini dengan styling khusus

### B. Manajemen Tamu (CRUD Lengkap)
- **Tambah Tamu**: Form dengan field wajib (Nama, Nomor HP) dan optional (Jenis Undangan, Quantity)
- **Edit Tamu**: Ubah semua detail tamu
- **Hapus Tamu**: Konfirmasi sebelum menghapus
- **Pindah Tanggal**: Memindahkan tamu ke tanggal lain
- Semua aksi dilakukan melalui Bottom Sheet glassmorphism

### C. Navigasi Bawah (Fixed Bottom)
Komponen `Navigation.tsx` dengan 3 menu:
1. **Kalender/Home** - Kembali ke tampilan kalender utama
2. **Add (+)** - Shortcut untuk menambah tamu baru
3. **Settings (Gear icon)** - Buka halaman pengaturan

### D. Pengaturan Kapasitas Fleksibel
- Edit `max_capacity` (batas tamu per hari) secara real-time tanpa menyentuh code
- Tombol "Hapus Data Lampau" untuk membersihkan data lama
- Semua perubahan disimpan ke database Supabase

### E. Pembersihan Data (Clean-Up)
- Manual: Tombol di halaman pengaturan untuk menghapus data yang sudah lewat > 30 hari
- Otomatis (opsional): Cron Job via Supabase Edge Functions

## 5. Struktur Database (Supabase)

### Tabel `orders`
- `id`: UUID (Primary Key)
- `client_name`: Text (wajib)
- `phone_number`: Text (wajib)
- `invitation_type`: Text (opsional, misal: Amplop, Lembar Insert, dll)
- `quantity`: Integer (opsional, default 1)
- `order_date`: Date (wajib)
- `created_at`: Timestamp (default: now())

### Tabel `settings`
- `id`: Integer (Primary Key, default 1)
- `max_capacity`: Integer (default: 10)
- `updated_at`: Timestamp (default: now())

## 6. Struktur Proyek
```
/kalender_wip
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx (Home, dengan global state)
├── components/
│   ├── Calendar.tsx
│   ├── BottomSheet.tsx
│   ├── Navigation.tsx
│   └── SettingsSheet.tsx
└── lib/
    └── supabase.ts (koneksi Supabase)
```

## 7. Desain Global State
State utama di `app/page.tsx` untuk sinkronisasi:
- `orders`: Daftar semua pesanan
- `selectedDate`: Tanggal yang aktif dipilih
- `isSheetOpen`: Status Bottom Sheet
- `maxCapacity`: Batas kapasitas harian
- `currentView`: Tampilan aktif (home/settings)
