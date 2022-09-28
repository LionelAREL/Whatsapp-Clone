import os
from django.core.asgi import get_asgi_application
from .auth import JWTAuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from chat import routing

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "api.settings")


application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": JWTAuthMiddlewareStack(
        URLRouter(
            routing.websocket_urlpatterns,
        )
    ),
})



