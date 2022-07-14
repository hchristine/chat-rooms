FROM node:18-alpine

WORKDIR /rewritedChat

COPY . .

RUN npm install

ENTRYPOINT npm start