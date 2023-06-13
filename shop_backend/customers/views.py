from rest_framework import viewsets

from customers.models import Profile
from customers.serializers import ProfileSerializer


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all().order_by("-pk")
    serializer_class = ProfileSerializer
