# Use an official Ubuntu as a parent image
FROM node:18.x

# Set non-interactive installation mode to avoid prompts
ENV DEBIAN_FRONTEND=noninteractive



# Install Playwright
RUN npm install -g playwright

RUN npx playwright install-deps chromium

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
