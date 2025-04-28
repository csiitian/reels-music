# Base image with Node.js
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy only package.json and package-lock.json first
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy rest of the app
COPY . .

# Build React app (this step creates the production-ready build folder)
RUN npm run build

# Install serve package globally to serve the build folder
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Start serving the build folder
CMD ["serve", "-s", "build", "-l", "3000"]
