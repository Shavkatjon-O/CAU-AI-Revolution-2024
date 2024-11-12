#!/bin/bash

NGINX_CONF_NAME="cau-hackathon.conf"
NGINX_CONF_SOURCE="./nginx.conf"

SITES_AVAILABLE="/etc/nginx/sites-available/$NGINX_CONF_NAME"
SITES_ENABLED="/etc/nginx/sites-enabled/$NGINX_CONF_NAME"

sudo cp "$NGINX_CONF_SOURCE" "$SITES_AVAILABLE"

if [ ! -L "$SITES_ENABLED" ]; then
    sudo ln -s "$SITES_AVAILABLE" "$SITES_ENABLED"
fi

sudo nginx -t && sudo systemctl reload nginx
