FROM node:20-alpine AS builder

# ============================================
# BUILD VERSION: 10.0.0
# DATE: 2025-11-30T19:00:00Z
# RBAC: Staff page now restricted to Hospital Admin and SuperAdmin only
# Nurses and other staff can only VIEW staff, not manage them
# ============================================

WORKDIR /app

# Copy package files from frontend directory
COPY frontend/package.json frontend/package-lock.json ./

# Install dependencies with legacy peer deps
RUN npm ci --legacy-peer-deps

# Copy all source files from frontend directory
COPY frontend/ .

# Set build-time environment variables
ENV NEXT_PUBLIC_DIRECTUS_URL=https://directus-production-0b20.up.railway.app
ENV NEXT_PUBLIC_APP_NAME=NovoraPlus
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN npm run build

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy necessary files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

ENV PORT=3000

CMD ["npm", "run", "start"]
