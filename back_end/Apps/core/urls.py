from rest_framework.routers import DefaultRouter
from django.urls import path, include
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'companies', views.CompanyViewSet)
router.register(r'candidates', views.CandidateViewSet)
router.register(r'employees', views.EmployeeViewSet)
router.register(r'recruiters', views.RecruiterViewSet)
router.register(r'projects', views.ProjectViewSet)
router.register(r'vacancies', views.VacancyViewSet)
router.register(r'candidate-applications', views.CandidateApplicationViewSet)
router.register(r'candidate-documents', views.CandidateDocumentViewSet)
router.register(r'candidate-tags', views.CandidateTagViewSet)
router.register(r'employee-documents', views.EmployeeDocumentViewSet)
router.register(r'recruiter-performance', views.RecruiterPerformanceViewSet)
router.register(r'application-status-changes', views.ApplicationStatusChangeViewSet)
router.register(r'statuses', views.StatusViewSet)
router.register(r'housing-statuses', views.HousingStatusViewSet)
router.register(r'job-types', views.JobTypeViewSet)
router.register(r'shifts', views.ShiftViewSet)
router.register(r'recruiter-types', views.RecruiterTypeViewSet)
router.register(r'tags', views.TagViewSet)
router.register(r'roles', views.RoleViewSet)
router.register(r'recruiter-countries', views.RecruiterCountryViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
