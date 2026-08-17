# Matching Overview

The matching engine uses relational SQL logic paired with pgvector semantic similarity. It compares a job's required skills against a candidate's extracted skills, calculates experience levels, and evaluates semantic similarity of the resume text to the job description. The system calculates a final percentage combining all three scores.\n