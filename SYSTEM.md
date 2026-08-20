# SYSTEM.md — POP Generator Supermarket

## 1. Tujuan Sistem
Bangun aplikasi web generator Point of Purchase (POP) A3 yang mempercepat pekerjaan tim supermarket dalam membuat materi harga/promosi yang konsisten per cabang dan kategori.

## 2. Prinsip Produk
- Premium, profesional, cepat, mobile-first, bukan UI dashboard generik.
- Template visual cabang adalah sumber kebenaran; aplikasi mengisi konten tanpa merusak identitas template.
- Preview harus sedekat mungkin dengan hasil export.
- Semua tindakan utama dapat dilakukan dari Android maupun desktop.
- API key/secret tidak boleh berada di browser.
- Kegagalan template, gambar, AI, atau export harus menghasilkan pesan yang jelas, bukan halaman kosong.

## 3. Format Kanvas
- Logical canvas: 1080 × 1528 (rasio A3 portrait).
- High-resolution export menggunakan render multiplier.
- Mode: 1POP dan 2POP.
- Export minimum PNG; arsitektur disiapkan untuk PDF/print-ready di tahap berikutnya.

## 4. Cabang dan Kategori
Cabang: BJR, CMS, GCW, GRT, MBT, TSK, YCN, YMJ.
Kategori: Fruit/Veg, Meat, Poultry, Fishery.
Setiap kombinasi cabang/kategori memiliki template 1POP dan 2POP di `src/config/templates.js`.

## 5. Workflow Utama
1. Pilih cabang.
2. Pilih kategori.
3. Pilih mode 1 POP / 2 POP.
4. Isi data produk.
5. Upload foto produk atau gunakan AI (backend).
6. Preview template otomatis.
7. Pilih elemen untuk edit posisi/ukuran.
8. Validasi harga dan konten.
9. Export POP.
10. Opsional tahap berikutnya: simpan draft/history.

## 6. Aturan UI/UX
- Desktop: control rail kiri + workspace besar.
- Mobile: workspace tetap terlihat; editor memakai bottom sheet/section cards.
- Jangan gunakan neon gradient berlebihan, glassmorphism berlebihan, kartu identik di semua bagian, atau tampilan “AI dashboard”.
- Gunakan hirarki editorial: header ringkas, segmented control, form padat, kanvas sebagai fokus.
- Bottom/sticky controls tidak boleh menutup konten.
- Touch target minimal ±44px.
- Status loading/error/success selalu terlihat.
- Empty state harus informatif.

## 7. Template
- ID template tidak ditulis ulang di komponen.
- Semua template berasal dari `src/config/templates.js`.
- Folder master Drive: `1JBhsr03-RlfDxYW6cKt3atADC6_DgPc0`.
- Jika template gagal dimuat, tampilkan fallback visual + ID template + tombol retry.
- Jangan menganggap folder Drive dapat dilist dari frontend tanpa API/permission yang sesuai.

## 8. Editor
Elemen 1POP: title, image, period, benefits, promo price, normal price, unit, badge.
Elemen 2POP: title/image/promo price/normal price/unit untuk item atas dan bawah.
Interaksi: select, drag, zoom, fine movement, reset.
Selection overlay hanya untuk editing dan wajib hilang dari export.

## 9. Image Processing
- Upload PNG/JPEG/WebP.
- Pertahankan transparansi.
- Background removal lokal boleh menjadi fallback.
- AI background removal/generation harus melalui backend.
- Hindari dynamic dependency yang menyebabkan blank screen.
- Batasi ukuran gambar input untuk stabilitas mobile.

## 10. Local Smart Assist
- Tidak menggunakan API key.
- Auto Category memakai kamus keyword/preset lokal.
- Auto Benefit memakai preset lokal berdasarkan jenis produk.
- Auto Unit memberi saran `/kg` atau `/100g`.
- Semua hasil smart assist adalah saran yang tetap dapat diedit user.
- Fitur inti tidak bergantung layanan eksternal AI.

## 11. Security
- Tidak ada secret di source frontend.
- Validasi MIME/size upload.
- Sanitasi nama file export.
- Batasi payload Netlify Function.
- Terapkan timeout/error handling.
- CORS hanya sesuai kebutuhan.
- Jangan mengekspos stack trace kepada user.

