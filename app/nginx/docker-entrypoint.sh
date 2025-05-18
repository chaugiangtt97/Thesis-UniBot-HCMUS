#!/bin/sh
set -e

# File config chính của Nginx
NGINX_CONF="/etc/nginx/nginx.conf"
TEMPLATE_CONF="/etc/nginx/nginx.conf.template"

# Ưu tiên sử dụng template nếu tồn tại
if [ -f "$TEMPLATE_CONF" ]; then
    echo "Generating nginx.conf from template..."
    envsubst '${SERVER_NAME} ${SUBDIR} ${CLIENT_HOST} ${CLIENT_PORT} ${NODE_HOST} ${NODE_PORT} ${PYTHON_HOST} ${PYTHON_PORT}' \
    < "$TEMPLATE_CONF" > "$NGINX_CONF"
else
    echo "No template found, using existing nginx.conf."
fi

exec "$@"
