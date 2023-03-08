FROM node:18-alpine

WORKDIR /app
RUN mkdir data

COPY package*.json ./
RUN npm install

COPY . .

CMD [ "node", "server.js" ]