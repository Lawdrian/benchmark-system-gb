import smtplib
import socket

from django.contrib.auth import get_user_model
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from knox.models import AuthToken
from rest_framework import permissions, generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from benchmarksystemgb import settings
from .acc_activation_token import account_activation_token
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer


# Register API
class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        print("Begin")
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        print("Serializer is valid")
        # to get the domain of the current site
        current_site = get_current_site(request)
        print(current_site.domain)
        print(user.email)
        print(user.id)
        mail_subject = 'Activation link has been sent to your email id'
        message = render_to_string('acc_active_email.html', {
            'user': user,
            'domain': current_site.domain,
            'uid': urlsafe_base64_encode(force_bytes(user.id)),
            'token': account_activation_token.make_token(user),
        })
        to_email = user.email
        print("Mailinhalt is valid")
        print(urlsafe_base64_encode(force_bytes(user.id)))
        email = EmailMessage(
            mail_subject, message, settings.DEFAULT_FROM_EMAIL, [to_email]
        )
        email.send()

        return Response({
                "user": UserSerializer(user,
                                       context=self.get_serializer_context()).data,
                "token": AuthToken.objects.create(user)[1]

        })
class ActivateAPI(APIView):

    def patch(self, request):
        print("ACTIVATE!!!!!")
        # retrieve the uidb64 and token out of the query params
        uidb64 = request.GET.get('uid', None)
        token = request.GET.get('token', None)
        print(uidb64)
        print(token)
        User = get_user_model()
        try:
            # Decode the encoded bytestring to the user id
            uid = urlsafe_base64_decode(uidb64)
            uid = uid.decode("utf-8")
            print(uid)
            user = User.objects.get(id=uid)
        except(TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
            print("User in None")
        if user is not None and account_activation_token.check_token(user, token):
            user.is_active = True
            user.save()
            return Response('Thank you for your email confirmation. Now you can login your account.', status=status.HTTP_200_OK)
        else:
            return Response({'Bad Request': 'Activation link is invalid!'}, status=status.HTTP_400_BAD_REQUEST)


# Login API
class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        _, token = AuthToken.objects.create(user)
        return Response({
            "user": UserSerializer(user,
                                   context=self.get_serializer_context()).data,
            "token": token
        })


# Get User API
class UserAPI(generics.RetrieveAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
