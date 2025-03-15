# Use a Node.js 20 base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend application code into the container
COPY . .

# Build the React app
RUN npm run build

# Expose the port your app will run on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]