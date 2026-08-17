# Relationships

```text
                         USER
                       /      \
                      /        \
                     v          v
               CANDIDATE     RECRUITER
                  |              |
                  |              |
                  v              v
               RESUME           JOB
                  |              |
                  |              |
                  |          JOB_SKILLS
                  |              |
                  v              v
           CANDIDATE_SKILLS --> SKILLS


CANDIDATE ---- APPLICATION ---- JOB

CANDIDATE ------ MATCH -------- JOB

APPLICATION ---- STATUS_HISTORY
```\n