# Matching Overview

The matching engine uses relational SQL logic paired with pgvector semantic similarity. It compares a job's required skills against a candidate's extracted skills, calculates experience levels, and evaluates semantic similarity of the resume text to the job description. The system calculates a final percentage combining all three scores.\n## Matching Architecture

`	ext
Candidate Resume
       |
       v
Resume Embedding
       |
       +------------------+
                          |
                          v
                    Semantic Score
                          ^
                          |
Job Description           |
       |                  |
       v                  |
Job Embedding ------------+
`

Alongside:
- Candidate Skills → Skill Score
- Candidate Experience → Experience Score

Final Score = 
    (Skill Score × 0.50)
  + (Semantic Score × 0.30)
  + (Experience Score × 0.20)
