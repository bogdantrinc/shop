#!/bin/bash

case $1 in
local-web)
    python manage.py runserver 0:8000
    ;;
post-install)
    python manage.py migrate --no-input
    python manage.py collectstatic --no-input
    ;;
test)
    pytest
    ;;
*)
    $1
    ;;
esac
