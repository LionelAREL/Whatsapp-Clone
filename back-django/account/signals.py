from django.core.exceptions import ValidationError
from .models import ChatPrivate, ChatGroup
from django.dispatch import receiver
from django.db.models.signals import m2m_changed,post_save,pre_save
from django.contrib.auth import get_user_model
from core.models import Friend


@receiver(m2m_changed, sender=ChatPrivate.users.through)
def users_max(sender, **kwargs):
    cp = kwargs['instance']
    if cp.__class__ == ChatPrivate and cp.users.count() != 2 and cp.users.count() !=0:
        raise ValidationError("users can not be different than 2 users on private chat")

@receiver(post_save, sender=get_user_model())
def create_friends_list(sender, **kwargs):
    user = kwargs['instance']
    if(Friend.objects.filter(user=user).exists()):
        return
    Friend.objects.create(user=user)
