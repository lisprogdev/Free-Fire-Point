# API Pengunjung untuk Floating Widget

Widget pengunjung di situs memanggil endpoint yang mengembalikan JSON dengan format:

```json
{
  "today": 123,
  "week": 890,
  "month": 4500,
  "year": 52000,
  "total": 125000
}
```

- **today** – pengunjung hari ini  
- **week** – pengunjung minggu ini  
- **month** – pengunjung bulan ini  
- **year** – pengunjung tahun ini  
- **total** – total semua waktu  

## Menggunakan data dari Google Analytics (property ID: 502893344)

Google Analytics **tidak** bisa dibaca langsung dari browser. Anda perlu **backend** (Cloud Function, Vercel/Netlify Function, atau server) yang:

1. Memakai **Google Analytics Data API (GA4)** dengan **Property ID: 502893344**.
2. Mengambil metrik active users untuk periode: hari ini, 7 hari, 30 hari, 365 hari, dan all time.
3. Mengembalikan JSON di atas (misalnya di `/api/visitors` atau URL lain).

### Konfigurasi di frontend

Arahkan widget ke URL backend Anda dengan menambah script sebelum `floating-visitors.js`:

```html
<script>
  window.FFP_VISITOR_API_URL = 'https://your-domain.com/api/visitors';
</script>
<script src="js/floating-visitors.js"></script>
```

### File ini

- `visitors.json` – contoh response statis (semua 0). Bisa dipakai untuk tes atau sampai backend GA siap.
- Jika situs Anda murni static dan tidak menjalankan backend, hapus atau ganti `visitors.json` dengan hasil dari backend Anda, atau host endpoint terpisah dan set `FFP_VISITOR_API_URL` ke URL tersebut.
