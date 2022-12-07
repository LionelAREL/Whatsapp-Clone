from channels.db import database_sync_to_async
from account.models import MessagePrivate,ChatPrivate,ChatGroup,MessageGroup
from django.contrib.auth import get_user_model
from datetime import datetime

import sys
import unittest
import os
import time
from random import randint

sys.path.append(os.path.join(os.path.dirname(__file__), '../agoraBuilder'))
from RtcTokenBuilder import *

appID = "d2160e16d6634613aba0588ea88fc4d8"
appCertificate = "bba9c8306e40480fbcb2eddc08374ec9"


@database_sync_to_async
def createPrivateMessage(user_from,user_to,message):
    #check if chatPrivate exist
    chat_private = ChatPrivate.get_chat(user_from.id, user_to.id)
    if not chat_private:
        chat_private = ChatPrivate.objects.create()
        chat_private.users.add(user_from,user_to)
        print(f"create private chat {chat_private}")
    #create message
    message_save = MessagePrivate.objects.create(user_from=user_from,user_to=user_to,message=message,chat=chat_private)
    chat_private.last_update = datetime.now()
    chat_private.save()
    print(f"create message {message_save}")

@database_sync_to_async
def createPrivateMessageFile(user_from,user_to,message,file):
    #check if chatPrivate exist
    chat_private = ChatPrivate.get_chat(user_from.id, user_to.id)
    if not chat_private:
        chat_private = ChatPrivate.objects.create()
        chat_private.users.add(user_from,user_to)
        print(f"create private chat {chat_private}")
    #create message
    message_save = MessagePrivate.objects.create(user_from=user_from,user_to=user_to,message=message,chat=chat_private,file=file,type_message='FL')
    chat_private.last_update = datetime.now()
    chat_private.save()
    print(f"create message {message_save}")

@database_sync_to_async
def createPrivateCalling(user_from,user_to,message):
    #check if chatPrivate exist
    chat_private = ChatPrivate.get_chat(user_from.id, user_to.id)
    if not chat_private:
        chat_private = ChatPrivate.objects.create()
        chat_private.users.add(user_from,user_to)
        print(f"create private chat {chat_private}")
    #create message
    token,channelName = createToken()
    message_save = MessagePrivate.objects.create(user_from=user_from,user_to=user_to,message=message,chat=chat_private,type_message='CL',call_token=token,call_name=channelName)
    chat_private.last_update = datetime.now()
    chat_private.save()
    print(f"create message {message_save}")

@database_sync_to_async
def createGroupMessage(user_from,chat_group,message):
    #create message
    message_save = MessageGroup.objects.create(user_from=user_from,message=message,chat_group=chat_group)
    message_save.watched_users.add(user_from)
    message_save.save()
    chat_group.last_update = datetime.now()
    chat_group.save()
    print(f"create calling {message_save}")

@database_sync_to_async
def createGroupMessageFile(user_from,chat_group,message,file):
    #create message
    message_save = MessageGroup.objects.create(user_from=user_from,message=message,chat_group=chat_group,file=file,type_message="FL")
    message_save.watched_users.add(user_from)
    message_save.save()
    chat_group.last_update = datetime.now()
    chat_group.save()
    print(f"create calling {message_save}")

@database_sync_to_async
def createGroupCalling(user_from,chat_group,message):
    #create message
    token,channelName = createToken()
    message_save = MessageGroup.objects.create(user_from=user_from,message=message,chat_group=chat_group,type_message='CL',call_token=token,call_name=channelName)
    message_save.watched_users.add(user_from)
    message_save.save()
    chat_group.last_update = datetime.now()
    chat_group.save()
    print(f"create calling {message_save}")

    
@database_sync_to_async
def getIdChatPrivate(user_from,user_to):
    #check if chatPrivate exist
    return ChatPrivate.get_chat(user_from, user_to)

@database_sync_to_async
def getIdChatGroup(chat_group_id):
    return ChatGroup.objects.get(id = chat_group_id)


@database_sync_to_async
def getUserById(user_id):
    return get_user_model().objects.filter(id=user_id).first()

@database_sync_to_async
def addToRequestList(user_from,user_to):
    user_to.friends.request_friends.add(user_from)
    user_to.save()

@database_sync_to_async
def deleteToRequestList(user_from,user_to):
    user_from.friends.request_friends.remove(user_to)
    user_from.save()

@database_sync_to_async
def addToFriendList(user_from,user_to):
    user_to.friends.friends.add(user_from)
    user_from.friends.friends.add(user_to)
    user_to.save()

@database_sync_to_async
def watchedAllMessagePrivate(user_from,user_to):
    try:
        chat_private = ChatPrivate.get_chat(user_from.id, user_to.id)
        MessagePrivate.objects.filter(user_from = user_from,user_to=user_to).update(watched=True)
    except:
        pass

@database_sync_to_async
def watchedAllMessageGroup(user_from,chat):
    chat_group = ChatGroup.objects.get(id = chat.id)
    for message in MessageGroup.objects.filter(chat_group = chat_group):
        message.watched_users.add(user_from)
        message.save()


@database_sync_to_async
def getChatGroup(chat_group_id):
    return ChatGroup.objects.get(id=chat_group_id)

@database_sync_to_async
def getAllChatGroup(user_from):
    return list(ChatGroup.objects.filter(users__id__contains=user_from.id))

@database_sync_to_async
def getUsersInChatGroup(chat_group):
    return list(chat_group.users.all())



def createToken():
    channelName = str(round(time.time()))
    uid = 0
    expireTimeInSeconds = 3600
    currentTimestamp = int(time.time())
    privilegeExpiredTs = currentTimestamp + expireTimeInSeconds
    userAccount = 0

    token = RtcTokenBuilder.buildTokenWithAccount(appID, appCertificate, channelName, userAccount, Role_Attendee, privilegeExpiredTs)
    return token,channelName