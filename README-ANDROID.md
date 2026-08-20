# POP Generator — Android Friendly

Versi ini dibuat khusus agar mudah di-upload dari HP Android.

## Cara upload ke GitHub
Upload hanya file `index.html` ke root repository.

## Deploy Netlify
Karena ini static single-file:
- Build command: kosong
- Publish directory: `.`
- atau gunakan manual deploy jika file `index.html` berada di root.

## Gemini AI
Saat fitur AI pertama kali digunakan, aplikasi akan meminta Gemini API Key.
Key disimpan sementara di `sessionStorage` browser dan hilang setelah sesi/tab berakhir.

Catatan keamanan:
Versi single-file memanggil Gemini langsung dari browser. Untuk penggunaan produksi
dengan API key tersembunyi, gunakan versi Netlify Function.
