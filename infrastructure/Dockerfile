FROM node:20
RUN apt-get update && apt-get install -y nano git cron
RUN npm install -g pm2

WORKDIR /var/www/html

# Copy package files first to leverage Docker cache
COPY package*.json ./
RUN npm install

# Copy all frontend files
COPY . . 

# Ensure server.js is copied
COPY server.js .

RUN npm run build
EXPOSE 8080

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
