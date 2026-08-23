# Skill Scoring

The skill scoring formula calculates the percentage of a job's required skills that a candidate possesses.

## Mathematical Formula

$$\text{Skill Score} = \left(\frac{\text{Number of Matched Required Skills}}{\text{Total Number of Required Skills}}\right) \times 100$$

## Edge Cases
- **Job has 0 required skills**: Handled safely to avoid division-by-zero, returning `100.00%` (or `0.00%` based on business rules).
- **Candidate has 0 skills**: Returns `0.00%`.
- **Candidate has extra skills**: Only matching skills that are marked `is_required = TRUE` for the specific job are counted toward the required ratio.

## Concrete Example

**Job Requirements:**
- Python
- SQL
- React
- Node.js
- Docker
*(Total Required Skills = 5)*

**Candidate Profile:**
- Python
- SQL
- React
- Node.js
- Git

**Calculation:**
- Matched required skills = 4
- Total required skills = 5

$$\text{Skill Score} = \left(\frac{4}{5}\right) \times 100 = 80.00\%$$

## Explainable Breakdown
The system provides a clear breakdown of matched versus missing skills:
```text
Matched:
✓ Python
✓ SQL
✓ React
✓ Node.js

Missing:
✗ Docker
```