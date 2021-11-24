FROM node:12

WORKDIR /usr/src/app

COPY package.json ./

COPY yarn.lock ./

RUN yarn install

COPY ./api/package.json ./api/

COPY ./api/yarn.lock ./api/

RUN yarn --cwd ./api/ install

COPY ./client/package.json ./client/

COPY ./client/yarn.lock ./client/

RUN yarn --cwd ./client/ install

COPY . .

EXPOSE 4000

RUN yarn --cwd ./client/ build

WORKDIR /usr/src/app/api

CMD [ "./node_modules/.bin/ts-node-transpile-only", "./src/app.ts" ]