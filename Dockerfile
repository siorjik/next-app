FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json /app
COPY yarn.lock /app/

RUN yarn install

COPY . .

RUN yarn build

CMD [ "yarn", "start" ]
# CMD [ "yarn", "dev" ]
