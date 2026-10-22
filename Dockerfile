
FROM node:22-alpine

WORKDIR /app

# Copy dependency manifests first for better Docker caching
COPY package.json package-lock.json ./

# Install production dependencies with a timeout
RUN npm ci --omit=dev --no-audit --no-fund --fetch-retries=2 --fetch-timeout=60000

# Copy the remaining application files
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]

