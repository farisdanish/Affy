# Use Node.js as base
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files with correct ownership
COPY --chown=node:node package*.json ./

# M5: Use npm ci for deterministic builds
RUN npm ci

# M6: Run as non-root user
USER node

# Expose port (must match PORT in docker-compose.yml or .env)
EXPOSE 5000

# Start command
CMD ["node", "server/server.js"]
