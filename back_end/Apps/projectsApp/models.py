from django.db import models

from Apps.core.models import Company
from Apps.authentication_folder.models import User
from Apps.recruiterApp.models import Recruiter
from Apps.core.models import Shift, JobType

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
    recruiter = models.ForeignKey(Recruiter, on_delete=models.CASCADE, related_name='vacancies')
    open_positions = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    closed_at = models.DateTimeField(null=True, blank=True)
    def __str__(self): return f"{self.name} @ {self.company}"
