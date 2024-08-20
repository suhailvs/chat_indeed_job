from django.contrib.auth import get_user_model
from django.http import JsonResponse
# Create your views here.
User = get_user_model()

def users(requset):
    users = []
    for user in User.objects.all():
        users.append({ 'id':user.id, 'username':user.username, 'firstName':'', 'lastName':'' })
    return JsonResponse(users,safe=False)