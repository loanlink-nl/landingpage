FROM caddy:alpine
COPY ./public/ /srv/
COPY ./Caddyfile /etc/caddy/Caddyfile
