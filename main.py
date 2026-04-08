import pickle
import re
from pathlib import Path

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sklearn.metrics.pairwise import cosine_similarity


BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "ML-Model"
MODEL_PATH = MODEL_DIR / "model.pkl"
VECTORIZER_PATH = MODEL_DIR / "tfidf_vectorizer.pkl"
SKILLS_PATH = MODEL_DIR / "skills.txt"


def load_pickle_file(file_path: Path):
    with open(file_path, "rb") as file:
        return pickle.load(file)


def load_skills(file_path: Path) -> list[str]:
    if not file_path.exists():
        return []

    with open(file_path, "r", encoding="utf-8") as file:
        skills = [line.strip().lower() for line in file if line.strip()]
    return sorted(set(skills))


def preprocess_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def extract_keywords(text: str) -> set[str]:
    stopwords = {
        "a", "an", "and", "are", "as", "at", "be", "by", "for", "from",
        "in", "is", "it", "of", "on", "or", "that", "the", "to", "with",
        "will", "can", "this", "than", "using", "use", "used", "have",
        "has", "had", "was", "were", "you", "your", "our", "their",
        "looking", "seeking", "candidate", "candidates", "experience",
        "years", "year", "work", "role", "job", "resume",
    }
    words = preprocess_text(text).split()
    return {word for word in words if len(word) > 2 and word not in stopwords}


def calculate_keyword_score(resume_text: str, job_text: str) -> float:
    resume_keywords = extract_keywords(resume_text)
    job_keywords = extract_keywords(job_text)

    if not resume_keywords or not job_keywords:
        return 0.0

    matched_keywords = resume_keywords.intersection(job_keywords)
    coverage = len(matched_keywords) / len(job_keywords)
    return coverage * 100


def extract_skills(text: str) -> list[str]:
    lower_text = text.lower()
    detected_skills = []

    for skill in skills_list:
        if skill in lower_text:
            detected_skills.append(skill)

    return sorted(set(detected_skills))


def validate_resume_job_input(payload: "MatchRequest") -> tuple[str, str]:
    resume_text = payload.resume.strip()
    job_text = payload.job.strip()

    if not resume_text or not job_text:
        raise HTTPException(
            status_code=400,
            detail="Both resume and job fields are required.",
        )

    return resume_text, job_text


def calculate_match_score(resume_text: str, job_text: str) -> float:
    clean_resume = preprocess_text(resume_text)
    clean_job = preprocess_text(job_text)

    resume_vector = vectorizer.transform([clean_resume])
    job_vector = vectorizer.transform([clean_job])
    tfidf_score = float(cosine_similarity(resume_vector, job_vector)[0][0] * 100)
    keyword_score = calculate_keyword_score(clean_resume, clean_job)

    return round((tfidf_score * 0.7) + (keyword_score * 0.3), 2)


def get_skill_analysis(resume_text: str, job_text: str) -> tuple[list[str], list[str], list[str], float]:
    if not skills_list:
        raise HTTPException(
            status_code=500,
            detail="Skills file is missing or empty. Add skills to ML-Model/skills.txt.",
        )

    resume_skills = extract_skills(resume_text)
    job_skills = extract_skills(job_text)
    missing_skills = sorted(set(job_skills) - set(resume_skills))

    if not job_skills:
        skill_match = 0.0
    else:
        matched_count = len(set(job_skills).intersection(resume_skills))
        skill_match = round((matched_count / len(job_skills)) * 100, 2)

    return resume_skills, job_skills, missing_skills, skill_match


def build_suggestions(match_score: float, missing_skills: list[str]) -> list[str]:
    suggestions = []

    if match_score < 60:
        suggestions.append("Improve resume relevance")

    if missing_skills:
        suggestions.append(f"Add missing skills: {', '.join(missing_skills)}")

    return suggestions


app = FastAPI()
model = load_pickle_file(MODEL_PATH)
vectorizer = load_pickle_file(VECTORIZER_PATH)
skills_list = load_skills(SKILLS_PATH)


class MatchRequest(BaseModel):
    resume: str
    job: str


@app.get("/")
def read_root():
    return {"message": "ML API is running 🚀"}


@app.post("/match-score")
def get_match_score(payload: MatchRequest):
    resume_text, job_text = validate_resume_job_input(payload)
    match_score = calculate_match_score(resume_text, job_text)

    return {"match_score": match_score}


@app.post("/missing-skills")
def get_missing_skills(payload: MatchRequest):
    resume_text, job_text = validate_resume_job_input(payload)
    resume_skills, job_skills, missing_skills, _ = get_skill_analysis(resume_text, job_text)

    return {
        "resume_skills": resume_skills,
        "job_skills": job_skills,
        "missing_skills": missing_skills,
    }


@app.post("/analyze-resume")
def analyze_resume(payload: MatchRequest):
    resume_text, job_text = validate_resume_job_input(payload)

    match_score = calculate_match_score(resume_text, job_text)
    _, _, missing_skills, skill_match = get_skill_analysis(resume_text, job_text)
    final_score = round((0.7 * match_score) + (0.3 * skill_match), 2)
    suggestions = build_suggestions(match_score, missing_skills)

    return {
        "final_score": final_score,
        "match_score": match_score,
        "skill_match": skill_match,
        "missing_skills": missing_skills,
        "suggestions": suggestions,
    }
