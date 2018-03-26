FROM node as builder
WORKDIR /build
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN npm run build

FROM node
WORKDIR /app
COPY package.json .
RUN npm install --production
COPY --from=builder /build/dist dist
CMD [ "npm", "start" ]
