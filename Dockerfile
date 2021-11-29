FROM node:12

WORKDIR /usr/src/app

COPY package.json ./

COPY yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 4000

RUN yarn --cwd ./client/ build

WORKDIR /usr/src/app/api

CMD [ "./node_modules/.bin/ts-node-transpile-only", "./src/index.ts" ]