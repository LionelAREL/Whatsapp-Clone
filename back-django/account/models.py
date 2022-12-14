from django.db import models
from django.contrib.auth import get_user_model


class Chat(models.Model):
    users = models.ManyToManyField(get_user_model())
    last_update = models.DateTimeField(auto_created=True,blank=True,null=True)

class ChatPrivate(Chat):
    @staticmethod
    def get_chat(userId1,userId2):
        return ChatPrivate.objects.filter(users__id__icontains=userId1).filter(users__id__icontains=userId2).first()

    def __str__(self):
        return f'chatPrivate between {self.users.first()} and {self.users.last()}'

class ChatGroup(Chat):
    chat_name = models.CharField(max_length=50,default='')
    def __str__(self):
        usersNames = ""
        for user in self.users.all():
            if usersNames == "":
                usersNames =  user.username
            else:
                usersNames = usersNames + " - " + user.username
        return f'chatPrivate between {usersNames}'

class Message(models.Model):
    class TypeMessage(models.TextChoices):
        CHAT = 'DM'
        CALL = 'CL'
        FILE = 'FL'

    type_message = models.CharField(max_length=3,choices=TypeMessage.choices,default=TypeMessage.CHAT)
    file = models.CharField(max_length=500,default="",null=True)
    message = models.CharField(max_length=500,default="")
    date = models.DateTimeField(auto_now=True)
    call_token = models.CharField(max_length=500,null=True,blank=True)
    call_name = models.CharField(max_length=500,null=True,blank=True)
    user_from = models.ForeignKey(get_user_model(), on_delete=models.CASCADE,related_name="user_from",null=True)


class MessagePrivate(Message):
    user_to = models.ForeignKey(get_user_model(), on_delete=models.CASCADE,related_name="user_to",null=True)
    watched = models.BooleanField(default=False)
    chat = models.ForeignKey(ChatPrivate, on_delete=models.CASCADE,related_name="messagePrivate")
    def __str__(self):
        return f'Private message [{self.type_message}] from {self.user_from} to {self.user_to} : {self.message}'

class MessageGroup(Message):
    watched_users = models.ManyToManyField(get_user_model(),blank=True,related_query_name='watched_users')
    chat_group = models.ForeignKey(ChatGroup, on_delete=models.CASCADE,null=True,blank=True,related_query_name='chat_group')
    def __str__(self):
        return f'Private message [{self.type_message}] from {self.user_from} to chatGroup ({self.chat_group}) : {self.message}'
