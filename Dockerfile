# Use an official Ubuntu as a parent image
FROM ubuntu:20.04

# Set non-interactive installation mode to avoid prompts
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    wget \
    curl \
    libflite-dev \
    libgnutls30 \
    libevdev2 \
    libpcre3 \
    libffi7 \
    libx264-dev \
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
    && apt-get clean

# Install Node.js (LTS version 18) and npm
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean

# Install Playwright
RUN npm install -g playwright

# Install other application dependencies (if needed, specify your package.json)
COPY package.json /app/package.json
WORKDIR /app
RUN npm install

# Copy your application code to the container
COPY . /app

# Expose port (if necessary)
EXPOSE 3000

# Command to run your app (replace with your app's start command)
CMD ["node", "googleSearch.js"]
