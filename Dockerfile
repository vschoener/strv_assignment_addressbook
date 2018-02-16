# This docker file is used for gitlab CI only
# For local development, use docker-compose and Makefile
FROM node

WORKDIR /usr/src/app

COPY package.json .
RUN npm install --quiet
COPY . .

CMD [ "npm", "start" ]
