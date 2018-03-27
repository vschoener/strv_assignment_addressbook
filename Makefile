# Build, recreate and start
all: start

up: start

build:
	docker-compose build

build-ts:
	docker-compose run --rm app npm run build:ts

start:
	docker-compose up -d

down:
	docker-compose down

stop:
	docker-compose stop
	docker-compose -f docker-compose.test.yml stop

install:
	docker-compose run --rm app npm install && npm run build

logs:
	docker-compose logs -f

app-logs:
	docker-compose logs -f app

db-logs:
	docker-compose logs -f database

watch:
	docker-compose run --rm --service-ports app npm run watch

build-test:
	docker-compose -f docker-compose.test.yml build

test:
	docker-compose -f docker-compose.test.yml up --abort-on-container-exit
