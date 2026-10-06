# camelot-wheel - build for production (arm64 on the Pi)
# ponytail: npm install, not npm ci - no lockfile is committed (Pi has no node
# toolchain to generate one). ceiling: builds are less reproducible without a
# lockfile; upgrade path = generate package-lock.json when a dev box touches this.
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
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