# Personal Portfolio

Simple Portfolio built with React + Vite and TailwindCSS.

## Gallery

Photos are served as static files rather than fetched from a third party. The
gallery page reads a `gallery.json` manifest plus `thumb/` and `full/` webp
derivatives from `/photos` (same-origin by default — see
`src/lib/gallery.js`). Point it elsewhere during development with:

```
VITE_GALLERY_BASE_URL=http://your-home-server/photos
```

To add photos:

1. Drop full-resolution originals into a local folder (e.g. `./photos-src`,
   already gitignored).
2. Run `bun run gallery -- --src ./photos-src --out ./photos-out` (see
   `scripts/build-gallery.mjs --help`). This resizes two derivatives per photo
   and updates `gallery.json` in place — re-running after adding more photos
   only touches the new ones. Add `--watermark "© Jake Bailey"` to stamp text
   in the bottom-right corner; changing or dropping it rebuilds every image.
3. Fill in the blank metadata fields the script prints out (`name`, `camera`,
   `lens`, `film`, `iso`, etc.) directly in `gallery.json`.
4. Copy the contents of `--out` to wherever `/photos` is served from on the
   home server.

## Self-hosting with Docker

`docker compose up -d --build` builds the site and serves it with nginx on port 8080. The gallery output directory is mounted read-only at `/photos`, so the
site and photos share an origin and `VITE_GALLERY_BASE_URL` isn't needed. It
defaults to `/mnt/home/image-server/gallery`; override with `GALLERY_DIR`:

```
GALLERY_DIR=/some/other/gallery docker compose up -d --build
```

Re-running `bun run gallery` or editing `gallery.json` takes effect on the next
page load, with no rebuild. Code changes need `docker compose up -d --build`.
