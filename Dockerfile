# check-key - build for production
# BUILD ON THE RUNNER'S NATIVE ARCH, run arm64 on the Pi. QEMU-emulated vite
# bundling crawled 6h to timeout; native bundling is minutes and the Nuxt
# output is platform-independent JS. npm fetch hardening = the registry
# flakes seen all day (EIDLETIMEOUT / ECONNRESET).
# ponytail: npm install, not npm ci - no lockfile is committed.
FROM --platform=$BUILDPLATFORM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
ENV NPM_CONFIG_FETCH_TIMEOUT=180000 NPM_CONFIG_FETCH_RETRIES=8
RUN npm install
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.output ./.output
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]