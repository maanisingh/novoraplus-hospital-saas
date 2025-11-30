FROM node:20-alpine AS builder

# ============================================
# BUILD VERSION: 7.0.1
# DATE: 2025-11-30T17:35:00Z
# FIX: Force rebuild - frontend deployment
# Doctor, Nurse, Receptionist, Lab Tech, Pharmacist
# Hospital Admin, SuperAdmin
# ============================================

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies with legacy peer deps
RUN npm ci --legacy-peer-deps

# Copy all source files
COPY . .

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
