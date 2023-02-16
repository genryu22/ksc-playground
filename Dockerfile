FROM node:18.14.0 AS build_frontend

WORKDIR /app

COPY ./frontend/package*.json /app/
RUN npm install

COPY ./frontend/src/ /app/src
COPY ./frontend/tsconfig.json /app/
COPY ./frontend/webpack.config.js /app/
RUN npm run build

FROM node:18.14.0 AS build_server

WORKDIR /app

COPY ./package*.json /app
RUN npm install

COPY ./src /app/src

COPY ./tsconfig.json /app
RUN npm run build

FROM denoland/deno:bin-1.30.3 AS deno

FROM node:18.14.0 AS exec_server

WORKDIR /app

COPY --from=build_frontend /app/dist/ /app/frontend/dist/
COPY --from=build_server /app/dist /app/dist
COPY --from=build_server /app/node_modules /app/node_modules
COPY --from=deno /deno /usr/local/bin/

COPY ./deno /app/deno

CMD [ "node", "./dist/index.js" ]