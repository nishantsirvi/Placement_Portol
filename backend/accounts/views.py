from django.contrib.auth import update_session_auth_hash
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import User
from .serializers import (
    ChangePasswordSerializer,
    CustomTokenObtainPairSerializer,
    RegisterSerializer,
    UpdateProfileSerializer,
    UserSerializer,
)


class RegisterView(generics.CreateAPIView):
    """
    API endpoint for user registration
    """

    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate tokens for the new user
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "user": UserSerializer(user).data,
                "message": "User registered successfully",
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
            },
            status=status.HTTP_201_CREATED,
        )


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom JWT login view with additional user data
    """

    serializer_class = CustomTokenObtainPairSerializer


class LogoutView(APIView):
    """
    API endpoint for user logout (blacklist refresh token)
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            if not refresh_token:
                return Response(
                    {"error": "Refresh token is required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(
                {"message": "Successfully logged out"}, status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    """
    API endpoint to get current user's profile
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class UpdateProfileView(generics.UpdateAPIView):
    """
    API endpoint to update user profile
    """

    serializer_class = UpdateProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(
            {
                "user": UserSerializer(instance).data,
                "message": "Profile updated successfully",
            }
        )


class ChangePasswordView(APIView):
    """
    API endpoint for changing password
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data["new_password"])
            user.save()

            # Update session to prevent logout
            update_session_auth_hash(request, user)

            return Response(
                {"message": "Password changed successfully"}, status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserListView(generics.ListAPIView):
    """
    API endpoint to list all users (Admin only)
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only admin can see all users
        if self.request.user.is_admin or self.request.user.is_staff:
            return User.objects.all()
        # Regular users can only see themselves
        return User.objects.filter(id=self.request.user.id)


class VerifyUserView(APIView):
    """
    API endpoint to verify a user (Admin only)
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        # Check if user is admin
        if not (request.user.is_admin or request.user.is_staff):
            return Response(
                {"error": "Only admins can verify users"},
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            user = User.objects.get(id=user_id)
            user.is_verified = True
            user.save()

            return Response(
                {
                    "message": f"User {user.username} verified successfully",
                    "user": UserSerializer(user).data,
                },
                status=status.HTTP_200_OK,
            )
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def check_auth(request):
    """
    Simple endpoint to check if user is authenticated
    """
    return Response(
        {
            "authenticated": True,
            "user": UserSerializer(request.user).data,
        }
    )
