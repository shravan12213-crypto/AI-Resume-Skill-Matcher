# Experience Scoring

The experience component uses a capped score based on required years. It is an initial deterministic scoring rule that can be refined later.

```text
If candidate experience >= required experience:
    Experience Score = 100

If candidate experience < required experience:
    Experience Score = (candidate experience / required experience) × 100
```
Result is always capped between 0 and 100.
If `required experience = 0`, the experience score should be 100%.

**Examples:**
- Required = 3 years, Candidate = 3 years -> Experience Score = 100%
- Required = 4 years, Candidate = 2 years -> Experience Score = 50%
- Required = 2 years, Candidate = 5 years -> Experience Score = 100%\n