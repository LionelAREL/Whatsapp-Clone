import os
from pathlib import Path
import botocore 
import boto3
import botocore.session 
from aws_secretsmanager_caching import SecretCache, SecretCacheConfig 
import json
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-@un!c(fd$gxcik)*#pqv4lw!=n#=sep7pc1rt+%_riq)ti**xy'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'chat',
    'core',
    'channels',
    'corsheaders',
    'account',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
]

ROOT_URLCONF = 'api.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'api.wsgi.application'

ASGI_APPLICATION = "api.asgi.application"

# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases

try:
    client = botocore.session.get_session().create_client(service_name='secretsmanager',region_name='eu-west-3')
    cache_config = SecretCacheConfig()
    cache = SecretCache( config = cache_config, client = client)

    secret_name = 'djangoEcommerce'
    secret = json.loads(cache.get_secret_string(secret_name))['password']

    ssm = boto3.client('ssm')
    parameter = ssm.get_parameter(Name='db-endpoint', WithDecryption=True)
    endpoint = parameter['Parameter']['Value']
    print(endpoint)

    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': 'djangoEcommerce',
            'USER': 'postgres',
            'PASSWORD': secret,
            'HOST': endpoint,
            'PORT': '5432',
        }
    }
except:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': 'dbWhatsapp',
            'USER': 'postgres',
            'PASSWORD': "dbWhatsapp",
            'HOST': 'db-whatsapp.coivorc7u40d.eu-west-3.rds.amazonaws.com',
            'PORT': '5432',
        }
    }

# Password validation
# https://docs.djangoproject.com/en/4.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.0/topics/i18n/

LANGUAGE_CODE = 'en-en'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.0/howto/static-files/

STATIC_URL = 'backend/static/'

STATIC_ROOT = BASE_DIR / 'staticfiles'

# Default primary key field type
# https://docs.djangoproject.com/en/4.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
}

AUTH_USER_MODEL = 'core.User'

LOGIN_URL = '/backend/login/succeed/'
LOGIN_REDIRECT_URL = "/backend/login/succeed/"

CSRF_TRUSTED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    "https://www.chat-clone-lionel-arel.ga",
    "https://chat-lionel-arel.ga"
]

CORS_ALLOW_CREDENTIALS = True
CORS_ORIGIN_ALLOW_ALL = True

CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    "https://www.chat-lionel-arel.ga",
    "https://chat-lionel-arel.ga"
]

CORS_ORIGIN_WHITELIST = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    "https://www.chat-lionel-arel.ga",
    "https://chat-lionel-arel.ga"
]
CORS_EXPOSE_HEADERS = ['Content-Type', 'X-CSRFToken']
CSRF_COOKIE_SAMESITE = 'None'
SESSION_COOKIE_SAMESITE = 'None'

CSRF_COOKIE_HTTPONLY = False
SESSION_COOKIE_HTTPONLY = False

CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True


SESSION_COOKIE_DOMAIN = '.chat-lionel-arel.ga'
CSRF_COOKIE_DOMAIN = '.chat-lionel-arel.ga'

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': "channels_redis.core.RedisChannelLayer",
        'CONFIG': {
            'hosts': [('127.0.0.1', 6379)],
        },
    }
}

LOGGING = {
    'version': 1,
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s'
        },
        'simple': {
            'format': '%(levelname)s %(message)s'
        },
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'simple'
        },
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': '/var/log/django/django-error.log',
            'formatter': 'simple'
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
        'daphne': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    }
}

