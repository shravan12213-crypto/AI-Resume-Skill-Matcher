# Page Structure

The recruiter frontend is a React + Vite + TypeScript Single Page Application with dynamic views:

## 1. Top Navigation Bar (`Navbar.tsx`)
- App branding (`SkillMatch Pro Recruiter`).
- Navigation tabs: `Dashboard`, `Job Postings`, `Applications`, `Matching & Ranking`.
- Quick action CTA: `Post New Job` modal trigger.
- Recruiter switcher: toggle between personas (e.g. `Diana @ TechCorp` and `Evan @ InnovateLLC`).
- PostgreSQL real-time connection badge.

## 2. Dashboard View (`DashboardView.tsx`)
- Welcome header with recruiter company branding.
- 4 Key metric cards: Active Jobs, Total Applicants, Shortlisted Candidates, Average Match Score.
- Job cards with applicant summary pills and quick action links.

## 3. Applicant Tracking View (`ApplicationsView.tsx`)
- Job selector dropdown.
- Status filter tabs (`all`, `applied`, `shortlisted`, `hired`, `rejected`).
- Candidate cards with instant status transition buttons (`Shortlist`, `Hire`, `Reject`).
- **Audit Trail Trigger Button**: Opens `StatusHistoryModal` to inspect database trigger audit entries.
- **Match Score Chip**: Opens `ExplainMatchModal` to inspect 50/30/20 breakdown.

## 4. Candidate Ranking Leaderboard (`RankingView.tsx`)
- Job-specific ranked candidate leaderboard (`#1`, `#2`, `#3` podium badges).
- Progress meters for **50% Skill**, **30% Semantic pgvector**, **20% Experience**, and **Final Score**.
- **Explain Breakdown** button for deep audit.

## 5. Modals
- **`CreateJobModal.tsx`**: Job title, location, experience required, description, and multi-skill selector with mandatory/optional tags.
- **`ExplainMatchModal.tsx`**: Full mathematical formula breakdown, matched skills ($\checkmark$), missing required skills ($\times$), and point contributions.
- **`StatusHistoryModal.tsx`**: Historical audit timeline powered by `application_status_history`.