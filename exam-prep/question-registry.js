// ─────────────────────────────────────────────────────────────────────────────
// Central question registry — shared by ExamPrep.jsx and QuickQuiz.jsx
// To add a new day: import its exports below and add an entry to ALL_DAYS.
// ─────────────────────────────────────────────────────────────────────────────

import { DAY_META as D01_META, QUESTIONS as D01_Q } from './ExamDay01.js';
import { DAY_META as D02_META, QUESTIONS as D02_Q } from './ExamDay02.js';
import { DAY_META as D03_META, QUESTIONS as D03_Q } from './ExamDay03.js';
import { DAY_META as D04_META, QUESTIONS as D04_Q } from './ExamDay04.js';
// DAY 5: import { DAY_META as D05_META, QUESTIONS as D05_Q } from './ExamDay05.js';

export const ALL_DAYS = [
  { meta: D01_META, questions: D01_Q },
  { meta: D02_META, questions: D02_Q },
  { meta: D03_META, questions: D03_Q },
  { meta: D04_META, questions: D04_Q },
  // { meta: D05_META, questions: D05_Q },
];

export const ALL_QUESTIONS = ALL_DAYS.flatMap(d => d.questions);
