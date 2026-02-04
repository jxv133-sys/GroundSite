# GroundSite

Static interactive site powered by anime.js with a simple media gallery and modpack downloads.

## Update content
- Home page: edit placeholders in `index.html`.
- Modpacks: replace `downloads/modpack1.zip` and `downloads/modpack2.zip` with your actual files.
- Media: drop files in `media/` and list them in `media/media.json`.

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
