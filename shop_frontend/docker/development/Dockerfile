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


# Development image
FROM base AS builder
WORKDIR /shop
COPY --from=deps /shop/node_modules ./node_modules
COPY . .
