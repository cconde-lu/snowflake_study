---
name: cof-c03-exam-profile
description: Reference profile for the SnowPro Core COF-C03 certification exam. Use when generating, reviewing, or validating COF-C03 practice questions. Contains exam structure, domain weights, question archetypes, difficulty calibration, answer design rules, and validated trap patterns.
---

# SnowPro Core COF-C03 — Exam Characteristics Profile

## 1. Exam Structure

| Property              | Value                                  |
|-----------------------|----------------------------------------|
| Total questions       | 100                                    |
| Scored questions      | ~80 (the rest are unscored pilot)      |
| Time limit            | 115 minutes                            |
| Passing score         | 750 / 1000 (~75%)                      |
| Question formats      | Single-select, multi-select            |
| Multi-select ratio    | ~25-30% of questions say "Select TWO"  |
| "Select THREE"        | Rare but possible                      |
| Negative scoring      | None                                   |

## 2. Domain Weights (COF-C03 Exam Guide)

| #  | Domain                                           | Weight   | ~Questions |
|----|--------------------------------------------------|----------|------------|
| 1  | Snowflake AI Data Cloud Features & Architecture  | 25-30%   | 25-30      |
| 2  | Account Access & Security                        | 20-25%   | 20-25      |
| 3  | Performance Concepts                             | 10-15%   | 10-15      |
| 4  | Data Loading & Unloading                         | 10-15%   | 10-15      |
| 5  | Data Transformations                             | 10-15%   | 10-15      |
| 6  | Data Protection & Data Sharing                   | 10-15%   | 10-15      |

For a 40-question daily exam, use this proportional distribution:
- Architecture & Features: 10-12 questions
- Account Access & Security: 8-10 questions
- Performance Concepts: 4-6 questions
- Data Loading & Unloading: 4-6 questions
- Data Transformations: 4-6 questions
- Data Protection & Sharing: 4-6 questions

## 3. Question Archetypes (from Exam 3 analysis)

### 3.1 Recall Questions (~30%)
Straightforward knowledge checks. One correct answer is clearly factual.
```
Example: "What is the default behavior for the ON_ERROR parameter
          when bulk loading using COPY INTO <table>?"
Answer:   ABORT_STATEMENT
Pattern:  Tests whether the student memorized a specific default or limit.
```

### 3.2 Scenario-Based Questions (~40%)
Set up a realistic situation, then ask what happens or what to do.
```
Example: "A Snowflake account administrator has set resource monitors.
          RM1 (Quota: 5000) is account-level. RM2 (Quota: 1000) is
          assigned to Warehouse 2. What is the MAXIMUM limit?"
Answer:   1000
Pattern:  Requires understanding how two features interact.
```

### 3.3 "Best Choice" / Discrimination Questions (~20%)
Multiple options are partially true; the student must pick the MOST correct.
```
Example: "Which command can be executed from a reader account?"
         Options include plausible-sounding commands that are actually blocked.
Pattern:  Requires precise knowledge of boundaries and limitations.
```

### 3.4 Syntax / Command Questions (~10%)
Test exact SQL syntax, function names, or parameter names.
```
Example: "Which command assigns a key for key-pair authentication?"
         ALTER USER jsmith SET RSA_PUBLIC_KEY='...'
Pattern:  Distractors use plausible-but-wrong parameter names.
```

## 4. Answer Design Rules

### 4.1 Length Balance
CRITICAL: All answer options within a question MUST be similar in length.
- Never make the correct answer significantly longer than distractors.
- Never make the correct answer significantly shorter.
- Aim for all options within +/- 30% character count of each other.

