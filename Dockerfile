FROM oven/bun:1.3.9-alpine AS build

WORKDIR /app

COPY package.json bun.lock /app/
COPY tsconfig.json /app/
COPY public /app/public
COPY index.html /app/
COPY src /app/src

RUN bun install --frozen-lockfile && \ 
    bun run build

FROM nginx:stable-alpine-perl

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]