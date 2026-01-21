from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    ChangePasswordView,
    CustomTokenObtainPairView,
    LogoutView,
    RegisterView,
    UpdateProfileView,
    UserDetailView,
    UserListView,
    UserProfileView,
    VerifyUserView,
    check_auth,
)

urlpatterns = [
    # Authentication endpoints
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", CustomTokenObtainPairView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("check-auth/", check_auth, name="check_auth"),
    # Profile endpoints
    path("profile/", UserProfileView.as_view(), name="user_profile"),
    path("profile/update/", UpdateProfileView.as_view(), name="update_profile"),
    path("change-password/", ChangePasswordView.as_view(), name="change_password"),
    # User management endpoints (Admin)
    path("users/", UserListView.as_view(), name="user_list"),
    path("users/<int:pk>/", UserDetailView.as_view(), name="user_detail"),
    path("users/<int:user_id>/verify/", VerifyUserView.as_view(), name="verify_user"),
]
