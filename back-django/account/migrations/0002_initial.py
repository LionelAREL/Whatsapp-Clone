# Generated by Django 4.1.1 on 2022-12-07 23:58

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('account', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='user_from',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='user_from', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='chat',
            name='users',
            field=models.ManyToManyField(to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='messageprivate',
            name='chat',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messagePrivate', to='account.chatprivate'),
        ),
        migrations.AddField(
            model_name='messageprivate',
            name='user_to',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='user_to', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='messagegroup',
            name='chat_group',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_query_name='chat_group', to='account.chatgroup'),
        ),
        migrations.AddField(
            model_name='messagegroup',
            name='watched_users',
            field=models.ManyToManyField(blank=True, related_query_name='watched_users', to=settings.AUTH_USER_MODEL),
        ),
    ]
