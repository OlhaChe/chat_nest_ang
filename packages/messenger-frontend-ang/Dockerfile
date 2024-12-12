FROM node:18.20.2-alpine AS build

ARG api_url

ENV API_URL=${api_url}
ENV PRODUCTION=true

WORKDIR /app
COPY . .
RUN npm config set registry https://registry.npmjs.org/
RUN npm install
RUN npm run set-env


RUN npm run build

FROM nginx:alpine

COPY config/default.conf.template /etc/nginx/nginx.conf.template
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist/* /usr/share/nginx/html/
#COPY --from=build /usr/share/nginx/html/browser/* /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
