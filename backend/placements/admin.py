from django.contrib import admin
from django.contrib.auth import get_user_model
from .models import Student, Company, PlacementStage, PlacementProgress, StageProgress, ImportantDate

User = get_user_model()


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['enrollment_number', 'name', 'branch', 'year', 'cgpa', 'is_placed', 'user']
    list_filter = ['branch', 'year', 'is_placed']
    search_fields = ['enrollment_number', 'name', 'email']
    ordering = ['-created_at']
    
    def save_model(self, request, obj, form, change):
        """
        Automatically create and link a User account when creating a student
        """
        super().save_model(request, obj, form, change)
        
        # If student doesn't have a linked user account, create one
        if not obj.user:
            username = obj.enrollment_number.lower()
            
            # Check if user already exists
            existing_user = User.objects.filter(username=username).first()
            if existing_user:
                # Link existing user
                obj.user = existing_user
                obj.save()
            else:
                # Create new user account
                password = f"{obj.name.split()[0].lower()}{obj.enrollment_number[-4:]}"
                user = User.objects.create_user(
                    username=username,
                    email=obj.email,
                    password=password,
                    first_name=obj.name.split()[0] if obj.name else '',
                    last_name=' '.join(obj.name.split()[1:]) if len(obj.name.split()) > 1 else '',
                    role='STUDENT',
                    phone=obj.phone
                )
                obj.user = user
                obj.save()
                self.message_user(request, f"User account created: {username} / Password: {password}")
        
        # Also check if there's an existing user with this email but not linked
        elif not change:  # Only on creation
            existing_user = User.objects.filter(email=obj.email, role='STUDENT').exclude(id=obj.user.id).first()
            if existing_user and not hasattr(existing_user, 'student_profile'):
                obj.user = existing_user
                obj.save()


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['name', 'company_type', 'package_offered', 'job_role', 'is_active']
    list_filter = ['company_type', 'is_active']
    search_fields = ['name', 'job_role']
    ordering = ['-package_offered']


@admin.register(PlacementStage)
class PlacementStageAdmin(admin.ModelAdmin):
    list_display = ['name', 'stage_type', 'sequence_order']
    ordering = ['sequence_order']


@admin.register(PlacementProgress)
class PlacementProgressAdmin(admin.ModelAdmin):
    list_display = ['student', 'company', 'current_stage', 'status', 'updated_at']
    list_filter = ['status', 'company']
    search_fields = ['student__name', 'company__name']
    ordering = ['-updated_at']


@admin.register(StageProgress)
class StageProgressAdmin(admin.ModelAdmin):
    list_display = ['placement_progress', 'stage', 'result', 'scheduled_date']
    list_filter = ['result', 'stage']
    ordering = ['-updated_at']


@admin.register(ImportantDate)
class ImportantDateAdmin(admin.ModelAdmin):
    list_display = ['title', 'event_type', 'company', 'event_date', 'is_active']
    list_filter = ['event_type', 'is_active']
    search_fields = ['title', 'company__name']
    ordering = ['event_date']