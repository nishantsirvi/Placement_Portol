from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from placements.models import Student, Company, PlacementStage, PlacementProgress, StageProgress, ImportantDate
import random


class Command(BaseCommand):
    help = 'Populate database with sample data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating sample data...')
        
        # Create Placement Stages
        stages_data = [
            {'name': 'Application Submission', 'stage_type': 'APPLICATION', 'sequence_order': 1},
            {'name': 'Aptitude Test', 'stage_type': 'APTITUDE', 'sequence_order': 2},
            {'name': 'Technical Round 1', 'stage_type': 'TECHNICAL1', 'sequence_order': 3},
            {'name': 'Technical Round 2', 'stage_type': 'TECHNICAL2', 'sequence_order': 4},
            {'name': 'HR Round', 'stage_type': 'HR', 'sequence_order': 5},
            {'name': 'Final Selection', 'stage_type': 'FINAL', 'sequence_order': 6},
        ]
        
        stages = []
        for stage_data in stages_data:
            stage, created = PlacementStage.objects.get_or_create(**stage_data)
            stages.append(stage)
            if created:
                self.stdout.write(f'Created stage: {stage.name}')
        
        # Create Students
        branches = ['CSE', 'IT', 'ECE', 'ME', 'CE', 'EE']
        years = ['3', '4']
        
        for i in range(1, 51):
            student, created = Student.objects.get_or_create(
                enrollment_number=f'2021{str(i).zfill(4)}',
                defaults={
                    'name': f'Student {i}',
                    'email': f'student{i}@example.com',
                    'phone': f'98765{str(i).zfill(5)}',
                    'branch': random.choice(branches),
                    'year': random.choice(years),
                    'cgpa': round(random.uniform(6.5, 9.5), 2),
                    'skills': 'Python, Java, C++, Data Structures, Algorithms',
                    'is_placed': random.choice([True, False]),
                }
            )
            if created:
                self.stdout.write(f'Created student: {student.name}')
        
        # Create Companies
        companies_data = [
            {
                'name': 'Google India',
                'description': 'Leading technology company',
                'company_type': 'MNC',
                'website': 'https://google.com',
                'package_offered': 25.0,
                'min_cgpa_required': 8.0,
                'eligible_branches': 'CSE,IT,ECE',
                'job_role': 'Software Engineer',
                'job_location': 'Bangalore',
                'contact_person': 'HR Manager',
                'contact_email': 'hr@google.com',
                'contact_phone': '9876543210',
            },
            {
                'name': 'Microsoft',
                'description': 'Global software company',
                'company_type': 'MNC',
                'website': 'https://microsoft.com',
                'package_offered': 23.0,
                'min_cgpa_required': 7.5,
                'eligible_branches': 'CSE,IT',
                'job_role': 'Software Development Engineer',
                'job_location': 'Hyderabad',
                'contact_person': 'Recruitment Team',
                'contact_email': 'recruit@microsoft.com',
                'contact_phone': '9876543211',
            },
            {
                'name': 'Amazon',
                'description': 'E-commerce and cloud computing',
                'company_type': 'MNC',
                'website': 'https://amazon.com',
                'package_offered': 20.0,
                'min_cgpa_required': 7.0,
                'eligible_branches': 'CSE,IT,ECE',
                'job_role': 'SDE - I',
                'job_location': 'Bangalore',
                'contact_person': 'Campus Hiring',
                'contact_email': 'campus@amazon.com',
                'contact_phone': '9876543212',
            },
            {
                'name': 'TCS',
                'description': 'IT services and consulting',
                'company_type': 'SERVICE',
                'website': 'https://tcs.com',
                'package_offered': 7.0,
                'min_cgpa_required': 6.5,
                'eligible_branches': 'CSE,IT,ECE,EE',
                'job_role': 'System Engineer',
                'job_location': 'Multiple Locations',
                'contact_person': 'TCS HR',
                'contact_email': 'hr@tcs.com',
                'contact_phone': '9876543213',
            },
            {
                'name': 'Infosys',
                'description': 'Digital services and consulting',
                'company_type': 'SERVICE',
                'website': 'https://infosys.com',
                'package_offered': 8.0,
                'min_cgpa_required': 6.5,
                'eligible_branches': 'CSE,IT,ECE',
                'job_role': 'Systems Engineer',
                'job_location': 'Pune',
                'contact_person': 'Campus Relations',
                'contact_email': 'campus@infosys.com',
                'contact_phone': '9876543214',
            },
        ]
        
        companies = []
        for company_data in companies_data:
            company, created = Company.objects.get_or_create(
                name=company_data['name'],
                defaults=company_data
            )
            companies.append(company)
            if created:
                self.stdout.write(f'Created company: {company.name}')
        
        # Create Important Dates
        for i, company in enumerate(companies):
            date1, created = ImportantDate.objects.get_or_create(
                title=f'{company.name} - Application Deadline',
                defaults={
                    'description': f'Last date to apply for {company.name} placement drive',
                    'event_type': 'DEADLINE',
                    'company': company,
                    'event_date': timezone.now() + timedelta(days=7 + i*3),
                    'location': 'Online',
                    'is_active': True,
                }
            )
            
            date2, created = ImportantDate.objects.get_or_create(
                title=f'{company.name} - Aptitude Test',
                defaults={
                    'description': f'Aptitude test for {company.name}',
                    'event_type': 'TEST',
                    'company': company,
                    'event_date': timezone.now() + timedelta(days=10 + i*3),
                    'location': 'Main Auditorium',
                    'is_active': True,
                }
            )
        
        # Create Placement Progress for some students
        students = Student.objects.all()[:20]
        statuses = ['APPLIED', 'IN_PROGRESS', 'SHORTLISTED', 'SELECTED', 'REJECTED', 'OFFER_RECEIVED']
        
        for student in students:
            # Apply to 2-3 random companies
            selected_companies = random.sample(companies, random.randint(1, 3))
            
            for company in selected_companies:
                progress, created = PlacementProgress.objects.get_or_create(
                    student=student,
                    company=company,
                    defaults={
                        'current_stage': random.choice(stages[:4]),
                        'status': random.choice(statuses),
                        'notes': 'Application in progress',
                    }
                )
                
                if created:
                    self.stdout.write(f'Created placement progress: {student.name} - {company.name}')
                    
                    # Create stage progress
                    for stage in stages[:random.randint(2, 4)]:
                        StageProgress.objects.get_or_create(
                            placement_progress=progress,
                            stage=stage,
                            defaults={
                                'result': random.choice(['PENDING', 'CLEARED', 'FAILED']),
                                'scheduled_date': timezone.now() + timedelta(days=random.randint(1, 30)),
                                'feedback': 'Feedback pending',
                            }
                        )
        
        self.stdout.write(self.style.SUCCESS('Successfully populated database with sample data!'))