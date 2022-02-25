FROM node:12

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
COPY api/package.json api/tsconfig.json ./api/
COPY client/package.json client/tsconfig.json ./client/

RUN yarn

COPY . .

EXPOSE 7878

RUN GENERATE_SOURCEMAP=false yarn build

CMD [ "node", "./api/dist/index.js" ]
