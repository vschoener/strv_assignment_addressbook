FROM node:alpine as installer
WORKDIR /install
COPY package.json .
COPY package-lock.json .
RUN npm install

FROM node:alpine as builder
WORKDIR /build
COPY --from=installer /install .
COPY ./src src
COPY tsconfig.json .
RUN npm run build

FROM node:alpine
WORKDIR /app
COPY package.json .
RUN npm install --production
COPY --from=builder /build/dist dist
CMD [ "npm", "start" ]
