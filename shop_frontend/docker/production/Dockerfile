FROM node:18-alpine AS base
LABEL Maintainer="bogdan.trinc@student.upt.ro"

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /shop
COPY package.json package-lock.json* ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /shop
COPY --from=deps /shop/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /shop

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /shop/public ./public

COPY --from=builder --chown=nextjs:nodejs /shop/build/standalone ./
COPY --from=builder --chown=nextjs:nodejs /shop/build/static ./build/static

USER nextjs
