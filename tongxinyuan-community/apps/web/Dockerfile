# Runtime-only Dockerfile
# Strategy: "External Build"
# We assume `npm run build` has already run locally, generating `.next/standalone`

FROM node:20-slim AS runner
WORKDIR /app

# Update sources to Aliyun for China ECS (HTTP)
RUN echo "deb http://mirrors.aliyun.com/debian/ bookworm main non-free non-free-firmware contrib" > /etc/apt/sources.list && \
    echo "deb http://mirrors.aliyun.com/debian-security/ bookworm-security main non-free non-free-firmware contrib" >> /etc/apt/sources.list && \
    echo "deb http://mirrors.aliyun.com/debian/ bookworm-updates main non-free non-free-firmware contrib" >> /etc/apt/sources.list && \
    rm -f /etc/apt/sources.list.d/debian.sources

# Install build dependencies for native modules
RUN apt-get update && apt-get install -y python3 make g++ python-is-python3 && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy the standalone build artifacts directly from host
# Note: .dockerignore must NOT exclude .next
COPY --chown=nextjs:nodejs .next/standalone ./
COPY --chown=nextjs:nodejs .next/static ./.next/static
COPY --chown=nextjs:nodejs public ./public

# Rebuild dependencies for Linux (fix Windows binary mismatch)
RUN npm config set registry https://registry.npmmirror.com && \
    rm -rf node_modules && \
    npm install

# Fix ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
