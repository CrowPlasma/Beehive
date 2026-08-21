# Stage 1: Build
FROM node:20-bookworm-slim AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y openssl
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 2: Production
FROM node:20-bookworm-slim AS production
WORKDIR /app
ENV NODE_ENV=production
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
RUN npx prisma generate
EXPOSE 4000
CMD ["npm", "run", "start:prod"]
