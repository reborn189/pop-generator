# POP Editor — Netlify Ready

Project React + Vite yang sudah disiapkan untuk deployment Netlify.

## Deploy via Git (disarankan)
1. Upload seluruh isi folder ini ke repository GitHub/GitLab.
2. Di Netlify pilih **Add new project / Import an existing project**.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Tambahkan Environment Variable:
   - `GEMINI_API_KEY` = API key Gemini Anda
6. Deploy.

`netlify.toml` sudah menyimpan konfigurasi build, publish directory, functions, dan SPA redirect.

## Test lokal
```bash
npm install
npm run dev
```

Untuk mengetes Netlify Functions secara lokal, gunakan Netlify CLI dan jalankan `netlify dev`.

## Catatan penting
- API key Gemini tidak disimpan di frontend. Request AI diteruskan lewat `netlify/functions/gemini.mjs`.
- Background removal menggunakan paket `@imgly/background-removal`.
- Template Google Drive pada source asli tetap dipertahankan dan dimuat melalui proxy gambar yang sebelumnya sudah digunakan aplikasi.
- Jika Google mengganti/menonaktifkan nama model Gemini preview, isi `GEMINI_IMAGE_MODEL` dan `GEMINI_TEXT_MODEL` di Environment Variables Netlify tanpa perlu mengubah frontend.
