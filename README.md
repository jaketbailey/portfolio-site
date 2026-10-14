# Personal Portfolio

Simple Portfolio built with React + Vite and TailwindCSS.

## Gallery

Photos are served as static files rather than fetched from a third party. The
gallery page reads a `gallery.json` manifest plus `thumb/` and `full/` webp
derivatives from `/photos` on the same origin. In development, symlink a
gallery output directory to `public/photos` (gitignored) so Vite serves it.

To add photos:

1. Drop full-resolution originals into a local folder (e.g. `./photos-src`,
   already gitignored).
2. Run `bun run gallery -- --src ./photos-src --out ./photos-out` (see
   `scripts/build-gallery.mjs --help`). This resizes two derivatives per photo
   and updates `gallery.json` in place — re-running after adding more photos
   only touches the new ones. Add `--watermark "© 2026 Jake Bailey"` to stamp text
   in the bottom-right corner; changing or dropping it rebuilds every image.
3. Fill in the blank metadata fields the script prints out (`name`, `camera`,
   `lens`, `film`, `iso`, etc.) directly in `gallery.json`.
4. Make `--out` the directory the container mounts at `/photos` (below), or
   copy its contents there.

## Self-hosting with Docker

The `Dockerfile` builds the site and serves it with unprivileged nginx
(`docker/nginx.conf`), which also 301s the other domains to
`www.jaketbailey.co.uk`. `compose.yaml` is gitignored, so create it next to the
`Dockerfile` on the host:

```yaml
services:
    portfolio:
        build: .
        restart: unless-stopped
        # Owner of the gallery share, which is mounted 0770.
        user: '${PUID:-1000}:${PGID:-1000}'
        ports:
            - '${PORT:-8085}:8080'
        volumes:
            - ${GALLERY_DIR:-/mnt/home/image-server/gallery}:/usr/share/nginx/html/photos:ro
```

Deploy with `git pull && docker compose up -d --build`. Re-running
`bun run gallery` or editing `gallery.json` takes effect on the next page load,
with no rebuild.
