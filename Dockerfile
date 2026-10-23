# syntax=docker/dockerfile:1
FROM node:24-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS=--max-old-space-size=1536
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build
ARG SOURCE_COMMIT=local
RUN node -e "require('node:fs').writeFileSync('out/release.json',JSON.stringify({app:'cartunez-cinematic',experience:'ignition-11',revision:process.env.SOURCE_COMMIT}))"

FROM nginxinc/nginx-unprivileged:stable-alpine AS runtime
COPY deploy/nginx-container.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/out /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
