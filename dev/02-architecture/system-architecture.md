# System Architecture

## Core Architectural Principle
> **AI feeds structured information into the database; PostgreSQL remains the source of truth and performs the core data management, candidate matching, scoring, and ordering operations.**

## Conceptual Architecture
```text
                    WEB APPLICATION (React/Vite)
                                 │
                                 ▼
                     NODE + EXPRESS REST API
                                 │
                    +------------+------------+
                    │                         │
                    ▼                         ▼
              POSTGRESQL                 OPENAI API
                    │                         │
                    │                  Resume → JSON
                    │                         │
                    +------------<------------+
                    │
                    +---- Relational Storage (Users, Jobs, Resumes, Skills)
                    │
                    +---- get_top_candidates(p_job_id) PL/pgSQL Function
                    │      ├── 70% Skill Score Calculation
                    │      └── 30% Experience Score Calculation
                    │
                    +---- apply_to_job(c_id, j_id) Transactional Procedure
                    │
                    +---- application_status_history Audit Trigger
                    │
                    ▼
           Ranked Candidate Table
```