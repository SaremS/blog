#Frontend Nginx - serve static files and link services
FROM nginx:1.22-alpine
RUN apk update && apk add bash

COPY ./nginx/envvar_entrypoint.sh /
COPY ./nginx/nginx.conf.template /etc/nginx/nginx.conf.template

EXPOSE 80
ENTRYPOINT ["/envvar_entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]