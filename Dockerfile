FROM caddy:2.8.4-alpine

COPY ./Caddyfile /etc/caddy/Caddyfile
COPY docs /usr/share/caddy

