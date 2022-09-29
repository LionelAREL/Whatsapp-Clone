from django.contrib import admin
from django.urls import path, include
from rest_framework import routers, views
from core import views



router = routers.SimpleRouter()

router.register('publications', views.PublicationViewset)
router.register('users', views.UserViewset,basename="user")
router.register('chat_private',views.ChatPrivateViewset,basename="chat_private")
router.register('chat_group',views.ChatGroupViewset,basename="chat_group")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('api/', include(router.urls)),
    path('account/',include('account.urls')),
    path('api/friends',views.FriendsViews.as_view()),
    path('api/request_friends',views.RequestFriendsViews.as_view()),
    path('api/count',views.MessageNoWatched.as_view()),
    path('api/retrive',views.MessagePrivateRetrive.as_view()),
]