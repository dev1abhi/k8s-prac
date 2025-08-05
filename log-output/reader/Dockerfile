FROM node:18-alpine
WORKDIR /app
COPY index.js .
RUN npm install express uuid
EXPOSE 3000
CMD ["node", "index.js"]
