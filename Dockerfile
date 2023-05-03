FROM node:19 AS build

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY . ./
RUN npm install
RUN npm run build

FROM  --platform=linux/amd64 nginx:1.19-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /app