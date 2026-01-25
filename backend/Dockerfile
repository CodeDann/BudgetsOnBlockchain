# Dockerfile for microservice
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy all source code from ./src into /app/src
COPY src ./src

# Set working directory to /app/src (where index.js is)
WORKDIR /app/src

# Expose port if needed (optional)
EXPOSE 5000

# Start the microservice
CMD ["node", "server.js"]
