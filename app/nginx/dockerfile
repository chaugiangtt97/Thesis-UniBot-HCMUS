# FROM nginx:1.18.0
# # Copy template cấu hình và thư mục SSL vào container
# WORKDIR /usr/share/nginx/html
# COPY ./ssl /etc/nginx/ssl
# COPY ./nginx.conf /etc/nginx/nginx.conf
# # Tạo thư mục ssl nếu chưa có (tùy trường hợp)
# RUN mkdir -p /etc/nginx/ssl

# # COPY docker-entrypoint.sh /docker-entrypoint.sh
# # RUN chmod +x /docker-entrypoint.sh

# # ENTRYPOINT ["/docker-entrypoint.sh"]
# COPY ./nginx.conf /etc/nginx/templates/nginx.conf.template

# CMD ["nginx", "-g", "daemon off;"]

# # ENTRYPOINT ["/bin/sh", "-c", "envsubst < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && exec nginx -g 'daemon off;'"]


FROM nginx:1.23.1-alpine


COPY ./nginx.conf /etc/nginx/templates/nginx.conf.template
COPY ./index.html /usr/share/nginx/html/index.html
COPY ./ssl /etc/nginx/ssl

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]