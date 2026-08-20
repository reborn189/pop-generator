# POP Generator Premium v2.5 Deployment Ready - No API Key

## Status
Versi ini disiapkan untuk GitHub + Netlify dan mempertahankan seluruh workflow v2.4.

## Tambahan v2.5
- React Error Boundary agar fatal runtime error tidak menghasilkan layar kosong tanpa penjelasan.
- PWA manifest + service worker untuk app shell/offline dasar.
- Indikator Online/Offline.
- Offline fallback page.
- Cache fingerprinted `/assets/*` selama 1 tahun.
- `sw.js` selalu `no-cache` agar update deployment cepat terbaca.
- Header keamanan Netlify dasar.
- Node 22 ditetapkan pada Netlify build.
- Vite/plugin dipindahkan ke `devDependencies`.
- Tidak ada API key atau environment variable wajib.

## Deployment Netlify
1. Upload repository ke GitHub.
2. Import project di Netlify.
3. Build command: `npm run build`.
4. Publish directory: `dist`.
5. Netlify akan membaca `netlify.toml` otomatis.

Tidak perlu mengisi environment variable.

## Local
```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
```

## Offline/PWA
App shell yang pernah dimuat dapat dibuka dari cache. Template Google Drive yang belum pernah dimuat tetap membutuhkan internet. Service worker tidak mencoba membypass permission Google Drive.

## Important
Template Google Drive harus readable oleh browser. Jika template tidak tampil, cek permission file terlebih dahulu; `template-image` hanya proxy/fallback dan bukan bypass akses.
