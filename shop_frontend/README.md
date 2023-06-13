# Shop
Shop web application frontend for dissertation project

## Installation

Install Docker for Desktop/Mac and make sure it's running.

Set the environment variables in `shop-frontend` directory
```bash
cp .env.development.sample .env 
```
```bash
cp .env.development.sample .env.local
```

⚠️ For production, use `production` service instead of `development`

Build the docker image in `shop-frontend` directory
```bash
docker compose build development
```

Start up service in `shop-frontend` directory
```bash
docker compose up development
```
