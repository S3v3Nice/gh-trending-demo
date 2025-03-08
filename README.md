# GitHub Trending Repositories Service

This project is a service that periodically retrieves trending repositories from GitHub and stores them in a PostgreSQL database. It provides a REST API and a CLI client for retrieving stored repositories and triggering manual synchronization.

## Features
- Fetch trending repositories from GitHub every `SYNC_DELAY` minutes.
- Store retrieved repositories in PostgreSQL.
- REST API to fetch repositories by name, ID, or retrieve all.
- CLI client for easy interaction.
- Dockerized setup for easy deployment.

## Requirements
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- [Make](https://www.gnu.org/software/make/)

## Setup & Usage

### Initial Setup
Run the following command to build the Docker images, install dependencies, create the `.env` file, set up the database password, and run migrations:
```sh
make setup
```

### Start the Service
Launch the service using:
```sh
make up
```
By default, the server will be accessible at: [http://localhost:3000](http://localhost:3000)

### Stop the Service
To stop the service, run:
```sh
make down
```

### CLI Client
You can interact with the service via the CLI client using:
```sh
npx cli <command>
```

## API Endpoints
| Method | Endpoint                         | Description                      |
|--------|----------------------------------|----------------------------------|
| GET    | `/api/repositories`              | Get all repositories             |
| GET    | `/api/repositories/:id`          | Get repository by ID             |
| GET    | `/api/repositories/:owner/:name` | Get repository by name           |
| POST   | `/api/repositories/sync`         | Manually trigger synchronization |

## Environment Variables

The `.env` file contains the following configurations:
```env
DEBUG=true
PORT=3000

DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=gh_trending
DB_USER=gh_trending_user
DB_PASSWORD=
DB_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}?schema=public"

# Optional: Expands the GitHub API rate limits.
GITHUB_TOKEN=

# Number of repositories fetched per synchronization (Max: 1000).
SYNC_REPO_COUNT=1000

# Delay between synchronizations (in minutes).
SYNC_DELAY=60
```

Happy coding! 🚀
