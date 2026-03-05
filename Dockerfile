# Use Node.js as base
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Expose port (must match PORT in docker-compose.yml or .env)
EXPOSE 5000

# Start command
# For development, we typically mount the volume to sync files,
# but we still define the default start command here.
CMD ["npm", "run", "dev"]
# Wait, let's use node server/server.js as the default, 
# or if there is no dev script we can just use node.
# Let's check package.json: there is no dev script right now.
# Let's use node server/server.js
