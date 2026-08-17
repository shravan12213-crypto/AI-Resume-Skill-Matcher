# System Architecture

## Core Architectural Principle
> **AI feeds structured information into the database; PostgreSQL remains the source of truth and performs the core data management and matching operations.**

## Conceptual Architecture
```text
                         WEB APPLICATION
                              |
                              v
                     +------------------+
                     |   REST Backend   |
                     | Node.js/Express  |
                     +--------+---------+
                              |
                 +------------+------------+
                 |                         |
                 v                         v
        +------------------+       +------------------+
        |    PostgreSQL    |       |    AI Module     |
        |                  |       |                  |
        | Candidates       |<------| Resume -> JSON   |
        | Resumes          |       |                  |
        | Skills           |       +------------------+
        | Jobs             |
        | Applications     |
        | Matches          |
        | Procedures       |
        | Triggers         |
        | Views            |
        +------------------+
```\n