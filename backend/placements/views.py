from accounts.permissions import IsAdmin, IsAdminOrReadOnly, IsOwnerOrAdmin, IsStudent
from django.db.models import Avg, Count, Q
from django.db import models
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import csv
import io

from .models import (
    Company,
    ImportantDate,
    PlacementProgress,
    PlacementStage,
    StageProgress,
    Student,
)
from .serializers import (
    CompanySerializer,
    ImportantDateSerializer,
    PlacementProgressSerializer,
    PlacementStageSerializer,
    StageProgressSerializer,
    StudentSerializer,
)


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        """
        Admins can perform all operations
        Students can only view (list/retrieve)
        """
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAdmin()]
        return [IsAuthenticated()]

    def get_queryset(self):
        """
        Students can only see their own profile
        Admins can see all students
        """
        user = self.request.user
        if user.is_admin or user.is_staff:
            return Student.objects.all()
        elif user.is_student:
            return Student.objects.filter(user=user)
        return Student.objects.none()

    def perform_create(self, serializer):
        """Link student to current user if they are a student"""
        if self.request.user.is_student:
            serializer.save(user=self.request.user)
        else:
            serializer.save()

    @action(detail=False, methods=["get"])
    def placed_students(self, request):
        """Get all placed students"""
        placed = self.queryset.filter(is_placed=True)
        serializer = self.get_serializer(placed, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def unplaced_students(self, request):
        """Get all unplaced students"""
        unplaced = self.queryset.filter(is_placed=False)
        serializer = self.get_serializer(unplaced, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def placement_history(self, request, pk=None):
        """Get placement history for a specific student"""
        student = self.get_object()
        placements = PlacementProgress.objects.filter(student=student)
        serializer = PlacementProgressSerializer(placements, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["post"], permission_classes=[IsAdmin])
    def upload_csv(self, request):
        """Upload students from CSV file"""
        if 'file' not in request.FILES:
            return Response(
                {"error": "No file provided"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        csv_file = request.FILES['file']
        
        # Check if file is CSV
        if not csv_file.name.endswith('.csv'):
            return Response(
                {"error": "File must be a CSV"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Read and decode the file
            decoded_file = csv_file.read().decode('utf-8')
            io_string = io.StringIO(decoded_file)
            reader = csv.DictReader(io_string)
            
            created_count = 0
            updated_count = 0
            errors = []
            
            for row_num, row in enumerate(reader, start=2):  # Start at 2 (header is 1)
                try:
                    enrollment_number = row.get('enrollment_number', '').strip()
                    if not enrollment_number:
                        errors.append(f"Row {row_num}: Missing enrollment_number")
                        continue
                    
                    # Check if student exists
                    student, created = Student.objects.update_or_create(
                        enrollment_number=enrollment_number,
                        defaults={
                            'name': row.get('name', '').strip(),
                            'email': row.get('email', '').strip(),
                            'phone': row.get('phone', '').strip(),
                            'branch': row.get('branch', '').strip(),
                            'year': row.get('year', '').strip(),
                            'cgpa': float(row.get('cgpa', 0)),
                            'skills': row.get('skills', '').strip(),
                            'is_placed': row.get('is_placed', 'FALSE').strip().upper() == 'TRUE',
                        }
                    )
                    
                    if created:
                        created_count += 1
                    else:
                        updated_count += 1
                        
                except Exception as e:
                    errors.append(f"Row {row_num}: {str(e)}")
            
            return Response({
                "message": "CSV processed successfully",
                "created": created_count,
                "updated": updated_count,
                "errors": errors
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"error": f"Error processing CSV: {str(e)}"}, 
                status=status.HTTP_400_BAD_REQUEST
            )


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAdminOrReadOnly]

    @action(detail=False, methods=["get"])
    def active_companies(self, request):
        """Get all active companies"""
        active = self.queryset.filter(is_active=True)
        serializer = self.get_serializer(active, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def applicants(self, request, pk=None):
        """Get all applicants for a specific company"""
        company = self.get_object()
        placements = PlacementProgress.objects.filter(company=company)
        serializer = PlacementProgressSerializer(placements, many=True)
        return Response(serializer.data)


class PlacementStageViewSet(viewsets.ModelViewSet):
    queryset = PlacementStage.objects.all()
    serializer_class = PlacementStageSerializer
    permission_classes = [IsAdminOrReadOnly]


class PlacementProgressViewSet(viewsets.ModelViewSet):
    queryset = PlacementProgress.objects.all()
    serializer_class = PlacementProgressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Students can only see their own placement progress
        Admins can see all
        """
        user = self.request.user
        if user.is_admin or user.is_staff:
            return PlacementProgress.objects.all()
        elif user.is_student:
            if hasattr(user, "student_profile") and user.student_profile:
                return PlacementProgress.objects.filter(student=user.student_profile)
            else:
                # Student user exists but no student profile linked
                # Try to find student by email or username
                student = Student.objects.filter(
                    models.Q(email=user.email) | 
                    models.Q(enrollment_number=user.username.upper())
                ).first()
                if student:
                    # Link the student to user if found
                    student.user = user
                    student.save()
                    return PlacementProgress.objects.filter(student=student)
        return PlacementProgress.objects.none()
    
    @action(detail=False, methods=["get"])
    def my_progress(self, request):
        """Get current user's placement progress with debug info"""
        user = request.user
        
        debug_info = {
            "user_id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "is_student": user.is_student,
            "has_student_profile": hasattr(user, "student_profile"),
            "student_profile_id": user.student_profile.id if hasattr(user, "student_profile") and user.student_profile else None,
        }
        
        # Get placement progress
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        return Response({
            "debug": debug_info,
            "count": queryset.count(),
            "results": serializer.data
        })

    @action(detail=False, methods=["get"])
    def statistics(self, request):
        """Get placement statistics"""
        total_students = Student.objects.count()
        placed_students = Student.objects.filter(is_placed=True).count()
        total_companies = Company.objects.filter(is_active=True).count()
        total_applications = PlacementProgress.objects.count()

        offers_received = PlacementProgress.objects.filter(
            status="OFFER_RECEIVED"
        ).count()

        offers_accepted = PlacementProgress.objects.filter(
            status="OFFER_ACCEPTED"
        ).count()

        # Get average package
        avg_package = (
            Company.objects.filter(applicants__status="OFFER_ACCEPTED").aggregate(
                Avg("package_offered")
            )["package_offered__avg"]
            or 0
        )

        # Status breakdown
        status_breakdown = PlacementProgress.objects.values("status").annotate(
            count=Count("id")
        )

        # Branch-wise placement
        branch_stats = (
            Student.objects.filter(is_placed=True)
            .values("branch")
            .annotate(count=Count("id"))
        )

        return Response(
            {
                "total_students": total_students,
                "placed_students": placed_students,
                "placement_percentage": round(
                    (placed_students / total_students * 100), 2
                )
                if total_students > 0
                else 0,
                "total_companies": total_companies,
                "total_applications": total_applications,
                "offers_received": offers_received,
                "offers_accepted": offers_accepted,
                "average_package": round(avg_package, 2),
                "status_breakdown": list(status_breakdown),
                "branch_wise_placement": list(branch_stats),
            }
        )

    @action(detail=False, methods=["get"])
    def recent_updates(self, request):
        """Get recent placement updates"""
        recent = self.queryset.order_by("-updated_at")[:10]
        serializer = self.get_serializer(recent, many=True)
        return Response(serializer.data)


class StageProgressViewSet(viewsets.ModelViewSet):
    queryset = StageProgress.objects.all()
    serializer_class = StageProgressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Students can only see their own stage progress
        Admins can see all
        """
        user = self.request.user
        if user.is_admin or user.is_staff:
            return StageProgress.objects.all()
        elif user.is_student and hasattr(user, "student_profile"):
            return StageProgress.objects.filter(
                placement_progress__student=user.student_profile
            )
        return StageProgress.objects.none()


class ImportantDateViewSet(viewsets.ModelViewSet):
    queryset = ImportantDate.objects.all()
    serializer_class = ImportantDateSerializer
    permission_classes = [IsAdminOrReadOnly]

    @action(detail=False, methods=["get"])
    def upcoming(self, request):
        """Get upcoming important dates"""
        from django.utils import timezone

        upcoming = self.queryset.filter(
            event_date__gte=timezone.now(), is_active=True
        ).order_by("event_date")[:10]
        serializer = self.get_serializer(upcoming, many=True)
        return Response(serializer.data)
