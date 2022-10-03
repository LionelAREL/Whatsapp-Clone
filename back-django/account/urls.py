from django.contrib import admin
from django.urls import path, include
from account import views


urlpatterns = [
    path('CSRFToken/', views.GetCSRFToken().as_view()),
    path('login/', views.login_view),
    path('logout/', views.logout_view),
    path('session/', views.session_view),
    path('sign-up/', views.Register().as_view()),

]