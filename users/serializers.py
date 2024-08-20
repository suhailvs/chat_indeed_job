from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.authtoken.models import Token
from .models import MessageModel, ChatRoom

User = get_user_model()

class TokenSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Token
        fields = ("key", "user", "username")  # name', 'id')


class MessageModelSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source="user.username", read_only=True)
    recipient = serializers.CharField(source="recipient.username", read_only=True)
    room = serializers.CharField(write_only=True)

    def create(self, validated_data):
        user = self.context["request"].user
        room = ChatRoom.objects.get(id=validated_data["room"])
        if room.interest_sender == user:
            recipient = room.interest_receiver
        elif room.interest_receiver == user:
            recipient = room.interest_sender
        msg = MessageModel(recipient=recipient, body=validated_data["body"], user=user)
        msg.save()
        return msg

    class Meta:
        model = MessageModel
        fields = ("id", "user", "recipient", "timestamp", "body", "room")
