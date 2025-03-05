#!/bin/bash

echo "Building service images..."
docker compose build

echo "Creating .env based on .env.example..."
docker compose run --rm --no-deps node-server cp .env.example .env

stty -echo
read -p "Enter DB_PASSWORD: " DB_PASSWORD
echo ""
stty echo

sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=\"$DB_PASSWORD\"/" .env

echo "Installing npm packages..."
docker compose run --rm --no-deps node-server npm install

echo "Done!"