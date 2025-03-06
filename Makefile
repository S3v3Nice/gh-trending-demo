include .env
export

setup:
	sh bin/setup.sh

up:
	docker compose up -d

down:
	docker compose down

migrate:
	sh bin/migrate.sh