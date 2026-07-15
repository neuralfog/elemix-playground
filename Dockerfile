FROM node:22-alpine AS build
WORKDIR /app

# git: sync-elemix clones the elemix repo during the build.
# python3/make/g++: toolchain for any native dep that lacks a musl prebuild.
RUN apk add --no-cache git python3 make g++

RUN npm install -g pnpm@11

# install deps first for layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY patches ./patches
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm sync-elemix && pnpm gen-types && pnpm build

# Build the swift static server (serves dist with correct Cache-Control).
FROM golang:1.26-alpine AS server
WORKDIR /src
COPY server/go.mod server/go.sum ./
RUN go mod download
COPY server/ ./
RUN CGO_ENABLED=0 go build -o /playground .

FROM alpine:3
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=server /playground /usr/local/bin/playground
ENV HOST=0.0.0.0
ENV PORT=8091
ENV STATIC_DIR=/app/dist
EXPOSE 8091
CMD ["playground"]
