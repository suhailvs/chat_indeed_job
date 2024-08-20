from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    pass

class STATUS_CHOICES:
    PENDING = 'pending'
    ACCEPTED = 'accepted'
    REJECTED = 'rejected'

class ChatRoom(models.Model):
    CHOICES = [
        (STATUS_CHOICES.PENDING, STATUS_CHOICES.PENDING),
        (STATUS_CHOICES.ACCEPTED, STATUS_CHOICES.ACCEPTED),
        (STATUS_CHOICES.REJECTED, STATUS_CHOICES.REJECTED),
    ]

    interest_sender = models.ForeignKey(User, related_name='sent_interests', on_delete=models.CASCADE)
    interest_receiver = models.ForeignKey(User, related_name='received_interests', on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=CHOICES, default=STATUS_CHOICES.PENDING)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('interest_sender', 'interest_receiver')
    def __str__(self):
        return f"{self.interest_sender.username} -> {self.interest_receiver.username} ({self.status})"


class MessageModel(models.Model):
    """
    This class represents a chat message. It has a owner (user), timestamp and
    the message body.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE,related_name='from_user')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE,related_name='to_user')
    timestamp = models.DateTimeField(auto_now_add=True)
    body = models.TextField('body')