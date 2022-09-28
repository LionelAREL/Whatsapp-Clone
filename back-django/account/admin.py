from django.contrib import admin
from . import models

admin.site.register(models.MessagePrivate)
admin.site.register(models.MessageGroup)
admin.site.register(models.ChatPrivate)
admin.site.register(models.ChatGroup)
