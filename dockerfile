# Development Dockerfile for NestJS GraphQL application
# Uses Node.js 24 Alpine for a lightweight development environment
FROM node:24-alpine AS development

# Create necessary directories and set ownership for the node user
RUN mkdir -p /home/node/app/node_modules /home/node/app/src /home/node/app/dist && \
    chown -R node:node /home/node/app

# Set environment to development
ENV NODE_ENV=development

# Set working directory
WORKDIR /home/node/app

# Install pnpm package manager globally
RUN npm install -g pnpm

# Copy package files for dependency installation
COPY package.json pnpm-lock.yaml ./

# Install PM2 process manager globally for development
RUN pnpm add -g pm2

# Install project dependencies
RUN pnpm install

# Switch to non-root user
USER node

# Copy application source code
COPY --chown=node:node . .

# Build the application
RUN pnpm run build

# Expose port 3000
EXPOSE 3000

# Set stop signal for graceful shutdown
STOPSIGNAL SIGINT

# Start the application with PM2 runtime
CMD ["pm2-runtime","dist/main.js"]
