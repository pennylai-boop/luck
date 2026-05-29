FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

ARG NEXT_PUBLIC_SITE_URL=https://lucky-draw-u5bq4dbqdq-de.a.run.app
ARG NEXT_PUBLIC_GOOGLE_ADS_CLIENT
ARG NEXT_PUBLIC_GOOGLE_ADS_SLOT

ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_GOOGLE_ADS_CLIENT=$NEXT_PUBLIC_GOOGLE_ADS_CLIENT
ENV NEXT_PUBLIC_GOOGLE_ADS_SLOT=$NEXT_PUBLIC_GOOGLE_ADS_SLOT

RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
