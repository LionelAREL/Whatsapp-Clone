#!/bin/bash
# deplace to project directory
cd /home/ubuntu/angular-django-ecommerce/django-ecommerce

#migrations
source env/bin/activate
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py collectstatic --no-input
# restart all services 
systemctl restart nginx
systemctl restart gunicorn
