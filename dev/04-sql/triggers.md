# Triggers

The final plan contains 1-2 meaningful triggers.

## Trigger 1: Application Status History
**When:** An application's status changes (e.g., Applied -> Shortlisted).
**Action:** Automatically insert a record into `application_status_history` containing `history_id`, `application_id`, `old_status`, `new_status`, `changed_at`.

## Trigger 2: Updated Timestamp
**When:** A relevant record is modified.
**Action:** Automatically update the `updated_at` field. (Demonstrates a legitimate automatic database action).\n