# Use Node.js as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Install required dependencies for Playwright on a Linux-based system (for headless mode)
RUN apt-get update && apt-get install -y \
  wget \
  curl \
  libx11-dev \
  libxcomposite-dev \
  libxrandr-dev \
  libglu1-mesa \
  libxi6 \
  libgdk-pixbuf2.0-0 \
  libnss3 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libxkbcommon0 \
  libxss1 \
  libxtst6 \
  libgtk-3-0 \
  && rm -rf /var/lib/apt/lists/*

# Copy only package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies (including playwright and required dependencies)
RUN npm install

# Install the Playwright browsers
RUN npx playwright install --with-deps

# Copy the rest of your application code (e.g., googleSearch.js)
COPY googleSearch.js ./

# Expose the application port
EXPOSE 3000

# Run the application (example: using Google search and Playwright)
CMD ["node", "googleSearch.js"]
