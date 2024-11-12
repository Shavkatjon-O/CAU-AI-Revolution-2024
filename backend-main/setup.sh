#!/bin/bash

check_postgres_connection() {
    while ! pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER"; do
        echo "Waiting for PostgreSQL to become available..."
        sleep 1
    done
    echo "PostgreSQL is available."
}

check_postgres_connection

python manage.py migrate
python manage.py collectstatic --no-input

exec "$@"
