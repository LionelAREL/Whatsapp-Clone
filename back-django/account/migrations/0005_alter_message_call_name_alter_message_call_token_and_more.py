# Generated by Django 4.1.1 on 2022-12-07 13:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0004_alter_message_call_name_alter_message_call_token'),
    ]

    operations = [
        migrations.AlterField(
            model_name='message',
            name='call_name',
            field=models.CharField(max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='message',
            name='call_token',
            field=models.CharField(max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='message',
            name='message',
            field=models.CharField(max_length=1000),
        ),
    ]
