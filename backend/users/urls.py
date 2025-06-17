from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, RegisterView, CustomTokenView, LogoutView, google_auth
)
from .password_reset import PasswordResetRequestView, PasswordResetConfirmView
from .email_verification import EmailVerificationRequestView, EmailVerificationConfirmView

router = DefaultRouter()
router.register(r'profiles', UserViewSet, basename='userprofile')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', UserViewSet.as_view({'get': 'me'}), name='user-me'),
    path('token/', CustomTokenView.as_view(), name='token_obtain_pair'),
    path('token/logout/', LogoutView.as_view(), name='token_logout'),
    path('google/', google_auth, name='google-auth'),
    path('password/reset/', PasswordResetRequestView.as_view(), name='password-reset'),
    path('password/reset/confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('email/verify/', EmailVerificationRequestView.as_view(), name='email-verify'),
    path('email/verify/confirm/', EmailVerificationConfirmView.as_view(), name='email-verify-confirm'),
]