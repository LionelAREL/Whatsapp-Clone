# Generated by Django 4.0.4 on 2022-06-11 12:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='publication',
            name='date_publication',
            field=models.DateTimeField(auto_created=True, blank=True, null=True),
        ),
    ]