-include .env
export

setup:
	sh bin/setup

up:
	docker compose up -d

down:
	docker compose down

migrate:
ifeq ($(APP_DEV),true)
	sh bin/migrate dev
else
	sh bin/migrate deploy
endif
