from django.core.management.base import BaseCommand
from core.models import Status, HousingStatus, JobType, Shift, RecruiterType, Company, Tag
from authentication_folder.models import User, Role

class Command(BaseCommand):
    help = 'Seeds the database with initial data.'

    def handle(self, *args, **kwargs):
        # Lookup tables
        status_names = ['Applied', 'Interviewing', 'Hired', 'Rejected']
        for name in status_names:
            Status.objects.get_or_create(name=name)
        self.stdout.write(self.style.SUCCESS('Seeded Statuses'))

        housing_statuses = ['Rented', 'Owned', 'Temporary']
        for name in housing_statuses:
            HousingStatus.objects.get_or_create(name=name)
        self.stdout.write(self.style.SUCCESS('Seeded HousingStatuses'))

        job_types = ['Full-Time', 'Part-Time', 'Contract']
        for name in job_types:
            JobType.objects.get_or_create(name=name)
        self.stdout.write(self.style.SUCCESS('Seeded JobTypes'))

        shifts = ['Morning', 'Evening', 'Night']
        for name in shifts:
            Shift.objects.get_or_create(name=name)
        self.stdout.write(self.style.SUCCESS('Seeded Shifts'))

        recruiter_types = ['Internal', 'External']
        for name in recruiter_types:
            RecruiterType.objects.get_or_create(name=name)
        self.stdout.write(self.style.SUCCESS('Seeded RecruiterTypes'))

        # Main entities
        company, _ = Company.objects.get_or_create(
            name='Demo Company',
            address='123 Main St',
            tax_id='TAX123456'
        )
        self.stdout.write(self.style.SUCCESS(f'Seeded Company: {company}'))

        role, _ = Role.objects.get_or_create(
            name='Admin',
            defaults={'description': 'Administrator'}
        )
        self.stdout.write(self.style.SUCCESS(f'Seeded Role: {role}'))

        # Create an admin user (if not exists)
        user, created = User.objects.get_or_create(
            email='admin@example.com',
            defaults={
                'full_name': 'Admin User',
                'role': role,
                'company': company,
                'is_staff': True,
                'is_superuser': True
            }
        )
        if created:
            user.set_password('admin1234')
            user.save()
            self.stdout.write(self.style.SUCCESS('Created admin user (admin@example.com / admin1234)'))
        else:
            self.stdout.write(self.style.SUCCESS('Admin user already exists'))

        # Tags
        tags = ['Python', 'Django', 'Recruitment']
        for tag in tags:
            Tag.objects.get_or_create(name=tag)
        self.stdout.write(self.style.SUCCESS('Seeded Tags'))

        self.stdout.write(self.style.SUCCESS('Database seeding completed.'))
