---
name: snowflake-study-app
description: >-
  Guides development of the SnowPro Core COF-C03 interactive study app.
  Use when building, editing, or extending any domain module in the Snowflake
  Study_app project — adding tabs, content sections, quiz challenges, or new
  domain files.
---

# Snowflake Study App — Development Guide

## Project Location & Structure

```
Study_app/
├── App.jsx                        ← Landing page + domain router
├── main.jsx                       ← React entry point
├── index.css
├── SnowProCoreStudyGuideC03.pdf   ← Official exam study guide (primary reference)
└── domains/
    ├── Domain1_guide.txt          ← Official objectives for D1 (read before coding)
    ├── Domain2_guide.txt          ← Add when starting each domain
    ├── ...
    ├── Domain1_Architecture.jsx   ← 31% — REFERENCE PATTERN for all domains
    ├── Domain2_Governance.jsx     ← 20%
    ├── Domain3_DataLoading.jsx    ← 18%
    ├── Domain4_Performance.jsx    ← 21%
    └── Domain5_Collaboration.jsx  ← 10%
```

**Tech stack:** React + Tailwind CSS + lucide-react icons. No other dependencies.

### Domain guide txt files

Each `DomainN_guide.txt` lists the exact objectives and sub-bullets from the official study guide for that domain. **Always read it before building or extending a domain.** Use it to:
- Map tabs 1-to-1 with numbered objectives (1.1, 1.2, etc.) — use `{ label: '☁️ 1.1 Architecture' }` format
- Decide where "extra" topics (e.g. Horizon Catalog, Editions) fit best within the guide's structure
- Verify full coverage before marking a tab complete

---

## Core Design Rule: Learn vs. Test Separation

Every domain file follows a strict two-zone pattern:

| Zone | Tabs | Purpose |
|------|------|---------|
| **Learning** | All content tabs | Pure reference — text, visuals, expand/collapse. No scoring, no pressure. |
| **Testing** | `🧪 Quiz` tab only | All interactive challenges live here. Scored, resetable. |

**Never mix** quizzes or scored interactions into learning tabs.

---

## File Architecture Per Domain

Each `DomainN_*.jsx` contains:

1. **Shared helpers** at top — `ExamTip`, `SectionHeader`, `InfoCard`
2. **`TABS` array** — defines tab bar; last entry is always `{ id: 'quiz', label: '🧪 Quiz', accent: true }`
3. **Root component** (`DomainN_*`) — renders tab nav + routes to tab components
4. **One component per learning tab** — pure content, no state beyond expand/collapse
5. **`QuizTab` component** — sub-nav of challenges + routes to each
6. **One challenge component per learning tab** — interactive, scored, resetable
7. **`QUIZ_SECTIONS` array** — drives the quiz sub-nav buttons

### Tab nav styling

```jsx
// Active learning tab → blue
'border-blue-600 text-blue-700 bg-blue-50/50'

// Active quiz tab → violet (accent: true)
'border-violet-600 text-violet-700 bg-violet-50/60'
```

### Quiz sub-nav pattern

```jsx
const QUIZ_SECTIONS = [
  { id: 'challenge1', label: 'Challenge Name', emoji: '☁️', desc: 'One-line description' },
  // one entry per learning tab
];
```

---

## Learning Tab Conventions

### `InfoCard` wrapper
All content blocks sit inside `<InfoCard>`. White card, rounded-xl, shadow-sm, border-slate-100.

### `SectionHeader`
Top of each tab — icon, title, subtitle. Use the domain's accent color as `color` prop.

### Expandable sections
Use a local `useState(null)` index. One item open at a time. `ChevronRight` rotates 90° when open.

### `ExamTip` block
Always at the bottom of every learning tab. Yellow left-border strip. 3–4 exam-critical bullet points.

### Content depth per tab
- One clear concept per card
- Bullet lists over paragraphs
- Comparison tables for "A vs B" concepts
- Code snippets for SQL-heavy topics (see below)

### Code Snippet Convention

SQL syntax is a **heavy exam component** — include code snippets in learning tabs whenever the topic has testable DDL/DML patterns.

Use the shared `<CodeBlock>` helper (defined once at the top of the file, above all data constants):

```jsx
const CodeBlock = ({ code }) => (
  <pre className="bg-slate-900 text-emerald-300 text-xs rounded-xl p-4 overflow-x-auto leading-relaxed font-mono mt-2">
    <code>{code}</code>
  </pre>
);
```

Usage in learning tabs:
```jsx
<CodeBlock code={`CREATE TABLE orders (
  id   NUMBER,
  date DATE
) CLUSTER BY (date);`} />
```

