import re

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Profile


def no_special_chars(field):
    # contains all special characters apart from '@' and '.'
    special_characters = "!\"#$%&'()*+,\-/:;<=>?[\]^_`{|}~"
    regexp = re.compile(f"[{special_characters}]+")
    if regexp.search(field):
        raise serializers.ValidationError({"Error": "Invalid credentials", "Message": "No special chars are allowed."})

class ProfileSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(validators=[no_special_chars])

    class Meta:
        model = Profile
        fields = ['company_name']


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(required=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'profile')


class RegisterSerializer(serializers.ModelSerializer):

    profile = ProfileSerializer(required=True)
    username = serializers.CharField(validators=[no_special_chars])
    email = serializers.EmailField(validators=[no_special_chars])

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'profile')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        profile_data = validated_data.pop('profile')
        user.profile.company_name = profile_data['company_name']
        user.is_active = False
        user.save()

        return user

    def delete(self, validated_data):
        user = User.objects.get(email=validated_data['email'])
        user.delete()
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")


class ForgotPWSerializer(serializers.Serializer):
    email = serializers.CharField()


class ResetPWSerializer(serializers.Serializer):
    password = serializers.CharField()
