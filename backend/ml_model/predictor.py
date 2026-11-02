import os
import joblib
import numpy as np

BRANCH_MAP = {
    "CSE": 0, "IT": 1, "ECE": 2, "EEE": 3, "ME": 4, "CIVIL": 5
}

COMPANY_BENCHMARKS = [
    {
        "name": "Infosys",
        "min_cgpa": 6.5,
        "max_backlogs": 1,
        "min_coding": 50,
        "base_ctc": 4.5,
        "required_skills": ["Python", "Java", "SQL", "HTML/CSS"]
    },
    {
        "name": "TCS (Digital / Ninja)",
        "min_cgpa": 6.0,
        "max_backlogs": 1,
        "min_coding": 55,
        "base_ctc": 7.0,
        "required_skills": ["C++", "Python", "DSA", "DBMS"]
    },
    {
        "name": "Accenture",
        "min_cgpa": 6.5,
        "max_backlogs": 0,
        "min_coding": 60,
        "base_ctc": 6.5,
        "required_skills": ["JavaScript", "React", "SQL", "Communication"]
    },
    {
        "name": "Wipro",
        "min_cgpa": 6.0,
        "max_backlogs": 2,
        "min_coding": 50,
        "base_ctc": 4.0,
        "required_skills": ["Java", "Python", "SQL"]
    },
    {
        "name": "Deloitte USI",
        "min_cgpa": 7.5,
        "max_backlogs": 0,
        "min_coding": 70,
        "base_ctc": 9.0,
        "required_skills": ["React.js", "Node.js", "Django", "SQL", "DSA"]
    },
    {
        "name": "Amazon",
        "min_cgpa": 8.0,
        "max_backlogs": 0,
        "min_coding": 85,
        "base_ctc": 22.0,
        "required_skills": ["Advanced DSA", "System Design", "C++", "Java", "AWS"]
    }
]

