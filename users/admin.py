from django.contrib import admin
from .models import ChatRoom, MessageModel, User

admin.site.register(User)
admin.site.register(ChatRoom)
admin.site.register(MessageModel)