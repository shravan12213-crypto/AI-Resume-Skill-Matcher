# Experience Scoring

The experience component uses a deterministic capped ratio based on the job's required experience versus the candidate's experience.

## Scoring Formula

```text
If candidate experience >= required experience:
    Experience Score = 100

Otherwise:
    Experience Score = (candidate experience / required experience) × 100
```

- Result is strictly capped between `0` and `100`.
- If `required experience = 0`, the experience score is assigned `100%`.

## Examples

| Required Exp | Candidate Exp | Calculation | Experience Score |
| :--- | :--- | :--- | :--- |
| 3.0 yrs | 3.0 yrs | $\ge$ Required | **100%** |
| 4.0 yrs | 2.0 yrs | $(2.0 / 4.0) \times 100$ | **50%** |
| 2.0 yrs | 5.0 yrs | $\ge$ Required (capped) | **100%** |
| 0.0 yrs | 0.0 yrs | No requirement | **100%** |
| 3.0 yrs | 0.0 yrs | $(0.0 / 3.0) \times 100$ | **0%** |