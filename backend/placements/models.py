from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Student(models.Model):
    BRANCH_CHOICES = [
        ("CSE", "Computer Science and Engineering"),
        ("IT", "Information Technology"),
        ("ECE", "Electronics and Communication Engineering"),
        ("ME", "Mechanical Engineering"),
        ("CE", "Civil Engineering"),
        ("EE", "Electrical Engineering"),
    ]

    YEAR_CHOICES = [
        ("1", "First Year"),
        ("2", "Second Year"),
        ("3", "Third Year"),
        ("4", "Fourth Year"),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="student_profile",
        null=True,
        blank=True,
    )
    enrollment_number = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    branch = models.CharField(max_length=10, choices=BRANCH_CHOICES)
    year = models.CharField(max_length=1, choices=YEAR_CHOICES)
    cgpa = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        validators=[MinValueValidator(0.0), MaxValueValidator(10.0)],
    )
    resume = models.FileField(upload_to="resumes/", null=True, blank=True)
    skills = models.TextField(help_text="Comma-separated skills")
    is_placed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.enrollment_number} - {self.name}"


class Company(models.Model):
    COMPANY_TYPE_CHOICES = [
        ("PRODUCT", "Product Based"),
        ("SERVICE", "Service Based"),
        ("STARTUP", "Startup"),
        ("MNC", "Multinational Corporation"),
    ]

    name = models.CharField(max_length=200)
    description = models.TextField()
    company_type = models.CharField(max_length=20, choices=COMPANY_TYPE_CHOICES)
    website = models.URLField(blank=True)
    package_offered = models.DecimalField(
        max_digits=10, decimal_places=2, help_text="Package in LPA"
    )
    min_cgpa_required = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        validators=[MinValueValidator(0.0), MaxValueValidator(10.0)],
    )
    eligible_branches = models.CharField(
        max_length=200, help_text="Comma-separated branch codes"
    )
    job_role = models.CharField(max_length=200)
    job_location = models.CharField(max_length=200)
    contact_person = models.CharField(max_length=200)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=15)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-package_offered"]
        verbose_name_plural = "Companies"

    def __str__(self):
        return f"{self.name} - {self.job_role}"


class PlacementStage(models.Model):
    STAGE_TYPE_CHOICES = [
        ("APPLICATION", "Application Submission"),
        ("APTITUDE", "Aptitude Test"),
        ("TECHNICAL1", "Technical Round 1"),
        ("TECHNICAL2", "Technical Round 2"),
        ("TECHNICAL3", "Technical Round 3"),
        ("HR", "HR Round"),
        ("FINAL", "Final Selection"),
    ]

    name = models.CharField(max_length=100)
    stage_type = models.CharField(max_length=20, choices=STAGE_TYPE_CHOICES)
    description = models.TextField(blank=True)
    sequence_order = models.IntegerField(default=1)

    class Meta:
        ordering = ["sequence_order"]

    def __str__(self):
        return f"{self.name} (Order: {self.sequence_order})"


class PlacementProgress(models.Model):
    STATUS_CHOICES = [
        ("APPLIED", "Applied"),
        ("IN_PROGRESS", "In Progress"),
        ("SHORTLISTED", "Shortlisted"),
        ("SELECTED", "Selected"),
        ("REJECTED", "Rejected"),
        ("OFFER_RECEIVED", "Offer Received"),
        ("OFFER_ACCEPTED", "Offer Accepted"),
        ("OFFER_DECLINED", "Offer Declined"),
    ]

    student = models.ForeignKey(
        Student, on_delete=models.CASCADE, related_name="placements"
    )
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, related_name="applicants"
    )
    current_stage = models.ForeignKey(
        PlacementStage,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="current_students",
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="APPLIED")
    application_date = models.DateField(auto_now_add=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]
        unique_together = ["student", "company"]

    def __str__(self):
        return f"{self.student.name} - {self.company.name} ({self.status})"


class StageProgress(models.Model):
    RESULT_CHOICES = [
        ("PENDING", "Pending"),
        ("CLEARED", "Cleared"),
        ("FAILED", "Failed"),
    ]

    placement_progress = models.ForeignKey(
        PlacementProgress, on_delete=models.CASCADE, related_name="stage_details"
    )
    stage = models.ForeignKey(PlacementStage, on_delete=models.CASCADE)
    result = models.CharField(max_length=20, choices=RESULT_CHOICES, default="PENDING")
    scheduled_date = models.DateTimeField(null=True, blank=True)
    completed_date = models.DateTimeField(null=True, blank=True)
    feedback = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["stage__sequence_order"]
        unique_together = ["placement_progress", "stage"]

    def __str__(self):
        return f"{self.placement_progress.student.name} - {self.stage.name} ({self.result})"


class ImportantDate(models.Model):
    EVENT_TYPE_CHOICES = [
        ("DRIVE", "Placement Drive"),
        ("DEADLINE", "Application Deadline"),
        ("TEST", "Test/Assessment"),
        ("INTERVIEW", "Interview"),
        ("RESULT", "Result Announcement"),
        ("OTHER", "Other"),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    event_type = models.CharField(max_length=20, choices=EVENT_TYPE_CHOICES)
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="important_dates",
        null=True,
        blank=True,
    )
    event_date = models.DateTimeField()
    location = models.CharField(max_length=200, blank=True)
    link = models.URLField(max_length=500, blank=True, help_text="Event registration or meeting link")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["event_date"]

    def __str__(self):
        return f"{self.title} - {self.event_date.strftime('%Y-%m-%d')}"
