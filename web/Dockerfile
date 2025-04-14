FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install

# Copy the rest of the code
COPY . .

# Expose port 8080 to match vite.config.ts
EXPOSE 8080

# Command to run the app in development mode with host binding
CMD ["pnpm", "run", "dev", "--host", "0.0.0.0"] 