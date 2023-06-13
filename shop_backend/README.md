# Shop
Shop web application backend for dissertation project

## Installation

Install Docker for Desktop/Mac and make sure it's running.

⚠️ Before cloning this repository make sure Git does not perform any conversions when checking out or committing text files. (`core.autocrlf` is set to `false`).

Set the environment variables in `shop-backend` directory
```bash
cp .env.development.sample .env 
```

Build the docker image in `shop-backend` directory
```bash
docker build -t shop-backend .
```

Start up services in `shop-backend` directory
```bash
docker compose up
```

The running services are
 - `shop-backend` that uses `manage.py runserver` with autoreload functionality
 - `shop-db` that holds the PostgreSQL database

## Using already existing database (Optional)

⚠️ Before running migrate for the first time, follow these steps.

Save the SQL dump file in `db` directory
```bash
cp 002-dump.sql.example 002-dump.sql
```

Restore the database in `db` directory (the `shop-db` service must be running)
```bash
cat 002-dump.sql | docker exec -i shop-db psql -U postgres
```

## Creating a new database

Enter the container from the `shop-backend` directory
```bash
docker exec -it shop-backend bash
```

Apply the existing migrations with
```bash
python manage.py migrate
```

Create a superuser account for admin purposes
```bash
python manage.py createsuperuser
```

## Back-up current database (Optional)

From the `shop-backend` directory run
```bash
docker exec shop-db pg_dumpall -U postgres > db/002-dump.sql
```
