from django.db.models import Q
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from rest_framework.pagination import PageNumberPagination
from rest_framework.viewsets import ModelViewSet
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from .models import MessageModel
from .serializers import MessageModelSerializer



# Create your views here.
User = get_user_model()

def users(requset):
    users = []
    for user in User.objects.all():
        users.append({ 'id':user.id, 'username':user.username, 'firstName':'', 'lastName':'' })
    return JsonResponse(users,safe=False)

class MessageModelViewSet(ModelViewSet):
    queryset = MessageModel.objects.all()
    serializer_class = MessageModelSerializer
    authentication_classes = (TokenAuthentication, )
    pagination_class = PageNumberPagination
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        self.queryset = self.queryset.filter(Q(recipient=request.user) |
                                             Q(user=request.user))
        target = self.request.query_params.get('target', None)
        if target is not None:
            self.queryset = self.queryset.filter(
                Q(recipient=request.user, user__username=target) |
                Q(recipient__username=target, user=request.user))
        self.queryset = self.queryset.order_by('timestamp')
        return super().list(request, *args, **kwargs)