### 4.2 Distractor Quality
Every wrong answer must be plausible to someone who studied partially:
- Use real Snowflake terms in wrong answers (e.g., "SYSTEM$ABORT_STATEMENT" sounds real but doesn't exist).
- Use features that exist but don't apply (e.g., "clustering keys" when asked about SOS).
- Use correct facts about the wrong scope (e.g., "7-day Fail-safe" applied to transient tables).

### 4.3 Multi-Select Rules
- Always specify the exact count: "(Select TWO)" or "(Select THREE)".
- Include 5 options for Select-TWO questions.
- Distractors must be independently plausible — never include an obviously absurd option.

### 4.4 Avoid Giveaways
- Never use absolute words ("always", "never", "only") exclusively in wrong answers.
- Don't make the correct answer the longest option.
- Don't always put correct answers in position B or C — randomize position.
- Don't use "All of the above" or "None of the above".

## 5. Validated Trap Patterns

These are recurring patterns from the real exam that trick prepared students.
Each trap was validated against Snowflake documentation or live SQL.

### 5.1 Misleading Names
| Concept            | Trap                                              | Truth                                                         |
|--------------------|---------------------------------------------------|---------------------------------------------------------------|
| Reader Account     | "Reader" implies read-only, no compute            | Can create warehouses, databases, tables. Provider pays.      |
| USERADMIN          | Sounds like it just manages users                 | Also creates roles and grants roles to users.                 |
| Fail-safe          | Sounds like a backup you can restore from         | Only Snowflake Support can attempt recovery, best-effort.     |
| AUTO_SUSPEND = 0   | Sounds like "suspend immediately"                 | Means NEVER auto-suspend.                                     |
| ECONOMY scaling    | Sounds cost-efficient for queuing                 | Actually worsens queuing — waits 6 min before adding clusters.|

### 5.2 Scope Confusion
| Concept                        | Trap                                      | Truth                                                    |
|--------------------------------|-------------------------------------------|----------------------------------------------------------|
| Resource monitors              | "Track all credits"                       | Only track user-managed warehouse credits, not serverless.|
| Network policies (user vs acct)| "Policies merge/are additive"             | User-level policy OVERRIDES account-level entirely.       |
| Row access policy              | "ACCOUNTADMIN bypasses policies"          | No role bypasses row access policies, not even ACCOUNTADMIN.|
| CURRENT_ROLE()                 | "Returns all granted roles"               | Returns only the active PRIMARY role.                     |
| Time Travel inheritance        | "Table inherits from database"            | Inherits from NEAREST parent with explicit setting.       |

### 5.3 Similar-but-Different Values
| Pair                                    | Trap                                    |
|-----------------------------------------|-----------------------------------------|
| COPY metadata: 64 days vs Snowpipe: 14  | Students confuse the two retention periods.|
| Transient TT: 0-1 day vs Permanent: 0-90 | Students assume Enterprise = 90 for all. |
| Standard Edition: 1 day TT vs Enterprise: 90 | "Maximum" depends on edition.        |
| ON_ERROR default: ABORT_STATEMENT (bulk) vs SKIP_FILE (Snowpipe) | Different defaults. |

### 5.4 Cloning Gotchas (Validated via Live SQL)
| Object                | Cloneable? | Notes                                              |
|-----------------------|------------|----------------------------------------------------|
| Tables (permanent)    | Yes        |                                                    |
| Transient tables      | Yes        | Clone is ALSO transient. Must use CREATE TRANSIENT TABLE...CLONE. |
| Schemas               | Yes        |                                                    |
| Databases             | Yes        | Clones all contents (schemas, tables, views).      |
| External named stages | Yes        | Only metadata (URL pointer) is cloned.             |
| Internal named stages | NO         | Returns "Unsupported feature" error.               |
| External tables       | NO         | Returns "Cannot clone from an external table". Also excluded from DB clones. |
| Dynamic tables        | NO         |                                                    |
| Shares                | NO         |                                                    |
| Pipes                 | NO         |                                                    |

### 5.5 VARIANT Notation (Validated via Live SQL)
| Syntax                          | Works? | Notes                          |
|---------------------------------|--------|--------------------------------|
| data:LEVEL1.LEVEL2              | Yes    | Colon first, then dots.        |
| data:LEVEL1:LEVEL2              | Yes    | All colons also works.         |
| data['LEVEL1']['LEVEL2']        | Yes    | Bracket notation.              |
| data.LEVEL1.LEVEL2              | NO     | All-dots fails with syntax error. |

## 6. High-Frequency Topics

Based on analysis of Exam 3 and community feedback, these topics appear disproportionately:

1. **Stages** — types (user @~, table @%, named @stage), cloning rules, LIST/LS
2. **Data loading** — ON_ERROR options, COPY metadata retention, FORCE, VALIDATION_MODE
3. **Warehouse billing** — per-second with 60-sec minimum, credit-per-hour by size
4. **Role hierarchy** — USERADMIN vs SECURITYADMIN vs SYSADMIN, secondary roles
5. **Masking & row access policies** — CURRENT_ROLE() vs IS_ROLE_IN_SESSION(), no bypass
6. **Editions** — Standard vs Enterprise vs Business Critical feature gates
7. **Transient vs temporary vs permanent** — Time Travel limits, Fail-safe presence
8. **Clustering** — SYSTEM$CLUSTERING_INFORMATION, average_depth, average_overlap
9. **Streams & tasks** — offset advancement, WHEN conditions, serverless tasks
10. **Sharing** — Direct Share region limits, Reader Account capabilities, Listings vs Shares
