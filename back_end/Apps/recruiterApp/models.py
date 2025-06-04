from django.db import models

# Create your models here.

class RecruiterType(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self): return self.name

class Recruiter(models.Model):
    user = models.ForeignKey('Apps.authentication_folder.User', on_delete=models.CASCADE, related_name='recruiter_profiles')
    company = models.ForeignKey('Apps.core.Company', on_delete=models.CASCADE, related_name='recruiters')
    type = models.ForeignKey('Apps.recruiterApp.RecruiterType', on_delete=models.CASCADE, related_name='recruiters')
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
    recruiter = models.ForeignKey('recruiterApp.Recruiter', on_delete=models.CASCADE)
    country_name = models.CharField(max_length=100)
    def __str__(self): return f"{self.recruiter} - {self.country_name}"

class RecruiterPerformance(models.Model):
    recruiter = models.ForeignKey('recruiterApp.Recruiter', on_delete=models.CASCADE, related_name='performances')
    company = models.ForeignKey('core.Company', on_delete=models.CASCADE, related_name='recruiter_performances')
    period_month = models.CharField(max_length=7)  # e.g. '2024-05'
    hires_count = models.IntegerField(default=0)
    applications_count = models.IntegerField(default=0)
    avg_time_to_hire = models.DecimalField(max_digits=6, decimal_places=2)
    fill_rate = models.DecimalField(max_digits=5, decimal_places=2)
    notes = models.TextField(blank=True)
    def __str__(self): return f"{self.recruiter} {self.period_month}"
