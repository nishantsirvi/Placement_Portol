from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from placements.models import Student

User = get_user_model()


class Command(BaseCommand):
    help = 'Link existing students to user accounts or create new user accounts'

    def handle(self, *args, **options):
        students_without_users = Student.objects.filter(user__isnull=True)
        
        self.stdout.write(f"Found {students_without_users.count()} students without linked user accounts")
        
        created_count = 0
        linked_count = 0
        
        for student in students_without_users:
            username = student.enrollment_number.lower()
            
            # Check if user already exists
            existing_user = User.objects.filter(username=username).first()
            if existing_user:
                # Link existing user
                student.user = existing_user
                student.save()
                linked_count += 1
                self.stdout.write(
                    self.style.SUCCESS(
                        f"Linked student {student.enrollment_number} to existing user {username}"
                    )
                )
            else:
                # Create new user account
                password = f"{student.name.split()[0].lower()}{student.enrollment_number[-4:]}"
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
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(
                        f"Created user for {student.enrollment_number}: {username} / {password}"
                    )
                )
        
        self.stdout.write(
            self.style.SUCCESS(
                f"\nCompleted! Created {created_count} users, linked {linked_count} existing users"
            )
        )
