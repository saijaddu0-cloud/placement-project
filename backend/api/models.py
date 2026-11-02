from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('OFFICER', 'Placement Officer'),
        ('COMPANY', 'Company Recruiter'),
        ('STUDENT', 'Student'),
    )
    role = models.CharField(max_length=15, choices=ROLE_CHOICES, default='STUDENT')
    phone = models.CharField(max_length=20, blank=True, null=True)
    is_approved = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.email or self.username} ({self.role})"


class StudentProfile(models.Model):
    VERIFICATION_CHOICES = (
        ('PENDING', 'Pending Verification'),
        ('VERIFIED', 'Verified'),
        ('REJECTED', 'Rejected'),
    )
    BRANCH_CHOICES = (
        ('CSE', 'Computer Science & Engineering'),
        ('IT', 'Information Technology'),
        ('ECE', 'Electronics & Communication'),
        ('EEE', 'Electrical & Electronics'),
        ('ME', 'Mechanical Engineering'),
        ('CIVIL', 'Civil Engineering'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    roll_no = models.CharField(max_length=50, unique=True)
    department = models.CharField(max_length=100, default='Engineering')
    branch = models.CharField(max_length=20, choices=BRANCH_CHOICES, default='CSE')
    section = models.CharField(max_length=10, default='A')
    year = models.IntegerField(default=4)

    cgpa = models.FloatField(default=0.0)
    tenth_pct = models.FloatField(default=0.0)
    twelfth_pct = models.FloatField(default=0.0)
    diploma_pct = models.FloatField(default=0.0)
    backlogs = models.IntegerField(default=0)

    skills = models.TextField(blank=True, help_text="Comma-separated skills")
    certifications = models.TextField(blank=True, help_text="Certifications listed")
    projects = models.TextField(blank=True, help_text="Project summaries")
    internships = models.TextField(blank=True, help_text="Internship experience")

    github_profile = models.URLField(blank=True, null=True)
    linkedin_profile = models.URLField(blank=True, null=True)

    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    profile_image = models.ImageField(upload_to='profiles/', blank=True, null=True)

    verification_status = models.CharField(max_length=20, choices=VERIFICATION_CHOICES, default='PENDING')

    # Assessment & Readiness Scores
    aptitude_score = models.IntegerField(default=65)
    coding_score = models.IntegerField(default=70)
    communication_score = models.IntegerField(default=75)
    ats_resume_score = models.IntegerField(default=75)

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} ({self.roll_no})"


class CompanyProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='company_profile')
    company_name = models.CharField(max_length=150)
    website = models.URLField(blank=True, null=True)
    industry = models.CharField(max_length=100, default='Information Technology')
    hr_name = models.CharField(max_length=100, blank=True)
    hr_email = models.EmailField(blank=True)
    logo = models.ImageField(upload_to='logos/', blank=True, null=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.company_name


class PlacementOfficerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='officer_profile')
    name = models.CharField(max_length=100)
    department = models.CharField(max_length=100, default='Training & Placement Cell')
    phone = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return self.name


class PlacementDrive(models.Model):
    STATUS_CHOICES = (
        ('DRAFT', 'Draft'),
        ('ACTIVE', 'Active / Accepting Applications'),
        ('CLOSED', 'Closed'),
        ('COMPLETED', 'Completed'),
    )
    JOB_TYPE_CHOICES = (
        ('FULLTIME', 'Full Time'),
        ('INTERNSHIP', 'Internship'),
        ('PPO', 'Pre-Placement Offer (PPO)'),
    )

    company = models.ForeignKey(CompanyProfile, on_delete=models.CASCADE, related_name='drives')
    title = models.CharField(max_length=200)
    job_role = models.CharField(max_length=150)
    description = models.TextField()
    ctc_lpa = models.FloatField(help_text="Salary package in LPA")
    job_type = models.CharField(max_length=20, choices=JOB_TYPE_CHOICES, default='FULLTIME')
    location = models.CharField(max_length=150, default='PAN India / Hybrid')
    deadline = models.DateTimeField()

    # Eligibility Criteria
    min_cgpa = models.FloatField(default=6.0)
    eligible_branches = models.TextField(default='CSE,IT,ECE,EEE,ME,CIVIL', help_text="Comma-separated branch codes")
    max_backlogs = models.IntegerField(default=0)
    required_skills = models.TextField(blank=True, help_text="Comma-separated required skills")

    rounds = models.TextField(default="Round 1: Online Assessment, Round 2: Technical Interview, Round 3: HR Interview")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.company.company_name}"


class Application(models.Model):
    STATUS_CHOICES = (
        ('APPLIED', 'Applied'),
        ('SHORTLISTED', 'Shortlisted'),
        ('INTERVIEWING', 'Interview Scheduled'),
        ('SELECTED', 'Selected / Offered'),
        ('REJECTED', 'Rejected'),
    )

    drive = models.ForeignKey(PlacementDrive, on_delete=models.CASCADE, related_name='applications')
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='APPLIED')
    current_round = models.CharField(max_length=100, default='Round 1: Online Assessment')
    applied_at = models.DateTimeField(auto_now_add=True)
    remarks = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('drive', 'student')

    def __str__(self):
        return f"{self.student.user.username} -> {self.drive.title} ({self.status})"


class Interview(models.Model):
    application = models.ForeignKey(Application, on_delete=models.CASCADE, related_name='interviews')
    round_name = models.CharField(max_length=100)
    scheduled_time = models.DateTimeField()
    venue_or_link = models.CharField(max_length=255, help_text="Location venue or Google Meet/Zoom link")
    instructions = models.TextField(blank=True)
    status = models.CharField(max_length=20, default='SCHEDULED')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Interview: {self.application.student.user.username} for {self.round_name}"


class Announcement(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    target_role = models.CharField(max_length=20, default='ALL')
    sender_name = models.CharField(max_length=100, default='Placement Cell')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=150)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification to {self.user.username}: {self.title}"


class AuditLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=150)
    details = models.TextField()
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.created_at.strftime('%Y-%m-%d %H:%M')}] {self.action}"
