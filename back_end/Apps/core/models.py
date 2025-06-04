from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from authentication_folder.models import User, Role
from recruiterApp.models import Recruiter

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

# Main entities
class Company(models.Model):
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    tax_id = models.CharField(max_length=100)
    def __str__(self): return self.name


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
    recruiter = models.ForeignKey('recruiterApp.Recruiter', on_delete=models.CASCADE, related_name='candidates')
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
    vacancy = models.ForeignKey('projectsApp.Vacancy', on_delete=models.CASCADE, related_name='applications')
    status = models.ForeignKey(Status, on_delete=models.CASCADE, related_name='applications')
    applied_at = models.DateTimeField(auto_now_add=True)
    recruiter = models.ForeignKey('recruiterApp.Recruiter', on_delete=models.CASCADE, related_name='applications')
    def __str__(self): return f"{self.candidate} applied for {self.vacancy}"

class CandidateTag(models.Model):
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='candidate_tags')
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE, related_name='candidate_tags')
    def __str__(self): return f"{self.candidate} - {self.tag}"

class Employee(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='employees')
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='employee_entries')
    project = models.ForeignKey('projectsApp.Project', on_delete=models.CASCADE, related_name='employees')
    vacancy = models.ForeignKey('projectsApp.Vacancy', on_delete=models.CASCADE, related_name='employees')
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



class ApplicationStatusChange(models.Model):
    application = models.ForeignKey(CandidateApplication, on_delete=models.CASCADE, related_name='status_changes')
    old_status = models.ForeignKey(Status, on_delete=models.CASCADE, related_name='application_old_status_changes')
    new_status = models.ForeignKey(Status, on_delete=models.CASCADE, related_name='application_new_status_changes')
    changed_at = models.DateTimeField(auto_now_add=True)
    changed_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='status_changes_made')
    def __str__(self): return f"{self.application} {self.old_status}→{self.new_status}"

