FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Expose the standard CRA port
EXPOSE 3000

# Start development server
CMD ["npm", "start"]
