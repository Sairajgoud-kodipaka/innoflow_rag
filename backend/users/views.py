from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import (
    UserSerializer,
    UserRegisterSerializer,
    UserUpdateSerializer,
    CustomTokenObtainPairSerializer,
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .authentication import CustomJWTAuthentication
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.github.views import GitHubOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView
from rest_framework.renderers import JSONRenderer
from django.contrib.auth.hashers import make_password

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)

class CustomTokenView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserViewSet(viewsets.ModelViewSet):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.is_staff:
            return User.objects.all()
        return User.objects.filter(id=user.id)

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return UserUpdateSerializer
        return UserSerializer

    @action(detail=False, methods=['get'])
    def me(self, request):
        return Response(UserSerializer(request.user).data)

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    renderer_classes = [JSONRenderer]

    def dispatch(self, request, *args, **kwargs):
        if request.method == "GET":
            return Response(
                {"detail": "Method not allowed"}, 
                status=status.HTTP_405_METHOD_NOT_ALLOWED
            )
        return super().dispatch(request, *args, **kwargs)

class GitHubLogin(SocialLoginView):
    adapter_class = GitHubOAuth2Adapter
    renderer_classes = [JSONRenderer]

    def dispatch(self, request, *args, **kwargs):
        if request.method == "GET":
            return Response(
                {"detail": "Method not allowed"}, 
                status=status.HTTP_405_METHOD_NOT_ALLOWED
            )
        return super().dispatch(request, *args, **kwargs)

class LogoutView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({"detail": "Successfully logged out"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def google_auth(request):
    """Handle Google OAuth user creation/login for NextAuth"""
    try:
        email = request.data.get('email')
        name = request.data.get('name')
        image = request.data.get('image')
        google_id = request.data.get('google_id')
        
        if not email:
            return Response(
                {"error": "Email is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if user exists
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'first_name': name.split(' ')[0] if name else '',
                'last_name': ' '.join(name.split(' ')[1:]) if name and len(name.split(' ')) > 1 else '',
                'username': email.split('@')[0],
                'profile_picture': image,
                'password': make_password(None),  # Set unusable password for OAuth users
            }
        )
        
        # Update user info if not created (existing user)
        if not created and name:
            user.first_name = name.split(' ')[0]
            if len(name.split(' ')) > 1:
                user.last_name = ' '.join(name.split(' ')[1:])
            if image:
                user.profile_picture = image
            user.save()
        
        return Response({
            'id': user.id,
            'email': user.email,
            'name': f"{user.first_name} {user.last_name}".strip(),
            'username': user.username,
            'company': getattr(user, 'company', ''),
            'bio': getattr(user, 'bio', ''),
            'profile_picture': user.profile_picture,
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )