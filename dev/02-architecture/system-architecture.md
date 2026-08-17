# System Architecture

## Core Architectural Principle
> **AI feeds structured information into the database; PostgreSQL remains the source of truth and performs the core data management and matching operations.**

## Conceptual Architecture
```text
                    WEB APPLICATION
                          |
                          v
                  NODE + EXPRESS
                          |
             +------------+------------+
             |                         |
             v                         v
       POSTGRESQL                 OPENAI API
             |                         |
             |                  Resume → JSON
             |                         |
             +------------<------------+
             |
             +---- Relational Data
             |
             +---- SQL Skill Matching
             |
             +---- Experience Matching
             |
             +---- pgvector Embeddings
             |
             +---- Semantic Matching
             |
             v
        Final Candidate Score
```\n