from accounts.permissions import IsAdmin, IsAdminOrReadOnly, IsOwnerOrAdmin, IsStudent
from django.db.models import Avg, Count, Q
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

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
        elif user.is_student and hasattr(user, "student_profile"):
            return PlacementProgress.objects.filter(student=user.student_profile)
        return PlacementProgress.objects.none()

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
