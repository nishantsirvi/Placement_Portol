from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from placements.models import Company, PlacementStage, Student

User = get_user_model()


class Command(BaseCommand):
    help = "Seed database with demo users and data"

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS("Starting to seed database..."))

        # Create Admin user
        if not User.objects.filter(username="admin").exists():
            admin = User.objects.create_superuser(
                username="admin",
                email="admin@college.edu",
                password="admin123",
                first_name="Admin",
                last_name="User",
                role="ADMIN",
                is_verified=True,
            )
            self.stdout.write(
                self.style.SUCCESS(f"✓ Created admin user: {admin.username}")
            )
        else:
            admin = User.objects.get(username="admin")
            admin.set_password("admin123")
            admin.save()
            self.stdout.write(
                self.style.WARNING(
                    "✓ Admin user already exists, password reset to admin123"
                )
            )

        # Create Student users
        students_data = [
            {
                "username": "john.doe",
                "email": "john.doe@student.edu",
                "password": "student123",
                "first_name": "John",
                "last_name": "Doe",
                "role": "STUDENT",
                "phone": "9876543210",
                "enrollment": "CS2021001",
                "branch": "CSE",
                "year": "4",
                "cgpa": 8.5,
                "skills": "Python, Django, React, JavaScript, SQL",
            },
            {
                "username": "jane.smith",
                "email": "jane.smith@student.edu",
                "password": "student123",
                "first_name": "Jane",
                "last_name": "Smith",
                "role": "STUDENT",
                "phone": "9876543211",
                "enrollment": "CS2021002",
                "branch": "CSE",
                "year": "4",
                "cgpa": 9.2,
                "skills": "Java, Spring Boot, Angular, MySQL, AWS",
            },
            {
                "username": "mike.johnson",
                "email": "mike.johnson@student.edu",
                "password": "student123",
                "first_name": "Mike",
                "last_name": "Johnson",
                "role": "STUDENT",
                "phone": "9876543212",
                "enrollment": "IT2021001",
                "branch": "IT",
                "year": "4",
                "cgpa": 7.8,
                "skills": "C++, Data Structures, Algorithms, Git",
            },
        ]

        for student_data in students_data:
            if not User.objects.filter(username=student_data["username"]).exists():
                user = User.objects.create_user(
                    username=student_data["username"],
                    email=student_data["email"],
                    password=student_data["password"],
                    first_name=student_data["first_name"],
                    last_name=student_data["last_name"],
                    role=student_data["role"],
                    phone=student_data["phone"],
                    is_verified=True,
                )

                # Create associated Student profile
                Student.objects.create(
                    user=user,
                    enrollment_number=student_data["enrollment"],
                    name=f"{student_data['first_name']} {student_data['last_name']}",
                    email=student_data["email"],
                    phone=student_data["phone"],
                    branch=student_data["branch"],
                    year=student_data["year"],
                    cgpa=student_data["cgpa"],
                    skills=student_data["skills"],
                )

                self.stdout.write(
                    self.style.SUCCESS(f"✓ Created student: {user.username}")
                )
            else:
                self.stdout.write(
                    self.style.WARNING(
                        f"✓ Student {student_data['username']} already exists"
                    )
                )

        # Create Company Representative user
        if not User.objects.filter(username="company.rep").exists():
            company_user = User.objects.create_user(
                username="company.rep",
                email="hr@techcorp.com",
                password="company123",
                first_name="HR",
                last_name="Manager",
                role="COMPANY",
                phone="9876543213",
                is_verified=True,
            )
            self.stdout.write(
                self.style.SUCCESS(f"✓ Created company rep: {company_user.username}")
            )
        else:
            self.stdout.write(self.style.WARNING("✓ Company rep already exists"))

        # Create Companies
        companies_data = [
            {
                "name": "Google",
                "description": "Leading technology company specializing in Internet-related services",
                "company_type": "PRODUCT",
                "website": "https://www.google.com",
                "package_offered": 24.0,
                "min_cgpa_required": 7.5,
                "eligible_branches": "CSE,IT,ECE",
                "job_role": "Software Engineer",
                "job_location": "Bangalore",
                "contact_person": "HR Manager",
                "contact_email": "hr@google.com",
                "contact_phone": "1234567890",
            },
            {
                "name": "Microsoft",
                "description": "Global technology company developing software and cloud services",
                "company_type": "PRODUCT",
                "website": "https://www.microsoft.com",
                "package_offered": 22.0,
                "min_cgpa_required": 7.0,
                "eligible_branches": "CSE,IT,ECE,EE",
                "job_role": "Software Development Engineer",
                "job_location": "Hyderabad",
                "contact_person": "Talent Acquisition",
                "contact_email": "careers@microsoft.com",
                "contact_phone": "1234567891",
            },
            {
                "name": "TCS",
                "description": "IT services, consulting and business solutions organization",
                "company_type": "SERVICE",
                "website": "https://www.tcs.com",
                "package_offered": 3.6,
                "min_cgpa_required": 6.0,
                "eligible_branches": "CSE,IT,ECE,EE,ME,CE",
                "job_role": "Assistant System Engineer",
                "job_location": "Multiple Locations",
                "contact_person": "Campus Recruiter",
                "contact_email": "campus@tcs.com",
                "contact_phone": "1234567892",
            },
        ]

        for company_data in companies_data:
            if not Company.objects.filter(name=company_data["name"]).exists():
                Company.objects.create(**company_data)
                self.stdout.write(
                    self.style.SUCCESS(f"✓ Created company: {company_data['name']}")
                )
            else:
                self.stdout.write(
                    self.style.WARNING(
                        f"✓ Company {company_data['name']} already exists"
                    )
                )

        # Create Placement Stages
        stages_data = [
            {
                "name": "Application Submission",
                "stage_type": "APPLICATION",
                "description": "Submit your application",
                "sequence_order": 1,
            },
            {
                "name": "Aptitude Test",
                "stage_type": "APTITUDE",
                "description": "Online aptitude assessment",
                "sequence_order": 2,
            },
            {
                "name": "Technical Round 1",
                "stage_type": "TECHNICAL1",
                "description": "First technical interview",
                "sequence_order": 3,
            },
            {
                "name": "Technical Round 2",
                "stage_type": "TECHNICAL2",
                "description": "Second technical interview",
                "sequence_order": 4,
            },
            {
                "name": "HR Round",
                "stage_type": "HR",
                "description": "HR interview and discussion",
                "sequence_order": 5,
            },
            {
                "name": "Final Selection",
                "stage_type": "FINAL",
                "description": "Final offer and onboarding",
                "sequence_order": 6,
            },
        ]

        for stage_data in stages_data:
            if not PlacementStage.objects.filter(
                stage_type=stage_data["stage_type"]
            ).exists():
                PlacementStage.objects.create(**stage_data)
                self.stdout.write(
                    self.style.SUCCESS(f"✓ Created stage: {stage_data['name']}")
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f"✓ Stage {stage_data['name']} already exists")
                )

        self.stdout.write(self.style.SUCCESS("\n=== Database seeded successfully! ==="))
        self.stdout.write(self.style.SUCCESS("\nDemo Login Credentials:"))
        self.stdout.write(self.style.SUCCESS("─" * 50))
        self.stdout.write(self.style.SUCCESS("Admin:"))
        self.stdout.write(self.style.SUCCESS("  Username: admin"))
        self.stdout.write(self.style.SUCCESS("  Password: admin123"))
        self.stdout.write(self.style.SUCCESS("\nStudent:"))
        self.stdout.write(self.style.SUCCESS("  Username: john.doe"))
        self.stdout.write(self.style.SUCCESS("  Password: student123"))
        self.stdout.write(self.style.SUCCESS("\nCompany Rep:"))
        self.stdout.write(self.style.SUCCESS("  Username: company.rep"))
        self.stdout.write(self.style.SUCCESS("  Password: company123"))
        self.stdout.write(self.style.SUCCESS("─" * 50))
