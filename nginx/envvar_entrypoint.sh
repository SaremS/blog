#!/usr/bin/env sh
set -eu

envsubst '${KUBERNETES_NAMESPACE}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

exec "$@"