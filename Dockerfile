# camelot-wheel - build for production (arm64 on the Pi)
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.output ./.output
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]