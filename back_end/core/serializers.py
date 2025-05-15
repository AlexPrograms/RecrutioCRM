from rest_framework import serializers
from .models import *

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class CandidateDocumentSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = CandidateDocument
        fields = '__all__'

class CandidateTagSerializer(serializers.ModelSerializer):
    tag = TagSerializer(read_only=True)
    class Meta:
        model = CandidateTag
        fields = '__all__'

class CandidateSerializer(serializers.ModelSerializer):
    documents = CandidateDocumentSerializer(many=True, read_only=True)
    candidate_tags = CandidateTagSerializer(many=True, read_only=True)
    status = serializers.StringRelatedField()
    housing_status = serializers.StringRelatedField()
    recruiter = serializers.StringRelatedField()
    class Meta:
        model = Candidate
        fields = '__all__'

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    role = RoleSerializer(read_only=True)
    company = CompanySerializer(read_only=True)
    class Meta:
        model = User
        fields = '__all__'

class EmployeeDocumentSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = EmployeeDocument
        fields = '__all__'

class EmployeeSerializer(serializers.ModelSerializer):
    documents = EmployeeDocumentSerializer(many=True, read_only=True)
    candidate = CandidateSerializer(read_only=True)
    company = CompanySerializer(read_only=True)
    project = serializers.StringRelatedField()
    vacancy = serializers.StringRelatedField()
    class Meta:
        model = Employee
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    manager = serializers.StringRelatedField()
    company = CompanySerializer(read_only=True)
    class Meta:
        model = Project
        fields = '__all__'

class ShiftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shift
        fields = '__all__'

class JobTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobType
        fields = '__all__'

class VacancySerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)
    project = ProjectSerializer(read_only=True)
    shift = ShiftSerializer(read_only=True)
    job_type = JobTypeSerializer(read_only=True)
    recruiter = serializers.StringRelatedField()
    class Meta:
        model = Vacancy
        fields = '__all__'

class RecruiterTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecruiterType
        fields = '__all__'

class RecruiterCountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = RecruiterCountry
        fields = '__all__'

class RecruiterSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    company = CompanySerializer(read_only=True)
    type = RecruiterTypeSerializer(read_only=True)
    class Meta:
        model = Recruiter
        fields = '__all__'

class RecruiterPerformanceSerializer(serializers.ModelSerializer):
    recruiter = serializers.StringRelatedField()
    company = CompanySerializer(read_only=True)
    class Meta:
        model = RecruiterPerformance
        fields = '__all__'

class ApplicationStatusChangeSerializer(serializers.ModelSerializer):
    application = serializers.StringRelatedField()
    old_status = serializers.StringRelatedField()
    new_status = serializers.StringRelatedField()
    changed_by = serializers.StringRelatedField()
    class Meta:
        model = ApplicationStatusChange
        fields = '__all__'

class HousingStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = HousingStatus
        fields = '__all__'

class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = '__all__'

class CandidateApplicationSerializer(serializers.ModelSerializer):
    candidate = CandidateSerializer(read_only=True)
    vacancy = VacancySerializer(read_only=True)
    status = serializers.StringRelatedField()
    recruiter = serializers.StringRelatedField()
    class Meta:
        model = CandidateApplication
        fields = '__all__'
