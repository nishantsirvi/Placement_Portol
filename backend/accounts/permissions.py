from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """
    Custom permission to only allow admin users.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_admin


class IsStudent(permissions.BasePermission):
    """
    Custom permission to only allow student users.
    """

    def has_permission(self, request, view):
        return (
            request.user and request.user.is_authenticated and request.user.is_student
        )


class IsCompanyRep(permissions.BasePermission):
    """
    Custom permission to only allow company representative users.
    """

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.is_company_rep
        )


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to allow admin full access, others read-only.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return request.user and request.user.is_authenticated and request.user.is_admin


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission to allow users to edit their own objects or admin to edit any.
    """

    def has_object_permission(self, request, view, obj):
        # Admin has full access
        if request.user.is_admin or request.user.is_staff:
            return True

        # Check if object has a user attribute
        if hasattr(obj, "user"):
            return obj.user == request.user

        # Check if object has a student attribute with user
        if hasattr(obj, "student") and hasattr(obj.student, "user"):
            return obj.student.user == request.user

        # For user objects themselves
        if hasattr(obj, "id") and obj == request.user:
            return True

        return False


class IsVerifiedUser(permissions.BasePermission):
    """
    Custom permission to only allow verified users.
    """

    def has_permission(self, request, view):
        return (
            request.user and request.user.is_authenticated and request.user.is_verified
        )


class IsAdminOrStudent(permissions.BasePermission):
    """
    Custom permission to allow admin or student users.
    """

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and (request.user.is_admin or request.user.is_student)
        )
