from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LoginView, QuickDemoLoginView, RegisterView, CurrentUserView,
    PredictPlacementView, ParseResumeView, StudentProfileViewSet,
    CompanyProfileViewSet, PlacementDriveViewSet, ApplicationViewSet,
    InterviewViewSet, AnalyticsOverviewView, ExportPDFReportView,
    ExportExcelReportView, AnnouncementViewSet, NotificationViewSet,
    AuditLogViewSet
)

router = DefaultRouter()
router.register(r'students', StudentProfileViewSet, basename='students')
router.register(r'companies', CompanyProfileViewSet, basename='companies')
router.register(r'drives', PlacementDriveViewSet, basename='drives')
router.register(r'applications', ApplicationViewSet, basename='applications')
router.register(r'interviews', InterviewViewSet, basename='interviews')
router.register(r'announcements', AnnouncementViewSet, basename='announcements')
router.register(r'notifications', NotificationViewSet, basename='notifications')
router.register(r'audit-logs', AuditLogViewSet, basename='audit-logs')

urlpatterns = [
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/quick-demo/', QuickDemoLoginView.as_view(), name='quick-demo-login'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/me/', CurrentUserView.as_view(), name='current-user'),
    path('ml/predict/', PredictPlacementView.as_view(), name='ml-predict'),
    path('resume/parse/', ParseResumeView.as_view(), name='resume-parse'),
    path('analytics/overview/', AnalyticsOverviewView.as_view(), name='analytics-overview'),
    path('reports/pdf/', ExportPDFReportView.as_view(), name='export-pdf'),
    path('reports/excel/', ExportExcelReportView.as_view(), name='export-excel'),
    path('', include(router.urls)),
]
