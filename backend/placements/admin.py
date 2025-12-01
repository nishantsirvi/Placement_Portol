from django.contrib import admin
from .models import Student, Company, PlacementStage, PlacementProgress, StageProgress, ImportantDate


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['enrollment_number', 'name', 'branch', 'year', 'cgpa', 'is_placed']
    list_filter = ['branch', 'year', 'is_placed']
    search_fields = ['enrollment_number', 'name', 'email']
    ordering = ['-created_at']


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