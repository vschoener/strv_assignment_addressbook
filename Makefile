
all: down build install app-build start

build:
	docker-compose build

start:
	docker-compose up -d

down:
	docker-compose down

prod:
	docker-compose -f docker-compose.yml up

install:
	docker-compose run --rm app npm install

app-build: install
	docker-compose run --rm app npm run build

logs:
	docker-compose logs -f

app-logs:
	docker-compose logs -f app

db-logs:
	docker-compose logs -f database

watch:
	docker-compose run --rm app npm run watch
