# DEPLOYMENT_CHECK.md — v2.5

## Static checks completed
- Local source imports resolve to existing files.
- PWA manifest, service worker, offline page, ErrorBoundary, and network status component are present.
- Netlify SPA redirect and security/cache headers are configured.
- No Gemini runtime endpoint is present.
- No API key is required.

## Build verification
A real `npm install` was attempted in the artifact environment, but package installation timed out because dependencies could not be fetched within the environment limit. A second `npm run build` confirmed Vite was not installed locally because that install had not completed.

Before production deployment, GitHub/Netlify should run:
```bash
npm install
npm run build
```
A successful build must produce `dist/`. Netlify will perform this automatically using `netlify.toml`.
