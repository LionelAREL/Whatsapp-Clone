from django.shortcuts import render
from rest_framework.views import APIView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.response import Response
from django.views.decorators.http import require_POST,require_GET
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
import json
from core.serializers import UserDetailSerializer
from rest_framework.renderers import JSONRenderer

@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    def get(self, request, format=None):
        return Response({ 'success': 'CSRF cookie set' })


@require_POST
def login_view(request):
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')

    if username is None or password is None:
        return JsonResponse({'detail': 'Please provide username and password.'}, status=400)

    user = authenticate(username=username, password=password)

    if user is None:
        return JsonResponse({'detail': 'Invalid credentials.'}, status=400)

    login(request, user)
    return JsonResponse({'detail': 'Successfully logged in.'})


@require_GET
def logout_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'You\'re not logged in.'}, status=400)
    logout(request)
    return JsonResponse({'detail': 'Successfully logged out.'})

@ensure_csrf_cookie
def session_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'user':None})
    serializer = UserDetailSerializer(request.user)
    return JsonResponse({'user':serializer.data})