def predict_placement_readiness(student_data):
    """
    student_data dict keys:
      cgpa: float
      branch: str (e.g. "CSE")
      backlogs: int
      coding_score: int
      aptitude_score: int
      communication_score: int
      internships: int
      projects: int
      certifications: int
      skills: list of str
      resume_score: int (optional)
    """
    current_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(current_dir, "placement_model.joblib")

    cgpa = float(student_data.get("cgpa", 7.0))
    branch = str(student_data.get("branch", "CSE")).upper()
    branch_code = BRANCH_MAP.get(branch, 0)
    backlogs = int(student_data.get("backlogs", 0))
    coding_score = int(student_data.get("coding_score", 65))
    aptitude_score = int(student_data.get("aptitude_score", 65))
    communication_score = int(student_data.get("communication_score", 70))
    internships = int(student_data.get("internships", 1))
    projects = int(student_data.get("projects", 2))
    certifications = int(student_data.get("certifications", 1))
    skills = student_data.get("skills", [])
    if isinstance(skills, str):
        skills = [s.strip() for s in skills.split(",") if s.strip()]
    skills_count = len(skills)
    resume_score = int(student_data.get("resume_score", 75))

    # Feature vector for ML model
    features = np.array([[
        cgpa, branch_code, backlogs, coding_score, aptitude_score,
        communication_score, internships, projects, certifications, skills_count
    ]])

    # Try loading ML trained model
    probability_pct = 75
    expected_package = 6.5

    if os.path.exists(model_path):
        try:
            artifacts = joblib.load(model_path)
            clf = artifacts["classifier"]
            reg = artifacts["regressor"]
            scaler = artifacts["scaler"]

            scaled_features = scaler.transform(features)
            probs = clf.predict_proba(scaled_features)[0]
            probability_pct = int(np.round(probs[1] * 100))

            if probability_pct > 30:
                expected_package = float(np.round(reg.predict(scaled_features)[0], 2))
            else:
                expected_package = 3.2
        except Exception as e:
            print(f"Prediction model error, falling back to rule engine: {e}")

    # Fallback/Adjustment to ensure probability is reasonable
    if probability_pct < 10: probability_pct = 15
    if probability_pct > 98: probability_pct = 98

    # Calculate 5-part Student Readiness Meter Scores
    technical_readiness = int(np.round((coding_score * 0.5) + (cgpa * 5)))
    technical_readiness = min(max(technical_readiness, 40), 98)

    comm_readiness = min(max(communication_score, 45), 98)
    res_score = min(max(resume_score, 40), 98)
    interview_readiness = int(np.round((aptitude_score * 0.4) + (communication_score * 0.4) + (coding_score * 0.2)))
    interview_readiness = min(max(interview_readiness, 40), 98)

    overall_readiness = int(np.round(
        (probability_pct * 0.35) +
        (technical_readiness * 0.25) +
        (comm_readiness * 0.15) +
        (res_score * 0.10) +
        (interview_readiness * 0.15)
    ))

    # Company Recommendation Matching
    recommended_companies = []
    for comp in COMPANY_BENCHMARKS:
        is_eligible = (
            cgpa >= comp["min_cgpa"] and
            backlogs <= comp["max_backlogs"] and
            coding_score >= comp["min_coding"]
        )
        fit_status = "Eligible & Highly Recommended" if is_eligible else "Need Skill/CGPA Upgrade"
        match_percentage = min(int(np.round((cgpa / comp["min_cgpa"]) * 50 + (coding_score / comp["min_coding"]) * 50)), 98)

        recommended_companies.append({
            "company_name": comp["name"],
            "base_ctc": f"₹{comp['base_ctc']} LPA",
            "is_eligible": is_eligible,
            "match_percentage": match_percentage,
            "status": fit_status,
            "required_skills": comp["required_skills"]
        })

    # Skill Gap & Recommended Learning Pathways
    current_skills_lower = [s.lower() for s in skills]
    missing_skills = []
    recommended_courses = []

    if "react" not in current_skills_lower and "react.js" not in current_skills_lower:
        missing_skills.append("React.js Frontend Framework")
        recommended_courses.append({
            "course_title": "React.js Modern Web Development",
            "provider": "Placement Cell Recommended",
            "duration": "4 Weeks",
            "impact": "Boosts Frontend & Full-Stack Placement Eligibility"
        })

    if "sql" not in current_skills_lower and "mysql" not in current_skills_lower:
        missing_skills.append("SQL Database Architecture")
        recommended_courses.append({
            "course_title": "Mastering SQL & Relational Databases",
            "provider": "Placement Cell Recommended",
            "duration": "2 Weeks",
            "impact": "Essential for Accenture, Deloitte & Infosys Technical Rounds"
        })

    if "dsa" not in current_skills_lower and "data structures" not in current_skills_lower:
        missing_skills.append("Data Structures & Algorithms (DSA)")
        recommended_courses.append({
            "course_title": "DSA & Problem Solving in C++/Java/Python",
            "provider": "Coding Accelerator",
            "duration": "6 Weeks",
            "impact": "Unlocks High CTC Product Companies (Amazon, Deloitte)"
        })

    if coding_score < 70:
        missing_skills.append("Competitive Coding Speed")
        recommended_courses.append({
            "course_title": "Aptitude & Coding Speed Drills",
            "provider": "Placement Training Cell",
            "duration": "3 Weeks",
            "impact": "Pass Round 1 Online Assessment easily"
        })

    return {
        "placement_probability": probability_pct,
        "expected_package_lpa": expected_package,
        "readiness_level": "High Placement Potential" if probability_pct >= 75 else ("Moderate Readiness" if probability_pct >= 50 else "Action Required"),
        "readiness_meter": {
            "overall": overall_readiness,
            "technical": technical_readiness,
            "communication": comm_readiness,
            "resume": res_score,
            "interview": interview_readiness
        },
        "current_skills": skills,
        "missing_skills": missing_skills,
        "recommended_courses": recommended_courses,
        "recommended_companies": recommended_companies
    }
