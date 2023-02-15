from django.contrib.auth import get_user_model
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMultiAlternatives
from django.db import IntegrityError
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from knox.models import AuthToken
from rest_framework import permissions, generics, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.hashers import make_password

from benchmarksystemgb import settings
from .acc_activation_token import account_activation_token
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, ForgotPWSerializer, ResetPWSerializer


class UserAPI(generics.RetrieveAPIView):
    """This API endpoint returns the current user if logged in."""

    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class RegisterAPI(generics.GenericAPIView):
    """This API endpoint creates a new user and stores it in the database."""

    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
        except ValidationError:
            return Response({'Error': 'Invalid credentials', 'Message': 'Illegal characters are used.'},
                            status=status.HTTP_400_BAD_REQUEST)
        except IntegrityError:
            return Response({'Error': 'Email in use', 'Message': 'The provided email is already used by an account.'},
                     status=status.HTTP_400_BAD_REQUEST)

        # to get the domain of the current site
        current_site = get_current_site(request)
        mail_subject = 'Benchmark-Tool Account registrieren'
        html_content = render_to_string('acc_active_email.html', {
            'user': user,
            'domain': current_site.domain,
            'uid': urlsafe_base64_encode(force_bytes(user.id)),
            'token': account_activation_token.make_token(user),
        })
        to_email = user.email
        email = EmailMultiAlternatives(
            mail_subject, html_content, settings.DEFAULT_FROM_EMAIL, [to_email]
        )
        email.content_subtype = 'html'
        email.mixed_subtype = 'related'

        #img_path = str(pathlib.Path(__file__).parent.resolve()) + '/templates/logo.png'
        #img_name = 'logo.png'
        #print(img_path)

        #with open(img_path, 'rb') as f:
        #    image = MIMEImage(f.read(), _subtype="png")
        #    email.attach(image)
        #    image.add_header('Content-ID', "<{}>".format(img_name))  # Setting content ID
        #    print("<{}>".format(img_name))  # Testing content ID
        #    #Add this in the html file
        #    <head>
        #       <img src="cid:logo.png" alt="Benchmark Logo">
        #    </head>
        try:
            email.send(fail_silently=False)
        except Exception as err:
            print(err)
            serializer.delete(serializer.validated_data)
            return Response({'Error': 'Internal error', 'Message': 'Email service not working.'},
                            status=status.HTTP_400_BAD_REQUEST)
        return Response({'Message: Account has been successfully created.'}, status=status.HTTP_201_CREATED)


class ActivateAPI(APIView):
    """This API endpoint activates a user account if the correct url parameters are set in the request.
    """

    def patch(self, request):
        # retrieve the uidb64 and token out of the query params
        uidb64 = request.GET.get('uid', None)
        token = request.GET.get('token', None)
        User = get_user_model()
        try:
            # decode the encoded bytestring to the user id
            uid = urlsafe_base64_decode(uidb64)
            uid = uid.decode("utf-8")
            user = User.objects.get(id=uid)
        except(TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
            print("User is None")
        if user is not None and account_activation_token.check_token(user, token):
            user.is_active = True
            user.save()
            return Response('Thank you for your email confirmation. Now you can login your account.',
                            status=status.HTTP_200_OK)
        else:
            return Response({'Bad Request': 'Activation link is invalid!'}, status=status.HTTP_400_BAD_REQUEST)


class ForgotPWAPI(generics.GenericAPIView):
    """This API endpoint sends a password reset link to a user's email."""

    serializer_class = ForgotPWSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # to get the domain of the current site
        current_site = get_current_site(request)
        User = get_user_model()
        user = User.objects.get(email=serializer.data['email'])
        mail_subject = 'Benchmark-Tool Passwort zurücksetzen'
        html_content = render_to_string('forgot_pw_email.html', {
            'user': user,
            'domain': current_site.domain,
            'uid': urlsafe_base64_encode(force_bytes(user.id)),
            'token': account_activation_token.make_token(user),
        })
        to_email = user.email
        email = EmailMultiAlternatives(
            mail_subject, html_content, settings.DEFAULT_FROM_EMAIL, [to_email]
        )
        email.content_subtype = 'html'
        email.mixed_subtype = 'related'
        email.send()

        return Response({
            "user": UserSerializer(user,
                                   context=self.get_serializer_context()).data,

        })


class ResetPWAPI(generics.GenericAPIView):
    """This API endpoint changes a user's password."""

    serializer_class = ResetPWSerializer

    def patch(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # retrieve the uidb64 and token out of the query params
        uidb64 = request.GET.get('uid', None)
        token = request.GET.get('token', None)
        User = get_user_model()
        try:
            # decode the encoded bytestring to the user id
            uid = urlsafe_base64_decode(uidb64)
            uid = uid.decode("utf-8")
            user = User.objects.get(id=uid)
        except(TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
            print("User is None")
        if user is not None and account_activation_token.check_token(user, token):
            user.password = make_password(serializer.data['password'])
            user.save()
            return Response('Your password has been successfully changed.', status=status.HTTP_200_OK)
        else:
            return Response({'Bad Request': 'Reset link is invalid!'}, status=status.HTTP_400_BAD_REQUEST)


class LoginAPI(generics.GenericAPIView):
    """This API endpoint checks if the user credentials are correct and returns a user object and token if so."""

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


class DeleteAPI(generics.GenericAPIView):
    """This API endpoint deletes the user sent in the request."""

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def delete(self, request):
        user = self.request.user
        if user is not None:
            user.delete()
            return Response('Your account has been successfully deleted!', status=status.HTTP_200_OK)
        else:
            return Response({'Bad Request': 'User not found!'}, status=status.HTTP_400_BAD_REQUEST)
