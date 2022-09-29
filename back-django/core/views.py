from django.shortcuts import render
from django.contrib.auth import get_user_model
from rest_framework.viewsets import ReadOnlyModelViewSet,ModelViewSet
from rest_framework.generics import ListAPIView,CreateAPIView
from rest_framework.mixins import UpdateModelMixin
from .models import Publication, Friend
from .serializers import *
from django.shortcuts import get_object_or_404
from account.models import ChatGroup,ChatPrivate
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework import filters
from rest_framework.views import APIView
from account.models import MessagePrivate
from django.http import Http404, HttpResponse
from account.utils import number_no_watched_private_message
from .permissions import *
from rest_framework import status


class MultipleSerializerMixin:
    detail_serializer_class = None
    update_serializer_class = None
    def get_serializer_class(self):
        if self.action == 'retrieve' and self.detail_serializer_class is not None:
            return self.detail_serializer_class
        if self.action in ['update','partial_update'] and self.update_serializer_class is not None:
            return self.update_serializer_class
        if self.action in ['create'] and self.update_serializer_class is not None:
            return self.update_serializer_class
        return super().get_serializer_class()


class UserViewset(MultipleSerializerMixin,ModelViewSet):
    filter_backends = [filters.SearchFilter]
    search_fields = ['username', 'first_name','last_name']
    update_serializer_class = UserCreateSerializer
    serializer_class = UserListSerializer
    detail_serializer_class = UserDetailSerializer
    def get_queryset(self):
        return get_user_model().objects.exclude(id=self.request.user.id)


    

class PublicationViewset(MultipleSerializerMixin,ModelViewSet):
    permission_classes = [IsAuthorOrReadOnly]
    serializer_class = PublicationListSerializer
    detail_serializer_class = PublicationDetailSerializer
    queryset = Publication.objects.all()
    update_serializer_class = PublicationCreateSerializer



class StandardResultsSetPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 1000

class ChatPrivateViewset(MultipleSerializerMixin,ReadOnlyModelViewSet):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    serializer_class = ChatPrivateListSerializer
    detail_serializer_class = ChatPrivateDetailSerializer
    def get_queryset(self):
        return ChatPrivate.objects.filter(users__id__contains=self.request.user.id)

    @action(detail=True)
    def message_private(self, request, pk=None):
        self.pagination_class = StandardResultsSetPagination
        message = MessagePrivate.objects.filter(chat=self.get_object().id).order_by('date')
        page = self.paginate_queryset(message)
        if page is not None:
            serializer = MessagePrivateSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = MessagePrivateSerializer(message, many=True)
        return Response(serializer.data)


class ChatGroupViewset(MultipleSerializerMixin,ModelViewSet):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    update_serializer_class = ChatGroupCreateSerializer
    serializer_class = ChatGroupListSerializer
    detail_serializer_class = ChatGroupDetailSerializer

    def get_queryset(self):
        return ChatGroup.objects.filter(users__id__icontains=self.request.user.id)

    @action(detail=True)
    def message_group(self, request, pk=None):
        self.pagination_class = StandardResultsSetPagination
        message = MessageGroup.objects.filter(chat_group=self.get_object().id).order_by('date')
        page = self.paginate_queryset(message)
        if page is not None:
            serializer = MessageGroupSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = MessageGroupSerializer(message, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        return serializer.save()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        sr = ChatGroupCreateResponseSerializer(instance=instance)
        return Response(sr.data, status=status.HTTP_201_CREATED, headers=headers)

class FriendsViews(ListAPIView):
    serializer_class = UserListSerializer
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if(not self.request.user.friends.friends.exists()):
            return None
        return self.request.user.friends.friends.exclude(id=self.request.user.id)

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
class RequestFriendsViews(ListAPIView):
    serializer_class = UserListSerializer
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if(not self.request.user.friends.request_friends.exists()):
            return None
        for friends_request in Friend.objects.get(user=self.request.user).friends.all() :
            print(friends_request)
            Friend.objects.get(user=self.request.user).request_friends.remove(friends_request)
        return self.request.user.friends.request_friends.exclude(id=self.request.user.id)

class ChatViews(ListAPIView):
    serializer_class = ChatGroup
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return super().get_queryset(self)
        

class MessageNoWatched(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        try :
            user_from_id = request.GET.get('user_from')
            user_to_id = request.GET.get('user_to')
            if(user_from_id == None and user_to_id == None):
                raise Http404
        except:
            return HttpResponse("no find user_from and user_to in get parameters", status=404)
        user_from = get_user_model().objects.get(id = user_from_id)
        user_to = get_user_model().objects.get(id = user_to_id)
        print(user_from,user_to)
        message_no_watched = number_no_watched_private_message(user_from, user_to)
        return Response({'count':message_no_watched})

class MessagePrivateRetrive(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        try :
            user_from_id = request.GET.get('user_from')
            user_to_id = request.GET.get('user_to')
            if(user_from_id == None and user_to_id == None):
                raise Http404
        except:
            return HttpResponse("no find user_from and user_to in get parameters", status=404)
        try:
            if not ChatPrivate.get_chat(user_from_id, user_to_id):
                raise Http404
        except:
            return HttpResponse("no find chat private between user_from and user_to", status=404)
        chat_private = ChatPrivate.get_chat(user_from_id, user_to_id)
        return Response({'user_from':user_from_id,'user_to':user_to_id,'id':chat_private.id})