from pathlib import Path
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-@un!c(fd$gxcik)*#pqv4lw!=n#=sep7pc1rt+%_riq)ti**xy'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = ['13.36.191.99',".whatsapp-clone-lionel-arel.ga"]


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

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'bdd_react_whatsapp',
        'USER': 'postgres',
        'PASSWORD': 'PjK23lm9AYD5K6FNF04C',
        'HOST': 'database-react-whatsapp.cr8pcsdso6dy.eu-west-3.rds.amazonaws.com',
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
    'https://13.36.191.99',
    "https://www.whatsapp-clone-lionel-arel.ga",
    "https://whatsapp-clone-lionel-arel.ga"
]

CORS_ALLOW_CREDENTIALS = True
CORS_ORIGIN_ALLOW_ALL = True

CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://13.36.191.99',
    "https://www.whatsapp-clone-lionel-arel.ga",
    "https://whatsapp-clone-lionel-arel.ga"
]

CORS_ORIGIN_WHITELIST = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://13.36.191.99',
    "https://www.whatsapp-clone-lionel-arel.ga",
    "https://whatsapp-clone-lionel-arel.ga"
]
CORS_EXPOSE_HEADERS = ['Content-Type', 'X-CSRFToken']
CSRF_COOKIE_SAMESITE = 'None'
SESSION_COOKIE_SAMESITE = 'None'

CSRF_COOKIE_HTTPONLY = False
SESSION_COOKIE_HTTPONLY = False

CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True


SESSION_COOKIE_DOMAIN = '.whatsapp-clone-lionel-arel.ga'
CSRF_COOKIE_DOMAIN = '.whatsapp-clone-lionel-arel.ga'

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

