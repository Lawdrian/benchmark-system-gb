from django.urls import path, include
from .api import RegisterAPI, LoginAPI, UserAPI, ActivateAPI
from knox import views as knox_views

urlpatterns = [
	path('auth', include('knox.urls')),
	path('auth/register', RegisterAPI.as_view()),
	path('auth/activate', ActivateAPI.as_view()),
	path('auth/login', LoginAPI.as_view()),
	path('auth/user', UserAPI.as_view()),
	# Logout invalidates the knox token (important to be done on the backend)
	path('auth/logout', knox_views.LogoutView.as_view(), name='knox_logout')
]