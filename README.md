# GroundSite

React + Vite site with modpack downloads, media gallery, and a canvas-based interactive background.

## Install dependencies
```bash
npm install
```

## Run locally
```bash
npm run dev
```

## Update content
- Home page: edit placeholders in `src/App.jsx`.
- Modpacks: replace `public/downloads/modpack1.zip` and `public/downloads/modpack2.zip` with your actual files.
- Media: drop files in `public/media/` and list them in `public/media/media.json`.

Example media entry:
```json
{
  "src": "media/my-screenshot.png",
  "title": "Night build",
  "caption": "Base progress at dusk."
}
```

## Docker run
Build:
```bash
docker build -t groundsite .
```
Run on port 2026:
```bash
docker run --rm -p 2026:2026 groundsite
```

## Docker Compose
```bash
docker compose up -d --build
```
