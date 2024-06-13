FROM node:lts

WORKDIR /app

COPY . .

RUN npm i

CMD [ "npm", "start" ]