#!/bin/bash

if [ "$DEBUG" = "true" ]; then
  MIGRATE_COMMAND="npx prisma migrate dev"
else
  MIGRATE_COMMAND="npx prisma migrate deploy"
fi

echo "Running $MIGRATE_COMMAND..."

if [ -z `docker compose ps -q node-server` ] || [ -z `docker ps -q --no-trunc | grep $(docker compose ps -q node-server)` ]; then
  docker compose run --rm node-server $MIGRATE_COMMAND
  docker compose down
else
  docker exec -it node-server $MIGRATE_COMMAND
fi