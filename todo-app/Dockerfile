FROM node:18-alpine

# Setting working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copying rest of the application code
COPY . .


CMD ["npm", "start"]
