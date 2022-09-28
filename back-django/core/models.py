from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth import get_user_model

class User(AbstractUser):
    description = models.CharField(max_length=500,blank=True,null=True)

class Publication(models.Model):
    title = models.CharField(max_length=50,blank=True,null=True)
    authors = models.ManyToManyField(User,related_name='publications')
    date_publication = models.DateTimeField(auto_created=True,null=True,blank=True)
    text = models.CharField(max_length=500,blank=True,null=True)

class Friend(models.Model):
    friends = models.ManyToManyField(User,blank=True,related_name='friends_list')
    user = models.OneToOneField(User, on_delete=models.CASCADE,related_name='friends')
    request_friends = models.ManyToManyField(User,blank=True,related_name='request_friends')
