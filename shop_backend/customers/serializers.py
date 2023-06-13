from rest_framework import serializers

from customers.models import Profile


class ProfileSerializer(serializers.HyperlinkedModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)
    is_staff = serializers.BooleanField(source="user.is_staff", read_only=True, required=False)
    last_login = serializers.DateTimeField(source="user.last_login", read_only=True)

    class Meta:
        model = Profile
        fields = ("id", "url", "email", "full_name", "avatar", "is_staff", "created_on", "updated_on", "last_login",)
