from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotAuthenticated
from .models import *
from .serializers import *

class CompanyScopedViewSetMixin:
    def get_queryset(self):
        if not self.request.user.is_authenticated:
            raise NotAuthenticated()
        qs = super().get_queryset()
        # Only filter if model has a company field
        if hasattr(self.model, 'company_id'):
            return qs.filter(company=self.request.user.company)
        return qs

    def perform_create(self, serializer):
        if hasattr(serializer.Meta.model, 'company_id'):
            company = self.request.user.company
            serializer.save(company=company)
        else:
            serializer.save()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]

class CandidateViewSet(viewsets.ModelViewSet):
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer
    permission_classes = [IsAuthenticated]

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]

class RecruiterViewSet(viewsets.ModelViewSet):
    queryset = Recruiter.objects.all()
    serializer_class = RecruiterSerializer
    permission_classes = [IsAuthenticated]

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

class VacancyViewSet(viewsets.ModelViewSet):
    queryset = Vacancy.objects.all()
    serializer_class = VacancySerializer
    permission_classes = [IsAuthenticated]

class CandidateApplicationViewSet(viewsets.ModelViewSet):
    queryset = CandidateApplication.objects.all()
    serializer_class = CandidateApplicationSerializer
    permission_classes = [IsAuthenticated]

class CandidateDocumentViewSet(viewsets.ModelViewSet):
    queryset = CandidateDocument.objects.all()
    serializer_class = CandidateDocumentSerializer
    permission_classes = [IsAuthenticated]

class CandidateTagViewSet(viewsets.ModelViewSet):
    queryset = CandidateTag.objects.all()
    serializer_class = CandidateTagSerializer
    permission_classes = [IsAuthenticated]

class EmployeeDocumentViewSet(viewsets.ModelViewSet):
    queryset = EmployeeDocument.objects.all()
    serializer_class = EmployeeDocumentSerializer
    permission_classes = [IsAuthenticated]

class RecruiterPerformanceViewSet(viewsets.ModelViewSet):
    queryset = RecruiterPerformance.objects.all()
    serializer_class = RecruiterPerformanceSerializer
    permission_classes = [IsAuthenticated]

class ApplicationStatusChangeViewSet(viewsets.ModelViewSet):
    queryset = ApplicationStatusChange.objects.all()
    serializer_class = ApplicationStatusChangeSerializer
    permission_classes = [IsAuthenticated]

class StatusViewSet(viewsets.ModelViewSet):
    queryset = Status.objects.all()
    serializer_class = StatusSerializer
    permission_classes = [IsAuthenticated]

class HousingStatusViewSet(viewsets.ModelViewSet):
    queryset = HousingStatus.objects.all()
    serializer_class = HousingStatusSerializer
    permission_classes = [IsAuthenticated]

class JobTypeViewSet(viewsets.ModelViewSet):
    queryset = JobType.objects.all()
    serializer_class = JobTypeSerializer
    permission_classes = [IsAuthenticated]

class ShiftViewSet(viewsets.ModelViewSet):
    queryset = Shift.objects.all()
    serializer_class = ShiftSerializer
    permission_classes = [IsAuthenticated]

class RecruiterTypeViewSet(viewsets.ModelViewSet):
    queryset = RecruiterType.objects.all()
    serializer_class = RecruiterTypeSerializer
    permission_classes = [IsAuthenticated]

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]

class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated]

class RecruiterCountryViewSet(viewsets.ModelViewSet):
    queryset = RecruiterCountry.objects.all()
    serializer_class = RecruiterCountrySerializer
    permission_classes = [IsAuthenticated]
