from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

# Lookup tables
class Status(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self): return self.name

class HousingStatus(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self): return self.name

class JobType(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self): return self.name

class Shift(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self): return self.name

class RecruiterType(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self): return self.name

# Main entities
class Company(models.Model):
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    tax_id = models.CharField(max_length=100)
    def __str__(self): return self.name

class Role(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    def __str__(self): return self.name

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    full_name = models.CharField(max_length=255, null=True, blank=True)
    email = models.EmailField(unique=True)
    role = models.ForeignKey(Role, on_delete=models.CASCADE, null=True, blank=True, related_name='users')
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True, related_name='users')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    last_login = models.DateTimeField(null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    objects = UserManager()

    def __str__(self):
        return f"{self.full_name} <{self.email}>"

class Tag(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self): return self.name

class Candidate(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=50)
    email = models.EmailField()
    city = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    relocation_ready = models.BooleanField(default=False)
    nationality = models.CharField(max_length=100)
    specialty = models.CharField(max_length=100)
    additional_info = models.TextField(blank=True)
    status = models.ForeignKey(Status, on_delete=models.CASCADE, related_name='candidates')
    housing_status = models.ForeignKey(HousingStatus, on_delete=models.CASCADE, related_name='candidates')
    recruiter = models.ForeignKey('Recruiter', on_delete=models.CASCADE, related_name='candidates')
    def __str__(self): return f"{self.first_name} {self.last_name} ({self.company})"

class CandidateDocument(models.Model):
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE)
    file_path = models.CharField(max_length=255)
    type = models.CharField(max_length=100)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    def __str__(self): return f"{self.type} for {self.candidate}"

class CandidateApplication(models.Model):
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='applications')
    vacancy = models.ForeignKey('Vacancy', on_delete=models.CASCADE, related_name='applications')
    status = models.ForeignKey(Status, on_delete=models.CASCADE, related_name='applications')
    applied_at = models.DateTimeField(auto_now_add=True)
    recruiter = models.ForeignKey('Recruiter', on_delete=models.CASCADE, related_name='applications')
    def __str__(self): return f"{self.candidate} applied for {self.vacancy}"

class CandidateTag(models.Model):
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='candidate_tags')
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE, related_name='candidate_tags')
    def __str__(self): return f"{self.candidate} - {self.tag}"

class Employee(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='employees')
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='employee_entries')
    project = models.ForeignKey('Project', on_delete=models.CASCADE, related_name='employees')
    vacancy = models.ForeignKey('Vacancy', on_delete=models.CASCADE, related_name='employees')
    start_date = models.DateField()
    finished_date = models.DateField(null=True, blank=True)
    fired_date = models.DateField(null=True, blank=True)
    planned_end_date = models.DateField(null=True, blank=True)
    is_registered_zus = models.BooleanField(default=False)
    zus_registration_date = models.DateField(null=True, blank=True)
    fines = models.TextField(blank=True)
    housing_details = models.TextField(blank=True)
    legal_docs = models.TextField(blank=True)
    additional_info = models.TextField(blank=True)
    def __str__(self): return f"{self.candidate} @ {self.company}"

class EmployeeDocument(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='documents')
    file_path = models.CharField(max_length=255)
    type = models.CharField(max_length=100)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    def __str__(self): return f"{self.type} for {self.employee}"

class Project(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    required_people_count = models.IntegerField()
    details = models.TextField(blank=True)
    location_street = models.CharField(max_length=255)
    location_city = models.CharField(max_length=100)
    location_postal_code = models.CharField(max_length=20)
    location_country = models.CharField(max_length=100)
    manager = models.ForeignKey(User, on_delete=models.CASCADE, related_name='managed_projects')
    def __str__(self): return self.name

class Vacancy(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='vacancies')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='vacancies')
    name = models.CharField(max_length=255)
    description = models.TextField()
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    working_hours_daily = models.DecimalField(max_digits=5, decimal_places=2)
    working_hours_monthly = models.DecimalField(max_digits=6, decimal_places=2)
    shift = models.ForeignKey(Shift, on_delete=models.CASCADE, related_name='vacancies')
    sex_required = models.CharField(max_length=20)
    job_type = models.ForeignKey(JobType, on_delete=models.CASCADE, related_name='vacancies')
    recruiter = models.ForeignKey('Recruiter', on_delete=models.CASCADE, related_name='vacancies')
    open_positions = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    closed_at = models.DateTimeField(null=True, blank=True)
    def __str__(self): return f"{self.name} @ {self.company}"

class Recruiter(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recruiter_profiles')
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='recruiters')
    type = models.ForeignKey(RecruiterType, on_delete=models.CASCADE, related_name='recruiters')
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone_number = models.CharField(max_length=50)
    about = models.TextField(blank=True)
    additional_info = models.TextField(blank=True)
    active = models.BooleanField(default=True)
    specialized_countries = models.TextField(blank=True)
    total_candidates = models.IntegerField(default=0)
    total_hires = models.IntegerField(default=0)
    total_applications = models.IntegerField(default=0)
    def __str__(self): return self.name

class RecruiterCountry(models.Model):
    recruiter = models.ForeignKey(Recruiter, on_delete=models.CASCADE)
    country_name = models.CharField(max_length=100)
    def __str__(self): return f"{self.recruiter} - {self.country_name}"

class RecruiterPerformance(models.Model):
    recruiter = models.ForeignKey(Recruiter, on_delete=models.CASCADE, related_name='performances')
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='recruiter_performances')
    period_month = models.CharField(max_length=7)  # e.g. '2024-05'
    hires_count = models.IntegerField(default=0)
    applications_count = models.IntegerField(default=0)
    avg_time_to_hire = models.DecimalField(max_digits=6, decimal_places=2)
    fill_rate = models.DecimalField(max_digits=5, decimal_places=2)
    notes = models.TextField(blank=True)
    def __str__(self): return f"{self.recruiter} {self.period_month}"

class ApplicationStatusChange(models.Model):
    application = models.ForeignKey(CandidateApplication, on_delete=models.CASCADE, related_name='status_changes')
    old_status = models.ForeignKey(Status, on_delete=models.CASCADE, related_name='application_old_status_changes')
    new_status = models.ForeignKey(Status, on_delete=models.CASCADE, related_name='application_new_status_changes')
    changed_at = models.DateTimeField(auto_now_add=True)
    changed_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='status_changes_made')
    def __str__(self): return f"{self.application} {self.old_status}→{self.new_status}"

