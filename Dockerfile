# Use Node.js as the base image
FROM ubuntu:20.04

# Set the working directory in the container
WORKDIR /app

# Copy only package.json and package-lock.json to the container
COPY package*.json ./

RUN sudo apt-get install -y wget curl libx11-dev libxcomposite-dev libxrandr-dev libglu1-mesa libxi6 libgdk-pixbuf2.0-0 libnss3 libatk-bridge2.0-0 libatk1.0-0 libcups2 libxkbcommon0 libxss1 libxtst6 libgtk-3-0

# Install dependencies including Playwright and Express
RUN npm install express && npx -y playwright install --with-deps


# Copy the rest of your application code (e.g., googleSearch.js)
COPY googleSearch.js ./

# Run the application
CMD ["node", "googleSearch.js"]
# RUN node googleSearch.js