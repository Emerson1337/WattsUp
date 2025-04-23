FROM node:23.11.0-alpine
WORKDIR /app

# Set timezone to America/Sao_Paulo
RUN apk add --no-cache tzdata \
    && cp /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime \
    && echo "America/Sao_Paulo" > /etc/timezone

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application code
COPY . .

RUN npx prisma generate

# Build the application
RUN npm run build

# Expose the port
EXPOSE 80

# Start the application
CMD ["npm", "run", "serve"]
