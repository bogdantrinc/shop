from django.contrib.auth import get_user_model, login
from rest_framework import viewsets, permissions
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.views import LoginView as KnoxLoginView

from users.serializers import UserRegisterSerializer


class UserRegisterViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all().order_by("-pk")
    serializer_class = UserRegisterSerializer
    permission_classes = (permissions.AllowAny,)

class LoginView(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        login(request, user)
        return super(LoginView, self).post(request, format=None)