#### When to add code snippets
| Topic | Include snippet? |
|-------|-----------------|
| Table CREATE/ALTER DDL | ✅ Always |
| Clustering key syntax | ✅ Always |
| Virtual warehouse sizing/scaling | ✅ Always |
| System functions (SYSTEM$CLUSTERING_INFORMATION, etc.) | ✅ Always |
| COPY INTO, Snowpipe config | ✅ Always |
| Simple conceptual descriptions (no specific syntax) | ❌ Skip |

#### Code snippet rules
- Keep snippets short (10–20 lines max) — conceptual, not production-complete
- Include a `-- comment` on the key line to anchor the exam concept
- One snippet per table type / view type in expandable detail sections
- Store code inline in the data array: `{ id: 'x', code: \`...\`, ... }` — not in separate consts
- Always use template literals (backtick strings) to allow multi-line without concatenation

---

## Quiz Challenge Conventions

### Challenge types used so far

| Type | When to use |
|------|-------------|
| **Layer/category sorter** | "Which X does Y belong to?" — click item then click bucket |
| **Pillar sort game** | Drag-style: click card → click zone to place; click chip to remove |
| **Scenario picker** | One scenario at a time; grid of options; instant feedback + explanation; progress bar; results screen with full review |
| **Standard MCQ** | Multiple questions visible at once; select answer; reveal all at end with score |

### Every challenge must have:
- `reset()` function + Reset button (top-right, `RefreshCw` icon)
- Score displayed after reveal/completion
- Per-item explanation text shown after reveal
- Violet color scheme (not blue — blue = learning, violet = quiz)

### Scoring feedback emoji convention
```
score >= 90%  →  🎉
score >= 70%  →  👍
score <  70%  →  📚
```

### Reveal colors
```
Correct   →  emerald-50 bg, emerald-400 border, emerald-800 text
Incorrect →  red-50 bg, red-300 border, red-700 text (+ line-through on wrong pick)
Dimmed    →  opacity-30/40 for unchosen options after reveal
```

---

## Data Conventions

Keep all quiz data as top-level `const` arrays outside components (so they don't re-create on render):

```js
const LAYER_QUIZ_DATA = [
  { text: 'Question text', answer: 'answerId', hint: 'Explanation shown after reveal.' },
];
```

For sorter games:
```js
const CARDS_DATA = [
  { id: 'c1', text: 'Capability description', pillar: 'pillarId', hint: 'Why it belongs there.' },
];
```

---

## Domain Color Palette

| Domain | Accent | Tab active | Quiz accent |
|--------|--------|------------|-------------|
| D1 Architecture | blue-600 | border-blue-600 | violet-600 |
| D2 Governance | violet-700 | border-violet-600 | violet-600 |
| D3 Data Loading | teal-700 | border-teal-600 | violet-600 |
| D4 Performance | amber-600 | border-amber-600 | violet-600 |
| D5 Collaboration | rose-700 | border-rose-600 | violet-600 |

Quiz tab is **always violet** regardless of domain color.

---

## Adding a New Tab to an Existing Domain

1. Add entry to `TABS` array (before the quiz entry).
2. Add `{activeTab === 'newid' && <NewTab />}` to the root render.
3. Add `{!['...existing...','newid'].includes(activeTab) && <ComingSoon ... />}` guard.
4. Create `const NewTab = () => (...)` — learning content only.
5. Add entry to `QUIZ_SECTIONS`.
6. Add `{active === 'newchallenge' && <NewChallenge />}` inside `QuizTab`.
7. Create `const NewChallenge = () => (...)` — interactive, violet scheme.

---

## Content Sources (COF-C03)

Official exam domains and weightings:
- D1 Architecture & Features — **31%**
- D2 Account Mgmt & Governance — **20%**
- D3 Data Loading & Connectivity — **18%**
- D4 Performance & Transformation — **21%**
- D5 Data Collaboration — **10%**

### Reference priority order

1. **`domains/DomainN_guide.txt`** — read first. Exact objectives from the official study guide. Tabs must cover everything listed here.
2. **`SnowProCoreStudyGuideC03.pdf`** — for context, weightings, and sample questions.
3. **[Snowflake Docs](https://docs.snowflake.com)** — fetch live for accurate technical detail when building a tab.
4. Exam is **conceptual** — but SQL syntax is heavily tested. Focus on "what is it / when to use it / how does it differ from X" AND include CREATE/ALTER/system-function snippets for DDL-heavy topics.

---

## What NOT to Do

- Do not put quiz interactions (scoring, reveal, correct/wrong states) inside learning tabs
- Do not use `useState` for simple static lists — map over const arrays
- Do not add comments explaining what the code does — only non-obvious intent
- Do not create new files for sub-components — keep everything in the domain file
- Do not use `drag` HTML events — simulate drag with click-to-select + click-to-place
