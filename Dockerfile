#Frontend Nginx - serve static files and link services
FROM nginx:1.22-alpine
RUN apk update && apk add bash

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf


EXPOSE 80