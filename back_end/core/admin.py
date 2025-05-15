from django.contrib import admin
from .models import *

class CandidateDocumentInline(admin.TabularInline):
    model = CandidateDocument
    extra = 0

class CandidateTagInline(admin.TabularInline):
    model = CandidateTag
    extra = 0

@admin.register(Candidate)
class CandidateAdmin(admin.ModelAdmin):
    list_display = ('id', 'first_name', 'last_name', 'company', 'status', 'recruiter')
    search_fields = ('first_name', 'last_name', 'email', 'company__name')
    list_filter = ('company', 'status', 'recruiter')
    inlines = [CandidateDocumentInline, CandidateTagInline]

class EmployeeDocumentInline(admin.TabularInline):
    model = EmployeeDocument
    extra = 0

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('id', 'candidate', 'company', 'project', 'vacancy', 'start_date', 'finished_date')
    search_fields = ('candidate__first_name', 'candidate__last_name', 'company__name')
    list_filter = ('company', 'project', 'vacancy')
    inlines = [EmployeeDocumentInline]

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'address', 'tax_id')
    search_fields = ('name', 'tax_id')
    list_filter = ('name',)

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'full_name', 'email', 'company', 'role', 'is_active', 'is_staff')
    search_fields = ('full_name', 'email')
    list_filter = ('company', 'role', 'is_staff', 'is_active')

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description')
    search_fields = ('name',)

@admin.register(Recruiter)
class RecruiterAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'company', 'type', 'email', 'active')
    search_fields = ('name', 'email', 'company__name')
    list_filter = ('company', 'type', 'active')

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'company', 'manager')
    search_fields = ('name', 'company__name')
    list_filter = ('company',)

@admin.register(Vacancy)
class VacancyAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'company', 'project', 'shift', 'job_type', 'recruiter', 'open_positions')
    search_fields = ('name', 'company__name', 'project__name')
    list_filter = ('company', 'project', 'shift', 'job_type', 'recruiter')

@admin.register(CandidateDocument)
class CandidateDocumentAdmin(admin.ModelAdmin):
    list_display = ('id', 'candidate', 'type', 'uploaded_at', 'uploaded_by')
    search_fields = ('candidate__first_name', 'candidate__last_name', 'type')
    list_filter = ('type', 'uploaded_at')

@admin.register(EmployeeDocument)
class EmployeeDocumentAdmin(admin.ModelAdmin):
    list_display = ('id', 'employee', 'type', 'uploaded_at', 'uploaded_by')
    search_fields = ('employee__candidate__first_name', 'employee__candidate__last_name', 'type')
    list_filter = ('type', 'uploaded_at')

@admin.register(CandidateTag)
class CandidateTagAdmin(admin.ModelAdmin):
    list_display = ('id', 'candidate', 'tag')
    search_fields = ('candidate__first_name', 'candidate__last_name', 'tag__name')
    list_filter = ('tag',)

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(CandidateApplication)
class CandidateApplicationAdmin(admin.ModelAdmin):
    list_display = ('id', 'candidate', 'vacancy', 'status', 'applied_at', 'recruiter')
    search_fields = ('candidate__first_name', 'candidate__last_name', 'vacancy__name')
    list_filter = ('status', 'recruiter', 'applied_at')

@admin.register(RecruiterPerformance)
class RecruiterPerformanceAdmin(admin.ModelAdmin):
    list_display = ('id', 'recruiter', 'company', 'period_month', 'hires_count', 'applications_count')
    search_fields = ('recruiter__name', 'company__name', 'period_month')
    list_filter = ('company', 'period_month')

@admin.register(ApplicationStatusChange)
class ApplicationStatusChangeAdmin(admin.ModelAdmin):
    list_display = ('id', 'application', 'old_status', 'new_status', 'changed_at', 'changed_by')
    search_fields = ('application__candidate__first_name', 'application__candidate__last_name')
    list_filter = ('old_status', 'new_status', 'changed_at')

@admin.register(Status)
class StatusAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(HousingStatus)
class HousingStatusAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(JobType)
class JobTypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(Shift)
class ShiftAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(RecruiterType)
class RecruiterTypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(RecruiterCountry)
class RecruiterCountryAdmin(admin.ModelAdmin):
    list_display = ('id', 'recruiter', 'country_name')
    search_fields = ('recruiter__name', 'country_name')
    list_filter = ('country_name',)
