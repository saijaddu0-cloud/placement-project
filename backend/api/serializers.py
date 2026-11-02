from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    StudentProfile, CompanyProfile, PlacementOfficerProfile,
    PlacementDrive, Application, Interview, Announcement,
    Notification, AuditLog
)

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone', 'is_approved', 'created_at')
        extra_kwargs = {'password': {'write_only': True}}


class StudentProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = StudentProfile
        fields = '__all__'

    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username


class CompanyProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = CompanyProfile
        fields = '__all__'


class PlacementOfficerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = PlacementOfficerProfile
        fields = '__all__'


class PlacementDriveSerializer(serializers.ModelSerializer):
    company = CompanyProfileSerializer(read_only=True)
    company_id = serializers.IntegerField(write_only=True, required=False)
    applicant_count = serializers.SerializerMethodField()

    class Meta:
        model = PlacementDrive
        fields = '__all__'

    def get_applicant_count(self, obj):
        return obj.applications.count()


class ApplicationSerializer(serializers.ModelSerializer):
    drive = PlacementDriveSerializer(read_only=True)
    student = StudentProfileSerializer(read_only=True)

    class Meta:
        model = Application
        fields = '__all__'


class InterviewSerializer(serializers.ModelSerializer):
    application = ApplicationSerializer(read_only=True)

    class Meta:
        model = Interview
        fields = '__all__'


class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = '__all__'


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'


class AuditLogSerializer(serializers.ModelSerializer):
    user_email = serializers.SerializerMethodField()

    class Meta:
        model = AuditLog
        fields = '__all__'

    def get_user_email(self, obj):
        return obj.user.email if obj.user else 'System'
