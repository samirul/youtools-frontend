# Stage 1: Build Vite React App
FROM node:23-bookworm-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with Bitnami NGINX
FROM bitnami/nginx:1.27.4
COPY --from=builder /app/dist /app
COPY nginx/default.conf /opt/bitnami/nginx/conf/server_blocks/app.conf
EXPOSE 8080
