# Vite 8 needs Node ^20.19 or >=22.12
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
# Must match `base` in vite.config.js and the location in nginx.conf
RUN mkdir -p /usr/share/nginx/html/AUTO_SHEET_EVALUATOR

# Copy the built assets into the base directory
COPY --from=builder /app/dist /usr/share/nginx/html/AUTO_SHEET_EVALUATOR

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
