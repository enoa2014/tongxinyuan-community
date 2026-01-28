# Runtime-only Dockerfile (Simplified for Windows Local Dev)
# Strategy: "Pure Copy" - No internal rebuilds
# Assumes `npm run build` ran successfully on host


# --- Builder Stage (for standalone mode) ---
FROM node:20-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
# RUN npm install
COPY . .
# RUN npm run build

# --- Runner Stage (Original) ---
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV development
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY . .
RUN npm config set registry https://registry.npmmirror.com
# Force clean install to ensure linux binaries
RUN rm -rf node_modules
RUN npm install
RUN chown -R nextjs:nodejs /app

# USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["npm", "run", "dev"]
