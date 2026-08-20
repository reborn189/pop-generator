# AGENT.md — Implementation Contract

## Mission
Implementasikan POP Generator sesuai SYSTEM.md dan konfigurasi template. Prioritas: correctness template, stabilitas mobile, kualitas export, lalu AI enhancement.

## Non-Negotiable
1. Jangan mengubah ID template tanpa instruksi.
2. Jangan menaruh API key di `src/`, HTML, query string, atau localStorage.
3. Jangan mengganti template visual dengan desain generik.
4. Jangan membuat fitur yang menyebabkan editor inti bergantung pada AI.
5. Jangan menyembunyikan error dengan silent fallback.
6. Jangan mengubah logical A3 1080×1528 tanpa migrasi layout.
7. Selection box/editor controls tidak boleh ikut ter-export.

## Source of Truth
- Template IDs: `src/config/templates.js`
- UI behavior & product rules: `SYSTEM.md`
- Existing prototype: mempertahankan konsep 1POP/2POP, Canvas, drag/zoom, badge, benefit, period, upload, background removal dan high-resolution export.

## Workstreams
### A. Core
- Branch/category/layout selectors
- Product form
- Canvas preview
- Template loading
- Element transform
- PNG export

### B. Image
- Upload/preview
- Local simple background cleanup fallback
- Object scaling/positioning
- AI endpoints optional

### C. Mobile
- No horizontal overflow
- No controls hidden behind browser/bottom navigation
- Fullscreen preview
- Fine-move controls usable with touch
- Respect safe-area inset

### D. Production
- Netlify SPA redirect
- Netlify Functions
- Environment variables
- ErrorBoundary
- build test before release

## Definition of Done
Run:
`npm install`
`npm run build`
Then verify:
- `/` renders without console fatal errors.
- All branches can be selected.
- All categories can be selected.
- 1POP/2POP switches.
- Template URL changes correctly.
- Upload works.
- Export works.
- Mobile width 360–430px has no clipped critical control.
- Build output contains no API secret.

## Visual Standard
Use warm off-white/charcoal workspace, restrained green operational accent, strong typography, thin borders, purposeful spacing. Canvas is the hero. Avoid generic AI SaaS visuals, excessive gradients, floating blobs, decorative charts, and repetitive rounded cards.


## V2 Rules
- `template-image` adalah proxy best-effort. Jika Drive membutuhkan autentikasi, jangan mencoba membypass permission; minta file dibuat readable atau pindahkan asset ke storage publik.
- Template override lokal tidak boleh mengubah `POP_TEMPLATES`.
- Jangan menyimpan base64 foto produk ke localStorage draft.
- Export menggunakan canvas terpisah agar selection overlay tidak pernah ikut ke file final.

## V2.1 No-API-Key Rules
- Jangan menambahkan kembali dependency AI/API tanpa instruksi eksplisit user.
- Smart assist harus deterministik dan lokal.
- Perluasan katalog produk dilakukan di `src/utils/productRules.js`.
- Upload foto adalah sumber gambar produk utama.


## V2.2 Rules
- Tambah produk melalui `PRODUCT_PRESETS`; jangan hardcode katalog di komponen UI.
- Binary image draft disimpan di IndexedDB.
- Hapus binary image saat draft dihapus.
- Batch snapshot harus menyimpan data URL gambar hanya selama sesi; jangan persist batch besar ke localStorage.
- PDF A3 menggunakan jsPDF format A3 portrait 297 x 420 mm.


## V2.3 Rules
- Import logic hanya di `src/utils/importer.js`.
- Jangan parsing Excel manual di komponen.
- File import maksimal dipreview 100 baris di UI; semua baris valid tetap boleh dimasukkan batch.
- Backup JSON harus tervalidasi dengan marker `POP_STUDIO_BACKUP`.
- Batch import tanpa gambar harus tetap dapat diexport dan tidak crash.
- Untuk Android, jangan generate semua canvas batch sekaligus; render halaman satu per satu saat PDF dibuat.


## V2.4 Rules
- Validation logic hanya di `src/utils/validation.js`.
- Jangan export bila `canExport()` false.
- Thumbnail batch dibuat kecil (sekitar 216x306) untuk efisiensi Android.
- Drag reorder harus memindahkan snapshot, bukan mengubah isi snapshot.
- Autosave debounce; jangan menulis localStorage pada setiap pointermove tanpa jeda.
- Layout preset berasal dari `src/utils/layoutPresets.js`.


## V2.5 Deployment Rules
- Jalankan `npm run build` sebelum release bila environment memungkinkan.
- Jangan hapus ErrorBoundary atau offline fallback.
- Jangan cache `/.netlify/functions/template-image` di service worker.
- Jangan menambah secret ke frontend atau Netlify config.
- Setiap perubahan dependency harus tetap kompatibel dengan Node 22.
- Bila build gagal, perbaiki sampai `dist/` dihasilkan; jangan menyatakan deployment-ready tanpa build evidence.
