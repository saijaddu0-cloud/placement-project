import os
import numpy as np
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

BRANCH_MAP = {
    "CSE": 0,
    "IT": 1,
    "ECE": 2,
    "EEE": 3,
    "ME": 4,
    "CIVIL": 5
}

def generate_synthetic_dataset(num_records=1200):
    np.random.seed(42)

    cgpa = np.random.uniform(5.5, 9.8, num_records)
    branches = np.random.choice(list(BRANCH_MAP.keys()), num_records, p=[0.35, 0.20, 0.20, 0.10, 0.10, 0.05])
    branch_codes = np.array([BRANCH_MAP[b] for b in branches])
    backlogs = np.random.choice([0, 1, 2, 3, 4], num_records, p=[0.70, 0.15, 0.08, 0.05, 0.02])
    coding_score = np.random.randint(45, 100, num_records)
    aptitude_score = np.random.randint(45, 100, num_records)
    communication_score = np.random.randint(40, 100, num_records)
    internships = np.random.choice([0, 1, 2, 3], num_records, p=[0.40, 0.35, 0.20, 0.05])
    projects = np.random.choice([1, 2, 3, 4, 5], num_records, p=[0.20, 0.40, 0.25, 0.10, 0.05])
    certifications = np.random.choice([0, 1, 2, 3, 4], num_records, p=[0.30, 0.40, 0.20, 0.07, 0.03])
    skills_count = np.random.randint(2, 12, num_records)

    # Compute a score for logical label assignment
    score = (
        (cgpa * 12) +
        (coding_score * 0.35) +
        (aptitude_score * 0.25) +
        (communication_score * 0.20) +
        (internships * 8) +
        (projects * 5) +
        (certifications * 4) +
        (skills_count * 2) -
        (backlogs * 15) -
        (branch_codes * 2)
    )

    # Threshold for placement probability
    prob = 1 / (1 + np.exp(-(score - 105) / 12))
    placement_status = (prob > 0.45).astype(int)

    # Generate salary package (LPA) for placed candidates
    base_package = 3.5 + (cgpa - 5.5) * 1.8 + (coding_score / 10) * 1.2 + (internships * 1.5) + (projects * 0.8)
    # Add branch premium for CS/IT
    branch_premium = np.where(np.isin(branches, ["CSE", "IT"]), np.random.uniform(1.0, 4.5, num_records), 0.0)
    package_lpa = np.round(np.where(placement_status == 1, base_package + branch_premium, 0.0), 2)

    df = pd.DataFrame({
        "cgpa": np.round(cgpa, 2),
        "branch": branches,
        "branch_code": branch_codes,
        "backlogs": backlogs,
        "coding_score": coding_score,
        "aptitude_score": aptitude_score,
        "communication_score": communication_score,
        "internships": internships,
        "projects": projects,
        "certifications": certifications,
        "skills_count": skills_count,
        "placement_status": placement_status,
        "package_lpa": package_lpa
    })

    return df

def train_and_save_model():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(current_dir, "placement_dataset.csv")
    model_path = os.path.join(current_dir, "placement_model.joblib")

    print("Generating 1,200 synthetic student placement records...")
    df = generate_synthetic_dataset()
    df.to_csv(dataset_path, index=False)
    print(f"Dataset saved to {dataset_path}")

    feature_cols = [
        "cgpa", "branch_code", "backlogs", "coding_score",
        "aptitude_score", "communication_score", "internships",
        "projects", "certifications", "skills_count"
    ]

    X = df[feature_cols]
    y_class = df["placement_status"]

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Classifier for Placement Status
    clf = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    clf.fit(X_scaled, y_class)

    # Regressor for Package LPA (placed students only)
    placed_df = df[df["placement_status"] == 1]
    X_placed = scaler.transform(placed_df[feature_cols])
    y_reg = placed_df["package_lpa"]

    reg = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
    reg.fit(X_placed, y_reg)

    model_artifacts = {
        "classifier": clf,
        "regressor": reg,
        "scaler": scaler,
        "feature_cols": feature_cols,
        "branch_map": BRANCH_MAP
    }

    joblib.dump(model_artifacts, model_path)
    print(f"Machine Learning model successfully saved to {model_path}")

if __name__ == "__main__":
    train_and_save_model()
