// ─────────────────────────────────────────────────────────────────────────────
// Central question registry — shared by ExamPrep.jsx and QuickQuiz.jsx
// To add a new day: import its exports below and add an entry to ALL_DAYS.
// ─────────────────────────────────────────────────────────────────────────────

import { DAY_META as D01_META, QUESTIONS as D01_Q } from './ExamDay01.js';
import { DAY_META as D02_META, QUESTIONS as D02_Q } from './ExamDay02.js';
import { DAY_META as D03_META, QUESTIONS as D03_Q } from './ExamDay03.js';
import { DAY_META as D04_META, QUESTIONS as D04_Q } from './ExamDay04.js';
import { DAY_META as D05_META, QUESTIONS as D05_Q } from './ExamDay05.js';
import { DAY_META as D06_META, QUESTIONS as D06_Q } from './ExamDay06.js';
import { DAY_META as D07_META, QUESTIONS as D07_Q } from './ExamDay07.js';
import { DAY_META as D08_META, QUESTIONS as D08_Q } from './ExamDay08.js';
import { DAY_META as D09_META, QUESTIONS as D09_Q } from './ExamDay09.js';
import { DAY_META as D10_META, QUESTIONS as D10_Q } from './ExamDay10.js';
import { DAY_META as D11_META, QUESTIONS as D11_Q } from './ExamDay11.js';

export const ALL_DAYS = [
  { meta: D01_META, questions: D01_Q },
  { meta: D02_META, questions: D02_Q },
  { meta: D03_META, questions: D03_Q },
  { meta: D04_META, questions: D04_Q },
  { meta: D05_META, questions: D05_Q },
  { meta: D06_META, questions: D06_Q },
  { meta: D07_META, questions: D07_Q },
  { meta: D08_META, questions: D08_Q },
  { meta: D09_META, questions: D09_Q },
  { meta: D10_META, questions: D10_Q },
  { meta: D11_META, questions: D11_Q },
];

export const ALL_QUESTIONS = ALL_DAYS.flatMap(d => d.questions);
