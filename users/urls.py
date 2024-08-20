from django.urls import include, path, re_path
from . import views

app_name = 'users'
urlpatterns = [
    path('', views.users, name="users"),
]
