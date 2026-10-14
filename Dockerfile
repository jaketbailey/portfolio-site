# Build the static site with Bun, then serve it with (unprivileged) nginx. Photos are not baked
# into the image: compose mounts the gallery output directory at /photos.
FROM oven/bun:1.2 AS build
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
