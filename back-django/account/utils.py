from .models import MessagePrivate, ChatPrivate, MessageGroup,ChatGroup
from django.db.models import Q

def number_no_watched_private_message(user_from,user_to):
    try :
        ChatPrivate.get_chat(user_from.id, user_to.id)
        count = MessagePrivate.objects.filter(watched = False,user_to=user_to,user_from=user_from).count()
        return count
    except:
        return 0

def number_no_watched_group_message(user_from,chat_id):
    ChatGroup.objects.get(id = chat_id)
    count = MessageGroup.objects.filter(chat_group__id=chat_id).count() - MessageGroup.objects.filter(chat_group__id=chat_id,watched_users__id__contains=user_from.id).count()
    return count