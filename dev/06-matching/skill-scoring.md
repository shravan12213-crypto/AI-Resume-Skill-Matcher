# Skill Scoring

The initial skill scoring formula calculates the percentage of required skills the candidate possesses.

```text
Skill Score = (Number of matched required skills / Total number of required skills) × 100
```

**Example:**
- Job requires: Python, SQL, React, Node.js, Docker (5 skills)
- Candidate has: Python, SQL, React, Node.js, Git (4 matched required skills)

`Skill Score = (4 / 5) × 100 = 80%`

The system must also display explainable output:
```text
Matched:
✓ Python
✓ SQL
✓ React
✓ Node.js

Missing:
✗ Docker
```\n