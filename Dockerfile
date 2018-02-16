# This docker file is used for gitlab CI only
# For local development, use docker-compose and Makefile
FROM node

WORKDIR /usr/src/app

ARG NODE_ENV=production
ENV NODE_ENV ${NODE_ENV}

COPY package.json .
RUN npm install
COPY . .

CMD [ "npm", "start" ]
