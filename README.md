# 🚀 AI-Powered Placement Management System with Machine Learning

A modern, production-ready, full-stack **Placement Management System** designed for educational institutions to automate the entire campus recruitment cycle. Powered by **React.js, Tailwind CSS, Django REST Framework, Python, and Scikit-Learn Machine Learning**.

---

## 🌟 Key Highlights & AI Features

1. **Machine Learning Placement & Company Recommendation Engine**:
   - Trained on 1,200+ historical student placement records (`CGPA`, `Branch`, `Backlogs`, `Coding Score`, `Aptitude Score`, `Communication Score`, `Internships`, `Projects`, `Certifications`).
   - Generates **Placement Probability (%)**, **Expected Salary Package (LPA)**, and **Interview Readiness Score**.
   - Recommends eligible top companies (Infosys, TCS, Accenture, Wipro, Deloitte, Amazon) with skill-gap match scoring.
   - Generates **Skill Gap Analysis** and **Recommended Learning Pathways** (DSA, React.js, SQL, System Design).

2. **AI Resume Parser & ATS Resume Analyzer**:
   - Extracts text from uploaded PDF resumes using PyPDF2 / pdfplumber.
   - Parses contact info, email, phone number, and technical skills automatically.
   - Calculates **ATS Match Score (0-100%)**.
   - Provides **Resume Strengths**, **Grammar & Formatting Feedback**, and auto-syncs skills to the student profile.

3. **5-Part Student Readiness Meter**:
   - Interactive Radar breakdown across **Technical Readiness**, **Communication Skills**, **Resume ATS Score**, **Interview Readiness**, and **Overall Placement Readiness**.

4. **Institutional Analytics & Export Center**:
   - Real-time placement metrics: **Highest Package**, **Lowest Package**, **Average Package**, **Branch-Wise Placement %**, and **Monthly Hiring Trends**.
   - Formal PDF report exports generated via **ReportLab**.
   - Multi-sheet Excel spreadsheet exports generated via **OpenPyXL**.

5. **1-Click Quick Demo Role Switcher**:
   - Instant 1-click pre-filled login buttons for all 4 roles (`Admin`, `Placement Officer`, `Company Recruiter`, `Student`) for rapid evaluation without manual registration.

---

## 🛠️ Technology Stack

- **Frontend**: React.js 18, Vite, Tailwind CSS, Lucide React icons, Chart.js, React Router DOM v6, Axios.
- **Backend**: Python 3.13, Django 5, Django REST Framework (DRF), SimpleJWT authentication.
- **Machine Learning**: Scikit-Learn (`RandomForestClassifier` + `RandomForestRegressor`), Pandas, NumPy, Joblib model persistence.
- **Database**: SQLite default (zero-config instant execution) with configurable MySQL support.
- **Document Processing**: PyPDF2, ReportLab, OpenPyXL.

---

## 👥 User Roles & Quick Demo Accounts

| Role | Username | Password | Capabilities |
| --- | --- | --- | --- |
| **System Admin** | `admin` | `admin123` | Institutional overview, user approvals, audit logs, PDF/Excel exports. |
| **Placement Officer (TPO)** | `officer` | `officer123` | Student profile verification queue, interview scheduling, drive monitoring. |
| **Company Recruiter** | `infosys_hr` | `company123` | Post placement drives, review applicants, shortlist candidates, declare selections. |
| **Student** | `student` | `student123` | Upload resume, view drive eligibility, apply with 1-click, test ML predictor. |

---

## 💻 Installation & Local Setup

### 1. Backend Setup (Django + ML Model)

```bash
cd backend

# Install Python requirements
python -m pip install -r requirements.txt

# Train Machine Learning Model (Generates placement_dataset.csv & placement_model.joblib)
python ml_model/train_model.py

# Apply Database Migrations & Seed Demo Accounts
python manage.py makemigrations api
python manage.py migrate
python manage.py seed_data

# Start Django Backend Server
python manage.py runserver 8000
```

Backend API will run at `http://127.0.0.1:8000/api/`

---

### 2. Frontend Setup (React + Vite + Tailwind)

```bash
cd frontend

# Install Node modules
npm install

# Start Vite Development Server
npm run dev
```

Frontend application will open automatically at `http://localhost:3000`

---

## 📡 Key REST API Endpoints

- `POST /api/auth/login/` - JWT user authentication
- `POST /api/auth/quick-demo/` - 1-Click quick demo login
- `POST /api/ml/predict/` - ML placement prediction & readiness engine
- `POST /api/resume/parse/` - AI PDF resume extraction & ATS scoring
- `GET /api/drives/` - List placement drives with search & branch filter
- `POST /api/applications/` - Submit 1-click drive application
- `POST /api/interviews/` - Schedule candidate interview round
- `GET /api/analytics/overview/` - Institutional dashboard analytics
- `GET /api/reports/pdf/` - Download ReportLab PDF summary
- `GET /api/reports/excel/` - Download OpenPyXL `.xlsx` dataset

---

## 🌐 Production Deployment Guide

- **Frontend**: Deploy `frontend/` on **Vercel** (`npm run build`, output dir: `dist`).
- **Backend**: Deploy `backend/` on **Render** (Gunicorn WSGI server, Python 3.13 environment).
- **Database**: Connect Render backend to **MySQL / Supabase** by providing `DB_TYPE=mysql`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`.
- **Media Files**: Connect **Cloudinary** / AWS S3 for uploaded PDF resumes and profile avatars.
"# placement-project" 
