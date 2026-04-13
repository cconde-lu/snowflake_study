---
name: cof-c03-daily-exam-generator
description: Instructions for generating daily COF-C03 practice exams as Streamlit apps. Use when the user asks to create a new practice exam, daily quiz, or question set. Enforces quality standards, validation requirements, and deployment workflow.
---

# COF-C03 Daily Exam Generator — Instructions

## Prerequisites
Before generating ANY exam, you MUST load the companion skill:
- `SKILL_cof_c03_exam_profile.md` — contains domain weights, question archetypes, trap patterns, and answer design rules.

## Step 1: Plan the Question Set

### 1.1 Determine Size and Distribution
Default daily exam: **40 questions** (matches realistic exam pacing for a ~45 min session).

Use this distribution (proportional to exam guide weights):

| Domain                          | Questions | Notes                                |
|---------------------------------|-----------|--------------------------------------|
| Architecture & Features         | 10-12     | Heaviest domain. Include streams, tasks, stages, editions. |
| Account Access & Security       | 8-10      | Roles, policies, encryption, network. |
| Performance Concepts            | 4-6       | Clustering, scaling, caching, query profile. |
| Data Loading & Unloading        | 4-6       | COPY, Snowpipe, stages, file formats. |
| Data Transformations            | 4-6       | VARIANT, FLATTEN, UDFs, stored procs. |
| Data Protection & Sharing       | 4-6       | Time Travel, Fail-safe, shares, replication. |

### 1.2 Question Type Mix
- 70-75% single-select (4 options A-D)
- 25-30% multi-select "Select TWO" (5 options A-E)
- Include at least 2-3 "Select TWO" questions per domain where applicable.

### 1.3 Difficulty Calibration
Target difficulty: **Hard** (a prepared student should score 65-80%).

Apply these difficulty levers:
- **Trap patterns** from the exam profile (misleading names, scope confusion, similar values).
- **Near-correct distractors** — options that are true statements but don't answer THIS question.
- **Scenario framing** — don't just ask "what is X?" — set up a situation and ask what happens.
- **Subtle keyword distinctions** — "specifically designed for" vs "can also do".

### 1.4 Topic Freshness
CRITICAL: Do not repeat questions from existing exams. Before writing:
1. Review the existing exam apps (V1, V2, V3) for topics already covered.
2. Prioritize topics from the exam profile's "High-Frequency Topics" list that are NOT yet covered.
3. Rotate focus: if previous exams emphasized cloning and caching, emphasize streams/tasks and data loading this time.

## Step 2: Write Questions

### 2.1 Question Writing Checklist
For EVERY question, verify:
- [ ] Question stem is clear, unambiguous, and sets context.
- [ ] All options are similar in length (+/- 30% character count).
- [ ] Correct answer is NOT always in position B or C — randomize.
- [ ] Correct answer is NOT the longest option.
- [ ] Every distractor is plausible (uses real Snowflake terms).
- [ ] Multi-select questions specify exact count: "(Select TWO)".
- [ ] Multi-select questions have 5 options.
- [ ] Explanation cites the specific Snowflake behavior or doc reference.

### 2.2 Answer Validation Requirement
MANDATORY: Before finalizing, validate the trickiest answers:
1. **SQL-testable answers** — run live SQL against Snowflake to confirm.
   Examples: cloning behavior, function existence, syntax validity, Time Travel retention inheritance.
2. **Doc-based answers** — search `snowflake_product_docs` for authoritative confirmation.
   Examples: edition requirements, role privileges, default parameter values.
3. **At minimum**, validate 10-15 of the 40 questions via SQL or docs — prioritizing any question where two options seem equally correct.

