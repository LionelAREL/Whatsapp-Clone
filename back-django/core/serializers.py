from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Publication
from account.models import ChatGroup,ChatPrivate,MessagePrivate,MessageGroup
from account.utils import number_no_watched_private_message,number_no_watched_group_message

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id','username']

class PublicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publication
        fields = ['id','title']

class PublicationDetailSerializer(serializers.ModelSerializer):
    authors = UserSerializer(many=True)
    class Meta:
        model = Publication
        fields =  ['id','title','text','authors','text']

class PublicationListSerializer(serializers.ModelSerializer):
    authors = UserSerializer(many=True)
    class Meta:
        model = Publication
        fields = ['id','title','authors','text']
        
class PublicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publication
        fields = ['id','title','authors','text']
    def validate_authors(self,value):
        if self.context['request'].user in value:
            return value
        print(value)
        value.append(self.context['request'].user)
        return value

class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['username','password']
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = get_user_model()(**validated_data)
        user.set_password(password)
        user.save()
        return user
        

class UserDetailSerializer(serializers.ModelSerializer):
    allow_null = True
    publications = PublicationSerializer(many=True)
    class Meta:
        model = get_user_model()
        fields = ['id','username', 'first_name', 'last_name','last_login','description','publications']
    

class UserListSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()
    class Meta:
        model = get_user_model()
        fields = ['id','username', 'first_name', 'last_name','status']
    def get_status(self,instance):
        print(self.context['request'].user.friends)
        if self.context['request'].user.id == instance.id:
            return "self"
        elif self.context['request'].user.friends.friends.filter(id=instance.id).exists():
            return "friend"
        elif instance.friends.request_friends.filter(id=self.context['request'].user.id).exists():
            return "request_send"
        else :
            return "unknow"

class ChatListSerializer(serializers.ModelSerializer):
    users = serializers.SerializerMethodField()
    chat_type = serializers.SerializerMethodField()

class ChatPrivateListSerializer(ChatListSerializer):
    count = serializers.SerializerMethodField()
    def get_count(self,instance):
        return number_no_watched_private_message(instance.users.exclude(id = self.context['request'].user.id).first(),self.context['request'].user)
    def get_users(self, instance):
        queryset = instance.users.exclude(id = self.context['request'].user.id)
        serializer = UserSerializer(queryset[0])
        return serializer.data
    def get_chat_type(self,instance):
        return "chat_private"
    class Meta:
        model = ChatPrivate
        fields = ['id','users','count','chat_type','last_update']

class ChatGroupListSerializer(ChatListSerializer):
    count = serializers.SerializerMethodField()
    def get_count(self,instance):
        return number_no_watched_group_message(self.context['request'].user,instance.id)
    def get_users(self, instance):
        queryset = instance.users.exclude(id = self.context['request'].user.id)
        serializer = UserSerializer(queryset,many=True)
        return serializer.data
    def get_chat_type(self,instance):
        return "chat_group"
    class Meta:
        model = ChatGroup
        fields = ['id','users','chat_name','chat_type','count','last_update']

class ChatGroupCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatGroup
        fields = ['chat_name','users']
    def validate_users(self,value):
        if self.context['request'].user in value:
            return value
        value.append(self.context['request'].user)
        return value

class ChatGroupCreateResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatGroup
        fields = ['id','chat_name','users']

class ChatDetailSerializer(serializers.ModelSerializer):
    users = serializers.SerializerMethodField()
    def get_users(self, instance):
        queryset = instance.users.exclude(id = self.context['request'].user.id)
        serializer = UserDetailSerializer(queryset, many=True)
        return serializer.data

class ChatPrivateDetailSerializer(ChatDetailSerializer):
    class Meta:
        model = ChatPrivate
        fields = ['id','users']

class ChatGroupDetailSerializer(ChatDetailSerializer):
    class Meta:
        model = ChatGroup
        fields = ['id','users']


class MessageGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageGroup
        fields = '__all__'

class MessagePrivateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessagePrivate
        fields = '__all__'


