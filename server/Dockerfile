FROM node:latest as base

WORKDIR /src
COPY package*.json /
EXPOSE 8080

FROM base as production
ENV NODE_ENV=production
RUN npm ci
COPY . /
CMD ["node", "/src/app.js"]

FROM base as dev
ENV NODE_ENV=development
RUN npm install -g nodemon && npm install
COPY . /
CMD ["nodemon", "/src/app.js"]