### 2.3 Trap Insertion
Include at least **8-10 trap questions** per exam. Use the validated trap patterns from the exam profile:
- 2-3 misleading name traps (Reader Account, ECONOMY scaling, AUTO_SUSPEND=0)
- 2-3 scope confusion traps (resource monitors, network policies, row access policies)
- 2-3 similar-value traps (64 vs 14 days, Standard vs Enterprise limits)
- 1-2 syntax traps (VARIANT notation, function names that sound real but don't exist)

## Step 3: Build the Streamlit App

### 3.1 App Structure
Use the proven Streamlit template from Exam V3:

```python
import streamlit as st
import random

QUESTIONS = [
    {
        "id": 1,
        "domain": "Architecture & Features",
        "multi": False,    # True for multi-select
        "text": "Question text here?",
        "options": {
            "A": "Option A text",
            "B": "Option B text",
            "C": "Option C text",
            "D": "Option D text",
        },
        "answer": ["B"],   # List of correct option keys
        "explanation": "Why B is correct and others are not.",
    },
    # ... more questions
]
```

### 3.2 App Features (all included in template)
- Landing page with domain breakdown and shuffle toggle
- Sidebar question navigator with flagging support
- Single-select (radio buttons) and multi-select (checkboxes)
- Progress bar and unanswered count
- Submit → Results page with score, pass/fail (75%), domain breakdown
- Review mode: All / Incorrect Only / Flagged Only
- Color-coded answers with explanations
- Retake button

### 3.3 Known SiS Compatibility Fix
CRITICAL: For `st.radio()`, always use `index=0` as default, NOT `index=None`.
SiS runtime does not support `None` for radio index.

```python
prev_idx = 0  # NOT None
if prev:
    prev_key = list(prev)[0]
    if prev_key in option_keys:
        prev_idx = option_keys.index(prev_key)
```

## Step 4: Deploy to Snowflake

### 4.1 Naming Convention
```
File:      cof_c03_quiz_app_YYYY_MM_DD.py
Stage:     LEVY_HQ_DB.STREAMLIT_APPS.COF_C03_<DATE>_STAGE
Streamlit: LEVY_HQ_DB.STREAMLIT_APPS.COF_C03_DAILY_<DATE>
Title:     "COF-C03 Daily Exam — <DATE>"
```

### 4.2 Deployment Commands
```sql
-- 1. Create stage
CREATE OR REPLACE STAGE LEVY_HQ_DB.STREAMLIT_APPS.COF_C03_<DATE>_STAGE
  DIRECTORY = (ENABLE = TRUE);

-- 2. Copy file from workspace
COPY FILES INTO @LEVY_HQ_DB.STREAMLIT_APPS.COF_C03_<DATE>_STAGE
  FROM 'snow://workspace/USER$.PUBLIC.DEFAULT$/versions/live'
  FILES=('cof_c03_quiz_app_YYYY_MM_DD.py');

-- 3. Create Streamlit app
CREATE OR REPLACE STREAMLIT LEVY_HQ_DB.STREAMLIT_APPS.COF_C03_DAILY_<DATE>
  ROOT_LOCATION = '@LEVY_HQ_DB.STREAMLIT_APPS.COF_C03_<DATE>_STAGE'
  MAIN_FILE = 'cof_c03_quiz_app_YYYY_MM_DD.py'
  QUERY_WAREHOUSE = 'LEVY_DEV_WH'
  TITLE = 'COF-C03 Daily Exam — <DATE>'
  COMMENT = 'Daily practice exam, 40 questions, doc-validated';
```

### 4.3 Role Requirement
Use `ACCOUNTADMIN` for deployment (CREATE STREAMLIT requires it or equivalent privileges).

## Step 5: Post-Deployment Checklist

- [ ] Open the app in Streamlit Apps and click through 2-3 questions to verify no runtime errors.
- [ ] Verify multi-select questions show checkboxes, not radios.
- [ ] Verify the results page renders correctly after submitting.
- [ ] Confirm the explanation text displays for each question in review mode.

## Quality Signals

A well-calibrated daily exam should produce these results for a prepared student:
- **First attempt score**: 65-80% (passing is 75%)
- **Most missed domains**: Account Access & Security, Data Loading edge cases
- **Trap success rate**: 40-60% (traps should catch prepared students ~half the time)
- **Zero questions** where the student says "two answers both seem correct and I can't tell which" — this indicates a poorly written question, not difficulty.
