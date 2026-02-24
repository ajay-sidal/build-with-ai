FROM mcr.microsoft.com/playwright:focal

WORKDIR /app

# Install dependencies (uses package-lock or pnpm lock if present)
COPY package.json .
COPY package-lock.json* ./
COPY pnpm-lock.yaml* ./
RUN npm ci --prefer-offline --no-audit --no-fund

# Copy source and build
COPY . .
RUN npm run build

EXPOSE 3000

# Run the CI runner script by default
CMD ["bash", "./ci/run-playwright.sh"]
