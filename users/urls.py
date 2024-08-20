from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import MessageModelViewSet,UsersView

app_name = 'users'

router = DefaultRouter()
router.register(r'message', MessageModelViewSet, basename='message-api')

urlpatterns = [    
    path('v1/', include(router.urls)),
    path('v1/user/', UsersView.as_view(), name="user"),
]
