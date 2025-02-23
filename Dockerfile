# Use official Node.js image
FROM node:18-alpine

# Install build dependencies
RUN apk add --no-cache python3 make g++ linux-headers

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies and rebuild bcrypt specifically
RUN npm install && npm rebuild bcrypt --build-from-source

# Copy all source files
COPY . .

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "start"]