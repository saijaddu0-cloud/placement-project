from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from api.models import (
    StudentProfile, CompanyProfile, PlacementOfficerProfile,
    PlacementDrive, Application, Announcement, Notification, AuditLog
)

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds database with realistic demo accounts, companies, drives, and student records.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Starting Database Auto-Seeding..."))

        # 1. Create Admin Account
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@university.edu',
                'first_name': 'System',
                'last_name': 'Admin',
                'role': 'ADMIN',
                'is_staff': True,
                'is_superuser': True,
                'is_approved': True
            }
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write("Created Admin Account: admin / admin123")

        # 2. Create Placement Officer (TPO) Account
        officer_user, created = User.objects.get_or_create(
            username='officer',
            defaults={
                'email': 'tpo@university.edu',
                'first_name': 'Dr. Rajesh',
                'last_name': 'Sharma',
                'role': 'OFFICER',
                'is_approved': True
            }
        )
        if created:
            officer_user.set_password('officer123')
            officer_user.save()
            PlacementOfficerProfile.objects.create(
                user=officer_user,
                name='Dr. Rajesh Sharma',
                department='Central Placement Cell',
                phone='+91 98765 43210'
            )
            self.stdout.write("Created Officer Account: officer / officer123")

        # 3. Create Recruiter Company Accounts
        comp1_user, c1_created = User.objects.get_or_create(
            username='infosys_hr',
            defaults={
                'email': 'recruitment@infosys.com',
                'first_name': 'Priya',
                'last_name': 'Nair',
                'role': 'COMPANY',
                'is_approved': True
            }
        )
        if c1_created:
            comp1_user.set_password('company123')
            comp1_user.save()
            comp1_prof = CompanyProfile.objects.create(
                user=comp1_user,
                company_name='Infosys Limited',
                website='https://www.infosys.com',
                industry='IT Services & Consulting',
                hr_name='Priya Nair',
                hr_email='recruitment@infosys.com',
                description='Global leader in next-generation digital services and consulting.'
            )
            self.stdout.write("Created Company Account: infosys_hr / company123")
        else:
            comp1_prof = comp1_user.company_profile

        comp2_user, c2_created = User.objects.get_or_create(
            username='deloitte_hr',
            defaults={
                'email': 'careers@deloitte.com',
                'first_name': 'Arjun',
                'last_name': 'Mehta',
                'role': 'COMPANY',
                'is_approved': True
            }
        )
        if c2_created:
            comp2_user.set_password('company123')
            comp2_user.save()
            comp2_prof = CompanyProfile.objects.create(
                user=comp2_user,
                company_name='Deloitte USI',
                website='https://www2.deloitte.com',
                industry='Audit, Consulting & Financial Advisory',
                hr_name='Arjun Mehta',
                hr_email='careers@deloitte.com',
                description='Deloitte drives impact through industry-leading audit, consulting, tax and advisory services.'
            )
            self.stdout.write("Created Company Account: deloitte_hr / company123")
        else:
            comp2_prof = comp2_user.company_profile

        # 4. Create Student Account
        student_user, s_created = User.objects.get_or_create(
            username='student',
            defaults={
                'email': 'sai.kumar@student.edu',
                'first_name': 'Sai',
                'last_name': 'Kumar',
                'role': 'STUDENT',
                'is_approved': True
            }
        )
        if s_created:
            student_user.set_password('student123')
            student_user.save()
            student_profile = StudentProfile.objects.create(
                user=student_user,
                roll_no='21CS101',
                department='Computer Science & Engineering',
                branch='CSE',
                section='A',
                year=4,
                cgpa=8.8,
                tenth_pct=92.5,
                twelfth_pct=89.0,
                backlogs=0,
                skills='Python, React, JavaScript, SQL, Django, DSA, Git',
                certifications='AWS Certified Cloud Practitioner, Meta Front-End Specialization',
                projects='AI Placement Portal, E-Commerce Microservices, Real-Time Chat App',
                internships='Software Developer Intern at TechCorp (3 Months)',
                verification_status='VERIFIED',
                coding_score=85,
                aptitude_score=80,
                communication_score=82,
                ats_resume_score=88
            )
            self.stdout.write("Created Student Account: student / student123")
        else:
            student_profile = student_user.student_profile

        # 5. Create Placement Drives
        drive1, d1_created = PlacementDrive.objects.get_or_create(
            company=comp1_prof,
            title='Systems Engineer Specialist 2026',
            defaults={
                'job_role': 'Systems Engineer Specialist',
                'description': 'Hiring 2026 graduating batch engineers for core digital development and cloud operations.',
                'ctc_lpa': 9.5,
                'job_type': 'FULLTIME',
                'location': 'Bangalore / Hyderabad / Pune',
                'deadline': timezone.now() + timedelta(days=20),
                'min_cgpa': 7.0,
                'eligible_branches': 'CSE,IT,ECE',
                'max_backlogs': 0,
                'required_skills': 'Python, Java, SQL, DSA',
                'status': 'ACTIVE'
            }
        )

        drive2, d2_created = PlacementDrive.objects.get_or_create(
            company=comp2_prof,
            title='Analyst - Technology Consulting 2026',
            defaults={
                'job_role': 'Technology Analyst',
                'description': 'Full time analyst position in Technology & Digital Consulting practice.',
                'ctc_lpa': 12.0,
                'job_type': 'FULLTIME',
                'location': 'Hyderabad / Gurgaon / Mumbai',
                'deadline': timezone.now() + timedelta(days=15),
                'min_cgpa': 7.5,
                'eligible_branches': 'CSE,IT,ECE,EEE',
                'max_backlogs': 0,
                'required_skills': 'React, Python, SQL, Communication, System Design',
                'status': 'ACTIVE'
            }
        )

        # 6. Create Application
        Application.objects.get_or_create(
            drive=drive1,
            student=student_profile,
            defaults={
                'status': 'SHORTLISTED',
                'current_round': 'Round 2: Technical Interview',
                'remarks': 'Cleared Online Assessment with 92% score.'
            }
        )

        # 7. Create System Announcements
        Announcement.objects.get_or_create(
            title='Campus Placement Season 2026 Kickoff',
            defaults={
                'content': 'Welcome to Campus Placement Season 2026! Over 45+ Tier-1 companies will visit. Ensure your profiles and resumes are updated.',
                'target_role': 'ALL'
            }
        )

        self.stdout.write(self.style.SUCCESS("Database Seeding Completed Successfully!"))
