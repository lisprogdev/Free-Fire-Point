# Panduan Indeks Google Search Console

Dokumen ini menjelaskan status "Halaman tidak diindeks" di Google Search Console dan tindakan yang sudah diambil.

## 1. Tidak ditemukan (404) — **Diperbaiki**

- **Penyebab:** Situs mengarahkan error 404 ke `/404.html`, tetapi file tersebut belum ada.
- **Perbaikan:** File **`404.html`** sudah ditambahkan di root. Halaman ini:
  - Memiliki `noindex, follow` agar halaman 404 sendiri tidak diindeks.
  - Memiliki canonical ke beranda agar URL yang salah tidak dianggap sebagai halaman utama.
  - Menampilkan pesan ramah dan link ke Beranda serta kalkulator 2/3/4 Match.

**Catatan:** Jika hosting memakai GitHub Pages, file `404.html` di root otomatis dipakai sebagai halaman 404.

---

## 2. Halaman dengan pengalihan — **Sengaja (bukan error)**

- **Arti:** Google mendeteksi URL yang mengalihkan (redirect), misalnya:
  - `http://freefirepoint.my.id` → `https://freefirepoint.my.id` (301)
  - `https://www.freefirepoint.my.id` → `https://freefirepoint.my.id` (301)
- **Kenapa tidak diindeks:** URL yang hanya mengalihkan **memang tidak diindeks**. Yang diindeks adalah URL tujuan (non-www, HTTPS).
- **Tindakan:** Tidak perlu diubah. Aturan di `.htaccess` (redirect www → non-www dan HTTP → HTTPS) sudah benar untuk SEO.

---

## 3. Halaman alternatif dengan tag kanonis yang tepat — **Sengaja (bukan error)**

- **Arti:** Google menemukan versi alternatif (misalnya dengan query string atau variasi URL) yang sudah memakai tag canonical ke URL utama.
- **Kenapa tidak diindeks:** Duplikat itu sengaja tidak diindeks; canonical memastikan hanya satu URL utama yang diindeks.
- **Tindakan:** Tidak perlu diubah. Semua halaman utama sudah memakai `rel="canonical"` ke URL yang benar.

---

## Ringkasan

| Alasan di Search Console | Status | Tindakan |
|---------------------------|--------|----------|
| Tidak ditemukan (404)     | Diperbaiki | Gunakan `404.html` yang sudah ada |
| Halaman dengan pengalihan | Normal | Tidak perlu diubah |
| Halaman alternatif + canonical | Normal | Tidak perlu diubah |

Setelah deploy, Anda bisa meminta pengindeksan ulang untuk beranda dan halaman penting di Search Console (URL Inspection → Request Indexing) jika perlu.
