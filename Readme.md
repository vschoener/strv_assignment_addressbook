[![pipeline status](https://gitlab.com/vschoener/addressbook/badges/master/pipeline.svg)](https://gitlab.com/vschoener/addressbook/commits/master) [![coverage report](https://gitlab.com/vschoener/addressbook/badges/master/coverage.svg)](https://gitlab.com/vschoener/addressbook/commits/master)

# Address Book Service

It's a service exposing a REST API that allows to manage an address book

## Pre Requirement

Project uses `Docker` and a Makefile to build, install, test, start the project directly in a container.

Also, you can do it without docker using Node.JS and NPM locally.


## Build Install and Run

### Docker

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

```bash
make test
```

## Deploy

Coming soon
