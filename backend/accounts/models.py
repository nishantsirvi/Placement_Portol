from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom User model with role-based access control
    """

    ROLE_CHOICES = [
        ("STUDENT", "Student"),
        ("ADMIN", "Admin/TPO"),
        ("COMPANY", "Company Representative"),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="STUDENT")
    phone = models.CharField(max_length=15, blank=True)
    profile_picture = models.ImageField(
        upload_to="profile_pictures/", null=True, blank=True
    )
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"

    @property
    def is_student(self):
        return self.role == "STUDENT"

    @property
    def is_admin(self):
        return self.role == "ADMIN"

    @property
    def is_company_rep(self):
        return self.role == "COMPANY"
