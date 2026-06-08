FROM node:22-alpine AS build
WORKDIR /app

# git: sync-elemix clones the elemix repo during the build.
# python3/make/g++: toolchain for any native dep that lacks a musl prebuild.
RUN apk add --no-cache git python3 make g++

RUN npm install -g pnpm@11

# install deps first for layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# Sync happens here: clone + build Elemix, copy the bundle into public/elemix,
# generate the .d.ts map, then build the playground. Run explicitly so we don't
# rely on pnpm's pre/post-script behaviour.
RUN pnpm sync-elemix && pnpm gen-types && pnpm build

FROM ghcr.io/brownhounds/go-static:latest
COPY --from=build /app/dist /app
ENV PORT=8091
ENV IS_SPA=false
ENV SPA_ENTRYPOINT=index.html
ENV STATIC_FOLDER=/app
ENV PUBLIC_PATH=/
EXPOSE 8091
