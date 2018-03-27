[![pipeline status](https://gitlab.com/vschoener/addressbook/badges/master/pipeline.svg)](https://gitlab.com/vschoener/addressbook/commits/master) [![coverage report](https://gitlab.com/vschoener/addressbook/badges/master/coverage.svg)](https://gitlab.com/vschoener/addressbook/commits/master)

# Address Book Service

It's a service exposing a REST API that allows to manage an address book

## Pre Requirement

Project uses `Docker` and a Makefile to build, install, test, start the project directly in a container.

Also, you can do it without docker using Node.JS and NPM locally.


## Build Install and Run

### Docker

Copy/paste the the `.env.docker` file to `.env` You can customize it a little, but mostly
everythings is set for Docker usage.

Build and run the services:
```bash
# To build and start the containers
make 
```

Then run this command to install:
```bash
# Install app
make install
```

Separate commands:
```bash
# Only Build the container image
make build

# Install app
make install

# Run container
make start

# Stops containers and removes containers, networks, volumes, and
# images created by up
make down

# Watch files
make watch
```

### Locally with Node.JS and NPM

Copy and paste the `.env.sample` as `.env` and setup the information as
- Mongo
- Log
- Env type
- Express port

And use those following commands
```bash
npm install
npm run build
npm start
```

Watch and rebuild asset file during the development:
```bash
npm run watch
```

## Test

This command's gonna start 2 containers (mongo db server and the app test)
```bash
make test
```

Things to improve:
------------------
- Use mongo db memory to speed up the test and not having a mongo server

## Deploy

Actually the deployment is only handle for staging. If a PR is made for
the staging branch, GITLAB CI will automatically merge it on staging if:
- The build is right
- The test are OK

It use a docker image from the Dockerfile of the project.

Things we can improve:
----------------------
- Add a production stage for GITLAB CI with manual validation from staging code.
- Add a tag to deploy docker image from version and having the possibility to rollback
- Add a new build stage in the Dockerfile to have 'test'
- Use the Docker image in the GitlabCI test stage. I tried a few times to used it instead using the repository and manual npm test command.
