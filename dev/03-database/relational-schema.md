# Relational Schema

(To be populated during Phase 2)

Example definition structure using Integer primary keys and composite keys:
- `users(user_id INTEGER PK, name, email, password, role, created_at)`
- `candidates(candidate_id INTEGER PK, user_id INTEGER FK, phone, location, summary)`
- `recruiters(recruiter_id INTEGER PK, user_id INTEGER FK, company_name, designation)`
- `resumes(resume_id INTEGER PK, candidate_id INTEGER FK, file_name, file_url, raw_text, uploaded_at, updated_at)`
- `resume_extracted_data(extraction_id INTEGER PK, resume_id INTEGER FK UNIQUE, education JSONB, experience JSONB, projects JSONB, certifications JSONB, extracted_at)`
- `resume_embeddings(embedding_id INTEGER PK, resume_id INTEGER FK UNIQUE, embedding VECTOR(1536), created_at)`
- `job_embeddings(embedding_id INTEGER PK, job_id INTEGER FK UNIQUE, embedding VECTOR(1536), created_at)`
- `skills(skill_id INTEGER PK, skill_name, category)`
- `jobs(job_id INTEGER PK, recruiter_id INTEGER FK, title, description, location, experience_required, status, created_at)`
- `candidate_skills(candidate_id INTEGER FK, skill_id INTEGER FK, proficiency, years_experience) [PK: candidate_id, skill_id]`
- `job_skills(job_id INTEGER FK, skill_id INTEGER FK, is_required, minimum_experience) [PK: job_id, skill_id]`
- `applications(application_id INTEGER PK, candidate_id INTEGER FK, job_id INTEGER FK, applied_at, status)`
- `matches(match_id INTEGER PK, candidate_id INTEGER FK, job_id INTEGER FK, skill_score, semantic_score, experience_score, final_score, matched_at)`
- `application_status_history(history_id INTEGER PK, application_id INTEGER FK, old_status, new_status, changed_at)`\n