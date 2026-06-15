FROM nginx:alpine

# Copy the static site into nginx's default serve directory
COPY . /usr/share/nginx/html

# Remove the default nginx config and replace with a clean one
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
