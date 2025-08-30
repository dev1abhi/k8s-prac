FROM alpine:3.20
RUN apk add --no-cache curl
COPY random-todo.sh /random-todo.sh
RUN chmod +x /random-todo.sh
CMD ["/random-todo.sh"]
