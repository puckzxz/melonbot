FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm i -g typescript

RUN npm install

COPY . .

RUN tsc

RUN mkdir data

RUN find . -name "*.map" -type f -delete

VOLUME [ "/app/data" ]

WORKDIR /app

CMD ["node", "dist/bot.js"]
