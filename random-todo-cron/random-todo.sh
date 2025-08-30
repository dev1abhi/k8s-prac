#!/bin/sh
# random-todo.sh

# Fetch redirect location (Wikipedia random article)
ARTICLE_URL=$(curl -s -L -o /dev/null -w '%{url_effective}' https://en.wikipedia.org/wiki/Special:Random)

# Post todo to backend
curl -s -X POST "$TODO_BACKEND_URL/api/todos" \
  -H "Content-Type: application/json" \
  -d "{\"text\": \"Read $ARTICLE_URL\"}"