## 12. Reliability
- ErrorBoundary di root.
- Lazy feature tidak boleh memblokir editor inti.
- Template preload/caching.
- State editor tidak hilang hanya karena resize/orientation.
- Export menangani perangkat dengan memori terbatas.

## 13. Acceptance Criteria
- Semua 64 mapping template tersedia: 8 cabang × 4 kategori × 2 mode.
- Cabang/kategori/mode mengganti template tanpa reload.
- 1POP dan 2POP dapat diedit.
- Upload gambar berfungsi.
- Drag/zoom elemen berfungsi.
- Export PNG bersih tanpa selection UI.
- Responsive Android/desktop.
- Secret AI tidak berada di bundle frontend.
- Tidak ada blank page saat template/API gagal.


## 14. V2 Functional Layer
V2 menambahkan:
- template proxy Netlify + fallback direct Drive;
- Template Manager lokal untuk override ID per cabang/kategori/mode;
- local draft/history maksimal 20 draft;
- local flat-background removal dengan tolerance;
- local product classification + 4 benefits via preset/keyword engine;
- product image berasal dari upload user;
- badge editor;
- nudge/fine controls;
- high-resolution export multiplier 3;
- upload validation maksimum 12 MB;

Catatan: draft lokal tidak menyimpan binary foto produk. Ini disengaja agar localStorage tidak cepat penuh. Penyimpanan foto/draft lintas perangkat membutuhkan storage/backend pada fase berikutnya.

## 15. V2.1 No-API-Key
- Semua fungsi Gemini dihapus.
- Tidak ada `GEMINI_API_KEY` atau secret AI.
- `productRules.js` menjadi sumber local smart assist.
- Foto produk wajib berasal dari upload pengguna.
- Deployment Netlify hanya membutuhkan build frontend dan template-image proxy.


## 16. V2.2 Operational
- Local product catalog + autocomplete.
- IndexedDB wajib digunakan untuk binary foto draft; jangan masukkan base64 besar ke localStorage.
- Batch Queue mengumpulkan snapshot POP selama sesi.
- PDF A3 harus 297 x 420 mm portrait, satu POP per halaman.
- Batch PDF harus mempertahankan template, foto, teks, harga, posisi elemen tiap snapshot.
- PNG dan PDF wajib dirender tanpa selection overlay.
- Sistem tetap tanpa API key.


## 17. V2.3 Production Workflow
- CSV/Excel import digunakan untuk membentuk batch massal.
- Header harus dipetakan secara toleran terhadap Bahasa Indonesia/Inggris.
- Baris tanpa nama produk dianggap invalid dan tidak masuk batch.
- Import tidak boleh mengganti template IDs source-of-truth.
- Preview batch wajib tersedia sebelum export.
- Duplikasi POP harus membuat snapshot baru, bukan reference ke state aktif.
- Backup/restore draft harus mencakup binary foto melalui representasi portable JSON.
- Batch harus tetap session-only untuk menjaga performa Android.
- Spreadsheet tidak boleh digunakan sebagai tempat penyimpanan secret.


## 18. V2.4 Final Production UI & Validation
- Setiap export wajib melalui pre-print validation.
- Error memblokir export; warning tidak memblokir.
- Harga menggunakan numeric input semantics dan format tampilan Rupiah.
- Batch preview wajib menampilkan thumbnail visual best-effort.
- Batch dapat di-reorder sebelum PDF.
- Layout preset per kategori menjadi baseline sebelum fine editing.
- Autosave hanya metadata ringan; foto tetap melalui draft IndexedDB manual.
- Recovery harus selalu meminta pilihan user sebelum menimpa state saat ini.


## 19. V2.5 Deployment Ready
- Root React wajib dibungkus ErrorBoundary.
- Runtime fatal tidak boleh menghasilkan blank page tanpa recovery UI.
- PWA hanya meng-cache app shell dan asset origin sendiri; jangan cache agresif template Drive privat.
- Service worker harus update-safe (`sw.js` no-cache).
- Aplikasi harus menunjukkan status online/offline.
- Netlify menggunakan Node 22, SPA redirect, immutable asset cache, dan security headers dasar.
- Tidak ada API key/environment variable wajib.
- Offline mode tidak boleh diklaim sebagai full offline untuk template yang belum pernah tersedia.
