# Use Node.js as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy only package.json and package-lock.json to the container
COPY package*.json ./

# Install only the Playwright dependency and any necessary packages
RUN npx -y playwright@1.48.1 install --with-deps


# Copy the rest of your application code (e.g., googleSearch.js)
COPY googleSearch.js ./

# Run the application
CMD ["node", "googleSearch.js"]
