from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import MessageModel

User = get_user_model()

class MessageModelSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source="user.username", read_only=True)
    recipient = serializers.CharField(source="recipient.username", read_only=True)
    room = serializers.CharField(write_only=True)

    def create(self, validated_data):
        user = self.context["request"].user
        
        msg = MessageModel(recipient_id=validated_data['room'], body=validated_data["body"], user=user)
        msg.save()
        return msg

    class Meta:
        model = MessageModel
        fields = ("id", "user", "recipient", "timestamp", "body", "room")
