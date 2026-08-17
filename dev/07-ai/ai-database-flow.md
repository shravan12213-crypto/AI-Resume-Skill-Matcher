# AI to Database Flow

1. User uploads resume.
2. System extracts text.
3. System sends text to OpenAI requesting JSON.
4. System parses JSON.
5. System maps JSON skills to the master `skills` table (inserting new ones if necessary).
6. System inserts records into `candidate_skills`.\n