from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from customers.serializers import ProfileSerializer


class UserLoginSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = get_user_model()
        fields = ("url",)
    
    def get_url(self, instance):
        serializer_context = {"request": self.context.get("request")}
        serializer = ProfileSerializer(instance.profiles, context=serializer_context)
        return serializer.data.get("url")


class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ("email", "password",)
        extra_kwargs = {"password": {"style": {"input_type": "password"}, "write_only": True, "validators": [validate_password]}}
    
    def create(self, validated_data):
        user = get_user_model().objects.create(email=validated_data.get("email"))
        user.set_password(validated_data.get("password"))
        user.save()
        return user
