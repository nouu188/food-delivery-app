FROM node:20-alpine AS builder

RUN apk add --no-cache python3 make g++

WORKDIR /workspace

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

COPY . .

RUN npx nx build promotion-service --prod

FROM node:20-alpine AS production

RUN apk add --no-cache dumb-init

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

COPY --from=builder --chown=nodejs:nodejs /workspace/package.json /workspace/yarn.lock ./

RUN yarn install --frozen-lockfile --production && \
yarn cache clean

COPY --from=builder --chown=nodejs:nodejs /workspace/dist/apps/promotion-service ./

USER nodejs

EXPOSE 3009

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3009/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "main.js"]
