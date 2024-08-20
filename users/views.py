from django.contrib.auth import get_user_model
from django.db.models import Q
from django.db.models import OuterRef, Subquery
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from .models import MessageModel, ChatRoom, STATUS_CHOICES
from .serializers import MessageModelSerializer


User = get_user_model()
class UsersView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        qs = User.objects.exclude(id=request.user.id)
        chatroom_interest_status = ChatRoom.objects.filter(
            (Q(interest_sender=OuterRef('pk')) & Q(interest_receiver=request.user)) |
            (Q(interest_sender=request.user) & Q(interest_receiver=OuterRef('pk')))
        ).values('status')[:1]

        users = qs.annotate(interest_status=Subquery(chatroom_interest_status))
        # there are users who send interest that need to accept/decline
        return Response(users.values('id','username','interest_status'))

    def post(self, request):
        touser=request.data['userid']
        interest = ChatRoom.objects.filter(
            (Q(interest_sender=touser) & Q(interest_receiver=request.user)) |
            (Q(interest_sender=request.user) & Q(interest_receiver=touser))
        ).first()
        if 'getroom' in request.data: return Response({'status':'success','room':interest.id})
        if not interest:
            ChatRoom.objects.create(interest_sender=request.user, interest_receiver_id = touser, status = STATUS_CHOICES.PENDING)
            return Response({'status':'success','msg':''})
        elif interest.status == STATUS_CHOICES.PENDING:
            if interest.interest_receiver==request.user:
                if request.data.get('is_reject'):
                    interest.status = STATUS_CHOICES.REJECTED
                else:
                    interest.status = STATUS_CHOICES.ACCEPTED
                interest.save()
                return Response({'status':'success','msg':''})
            elif interest.interest_sender==request.user:
                return Response({'status':'error','msg':'Error: You cannot accept/reject your own request'}, status=400)
    
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
