cp 002-dump.sql.example 002-dump.sql
cat ./db/002-dump.sql | docker exec -i shop-db psql -U postgres
python manage.py startapp products
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
