FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the Vite application
RUN npm run build

# Use a lightweight Node image for serving
FROM node:20-alpine

WORKDIR /app

# Install the 'serve' static web server globally
RUN npm install -g serve

# Copy the build output from the builder stage
COPY --from=builder /app/dist ./dist

# Expose the port that serve will use
EXPOSE 3000

# Start the server, routing all requests to index.html (-s)
CMD ["serve", "-s", "dist", "-l", "3000"]
