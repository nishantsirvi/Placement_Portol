from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import (
    Company,
    ImportantDate,
    PlacementProgress,
    PlacementStage,
    StageProgress,
    Student,
)

User = get_user_model()


class StudentSerializer(serializers.ModelSerializer):
    branch_display = serializers.CharField(source="get_branch_display", read_only=True)
    year_display = serializers.CharField(source="get_year_display", read_only=True)
    user = serializers.PrimaryKeyRelatedField(
        read_only=True, required=False, allow_null=True
    )
    # Field to receive password when creating student
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Student
        fields = "__all__"
        read_only_fields = ["created_at", "updated_at", "user"]
    
    def create(self, validated_data):
        """
        Create a User account automatically when admin creates a student
        """
        password = validated_data.pop('password', None)
        student = super().create(validated_data)
        
        # If no user is linked and this is being created by admin, create a User account
        if not student.user:
            # Generate username from enrollment number
            username = student.enrollment_number.lower()
            
            # Use provided password or generate a default one
            if not password:
                # Default password: first name + enrollment number
                password = f"{student.name.split()[0].lower()}{student.enrollment_number[-4:]}"
            
            # Check if user already exists
            if not User.objects.filter(username=username).exists():
                user = User.objects.create_user(
                    username=username,
                    email=student.email,
                    password=password,
                    first_name=student.name.split()[0] if student.name else '',
                    last_name=' '.join(student.name.split()[1:]) if len(student.name.split()) > 1 else '',
                    role='STUDENT',
                    phone=student.phone
                )
                student.user = user
                student.save()
        
        return student


class CompanySerializer(serializers.ModelSerializer):
    company_type_display = serializers.CharField(
        source="get_company_type_display", read_only=True
    )

    class Meta:
        model = Company
        fields = "__all__"
        read_only_fields = ["created_at", "updated_at"]


class PlacementStageSerializer(serializers.ModelSerializer):
    stage_type_display = serializers.CharField(
        source="get_stage_type_display", read_only=True
    )

    class Meta:
        model = PlacementStage
        fields = "__all__"


class StageProgressSerializer(serializers.ModelSerializer):
    stage_name = serializers.CharField(source="stage.name", read_only=True)
    result_display = serializers.CharField(source="get_result_display", read_only=True)

    class Meta:
        model = StageProgress
        fields = "__all__"
        read_only_fields = ["created_at", "updated_at"]


class PlacementProgressSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.name", read_only=True)
    student_enrollment = serializers.CharField(
        source="student.enrollment_number", read_only=True
    )
    company_name = serializers.CharField(source="company.name", read_only=True)
    current_stage_name = serializers.CharField(
        source="current_stage.name", read_only=True
    )
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    stage_details = StageProgressSerializer(many=True, read_only=True)

    class Meta:
        model = PlacementProgress
        fields = "__all__"
        read_only_fields = ["created_at", "updated_at", "application_date"]


class ImportantDateSerializer(serializers.ModelSerializer):
    event_type_display = serializers.CharField(
        source="get_event_type_display", read_only=True
    )
    company_name = serializers.CharField(source="company.name", read_only=True)

    class Meta:
        model = ImportantDate
        fields = "__all__"
        read_only_fields = ["created_at", "updated_at"]
