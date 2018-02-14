
all: down build install start

build:
	docker-compose build

start:
	docker-compose up -d

down:
	docker-compose down

install:
	docker-compose run --rm app npm install && npm run build
	
test:
	docker-compose run --rm app npm test

logs:
	docker-compose logs -f

app-logs:
	docker-compose logs -f app

db-logs:
	docker-compose logs -f database

watch:
	docker-compose run --rm app npm run watch
