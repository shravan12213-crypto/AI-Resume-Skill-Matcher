# AI-Powered Smart Resume Repository with Skill Matching

> **This directory is the single source of truth (SSOT) for the project.**
> 
> Whenever a significant architectural or database decision changes:
> 1. Update the relevant document.
> 2. Add an entry to the decision/change log.
> 3. Do not leave conflicting information in different documents.
> 4. Do not silently change the architecture.
> 5. If implementation differs from documentation, update the documentation.

## 1. Project Overview
This is primarily a **DBMS Course Project**. The database and DBMS concepts are the hero of the project. The system is a database-driven resume repository and recruitment platform enhanced with AI-based resume information extraction and SQL-based candidate skill matching.

## 2. Why It Exists
To demonstrate deep knowledge of relational databases, SQL, and advanced DBMS concepts (normalization, views, procedures, triggers, transactions, and indexing) in a practical, real-world scenario. The system must NOT become an AI/ML project that happens to use a database.

## 3. DBMS First
The hierarchy is:
1. Database Design
2. Relational Data
3. SQL
4. Advanced DBMS
5. SQL Skill Matching
6. pgvector Semantic Matching
7. AI Resume Extraction
8. Application

## 4. Final Technology Stack
- **Frontend:** React, Vite, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL + pgvector
- **AI:** OpenAI API
- **Others:** Git, Postman, Zod

## 5. Database-First Architecture
**AI feeds structured information into the database; PostgreSQL remains the source of truth and performs the core data management and matching operations.**

## 6. Table Structure
The initial database contains ~13 tables:
1. `users`
2. `candidates`
3. `recruiters`
4. `resumes`
5. `resume_extracted_data`
6. `resume_embeddings`
7. `skills`
8. `candidate_skills`
9. `jobs`
10. `job_skills`
11. `applications`
12. `matches`
13. `application_status_history`

**Key Strategy:** Integer primary keys (identity/serial) for main entities, and composite primary keys for bridge/associative tables (`candidate_skills`, `job_skills`). UUIDs are strictly NOT used.

## 7. AI Scope
AI performs text extraction on resumes to generate structured JSON (skills, education, etc.) which is then inserted into PostgreSQL. It is an input-processing component, not the main decision-maker. Embeddings are generated and stored in PostgreSQL using pgvector.

## 8. Matching Approach
Matching is SQL-based, deterministic, and includes semantic pgvector comparison. It uses a locked weighted formula:
`Final Score = (Skill Score × 0.50) + (Semantic Score × 0.30) + (Experience Score × 0.20)`

## 9. Team Responsibilities
- **Rajas (approx. 55%):** Database Architecture, SQL Optimization, Candidate/Resume Module, AI extraction.
- **Shravan (approx. 45%):** Advanced DBMS Operations, Recruiter/Jobs Module, SQL Matching algorithms.

## 10. Development Phases
1. Planning / Database Design (Currently in Phase 1)
2. Database Design (ER Diagram + Relational Schema)
3. PostgreSQL Implementation
4. Core Application
5. DBMS Features
6. SQL Matching
7. AI Integration
8. Integration & Polish\n