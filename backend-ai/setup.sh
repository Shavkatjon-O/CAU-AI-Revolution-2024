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

# create super user
python manage.py shell -c "
from apps.users.models import User;
if not User.objects.filter(email='admin@gmail.com').exists():
    User.objects.create_superuser('admin@gmail.com', 'admin');
else:
    pass
"
exec "$@"