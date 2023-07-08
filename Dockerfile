FROM nginx:1.22-alpine
RUN apk update && apk add bash

COPY ./docs/ /www/data/
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80