import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { DATA, type ExamTrack, type Chapter } from './data';
import { FORMULAS } from './formulas';
import { MarkdownRenderer } from './components/MarkdownRenderer';
import { Onboarding } from './components/Onboarding';
import { Profile } from './components/Profile';
import { PeriodicTable } from './components/PeriodicTable';
import { DailyMission } from './components/DailyMission';
import { GoalTracker } from './components/GoalTracker';
import { MistakeBook } from './components/MistakeBook';
import { WeeklyReview } from './components/WeeklyReview';

// ─── Firebase & AI ───────────────────────────────────────────────────────────
import { signInWithGoogle, signOutUser, onAuthChange, saveProgress, loadProgress } from './firebase';
import { askAI, generateQuiz, isAIAvailable, initializeAI, getAIStatus, GEMINI_MODELS, getBestModel, type ChatMessage, type QuizQuestion } from './ai';

// ─── Icons ───────────────────────────────────────────────────────────────────
const Icons = {
  search: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  chevron: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>,
  check: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>,
  google: <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>,
  logout: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  book: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>,
  formula: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16"/><path d="M4 12h10"/><path d="M4 20h16"/><circle cx="18" cy="12" r="2"/></svg>,
  expand: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>,
  collapse: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14h6v6"/><path d="M20 10h-6V4"/><path d="M14 10l7-7"/><path d="M3 21l7-7"/></svg>,
  reset: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>,
  globe: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>,
  user: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  cloud: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>,
  home: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  fire: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>,
  trophy: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
  target: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  clock: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  x: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
  zap: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  brain: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/></svg>,
  lightbulb: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>,
  calculator: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>,
  graduationCap: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  award: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
  trending: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
  flip: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9M3 12a9 9 0 0 0 9 9"/><polyline points="21 3 21 9 15 9"/><polyline points="3 21 3 15 9 15"/></svg>,
  cards: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="3" x2="21" y1="15" y2="15"/></svg>,
  shuffle: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/><path d="m18 14 4 4-4 4"/></svg>,
  atom: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z"/><path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z"/></svg>,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getChapterId(examId: string, subject: string, chapterName: string): string {
  return `${examId}|${subject}|${chapterName}`;
}

function getDifficulty(weightage: string): number {
  const lower = weightage.toLowerCase();
  if (lower.includes('very high')) return 3;
  if (lower.includes('high')) return 3;
  if (lower.includes('medium')) return 2;
  return 1;
}

function countChapters(exam: ExamTrack): { total: number; active: number } {
  let total = 0, active = 0;
  for (const g of exam.groups) {
    for (const ch of g.chapters) {
      total++;
      if (!ch.deletedChapter) active++;
    }
  }
  return { total, active };
}

function countDone(exam: ExamTrack, done: Record<string, boolean>): number {
  let count = 0;
  for (const g of exam.groups) {
    for (const ch of g.chapters) {
      if (!ch.deletedChapter && done[getChapterId(exam.id, g.subject, ch.name)]) count++;
    }
  }
  return count;
}

function countAllDone(done: Record<string, boolean>): { done: number; total: number } {
  let d = 0, t = 0;
  for (const exam of DATA) {
    const { active } = countChapters(exam);
    t += active;
    d += countDone(exam, done);
  }
  return { done: d, total: t };
}

function matchesSearch(ch: Chapter, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    ch.name.toLowerCase().includes(q) ||
    ch.summary.toLowerCase().includes(q) ||
    ch.keyConcepts.some(c => c.toLowerCase().includes(q)) ||
    ch.mustKnow.some(m => m.toLowerCase().includes(q))
  );
}

function getStreak(done: Record<string, boolean>): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let streak = 0;
  const checkDate = new Date(today);
  
  while (true) {
    const hasActivity = Object.keys(done).some(id => {
      const timestamp = localStorage.getItem(`catchup:activity:${id}`);
      if (!timestamp) return false;
      const activityDate = new Date(parseInt(timestamp));
      activityDate.setHours(0, 0, 0, 0);
      return activityDate.getTime() === checkDate.getTime();
    });
    
    if (hasActivity) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

// ─── Components ──────────────────────────────────────────────────────────────
function DifficultyDots({ level, accent }: { level: number; accent: string }) {
  return (
    <div className="flex items-center gap-1" title={`Difficulty: ${level}/3`}>
      {[1, 2, 3].map(i => (
        <div key={i} className="w-2 h-2 rounded-full" style={{ background: i <= level ? accent : '#e2e8f0' }} />
      ))}
    </div>
  );
}

function ProgressBar({ value, max, accent, size = 'md' }: { value: number; max: number; accent: string; size?: 'sm' | 'md' }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  const h = size === 'sm' ? 'h-2' : 'h-3';
  return (
    <div className={`w-full ${h} rounded-full overflow-hidden`} style={{ background: '#f1f5f9' }}>
      <div className={`progress-fill ${h} rounded-full`} style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${accent}, ${accent}dd)` }} />
    </div>
  );
}

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'info' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-[200] px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-in ${
      type === 'success' ? 'bg-green-500' :
      type === 'error' ? 'bg-red-500' :
      'bg-blue-500'
    } text-white`}>
      <span>{message}</span>
    </div>
  );
}

// ─── Chapter Card ────────────────────────────────────────────────────────────
function ChapterCard({
  chapter, examId, subject, accent, done, onToggleDone, expanded, onToggleExpand
}: {
  chapter: Chapter; examId: string; subject: string; accent: string;
  done: boolean; onToggleDone: () => void; expanded: boolean; onToggleExpand: () => void;
}) {
  const chId = getChapterId(examId, subject, chapter.name);
  const difficulty = getDifficulty(chapter.weightage);
  const isDeleted = chapter.deletedChapter;

  return (
    <div
      className={`chapter-card rounded-2xl overflow-hidden ${expanded ? 'expanded' : ''}`}
      style={{
        background: done ? 'var(--green-bg)' : 'var(--card)',
        border: `1.5px solid ${done ? 'var(--green-border)' : isDeleted ? 'var(--border)' : 'var(--border)'}`,
        borderLeft: done ? `4px solid var(--green)` : isDeleted ? `4px dashed var(--red)` : `4px solid transparent`,
        opacity: isDeleted ? 0.75 : 1,
      }}
    >
      <button
        onClick={onToggleExpand}
        className="w-full flex items-center gap-3 p-5 text-left"
        aria-expanded={expanded}
        aria-controls={`body-${chId}`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="font-semibold text-[15px] leading-tight" style={{ color: isDeleted ? 'var(--text-tertiary)' : 'var(--text)' }}>
              {chapter.name}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${accent}12`, color: accent }}>
              {examId.toUpperCase()}
            </span>
            {isDeleted && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'var(--red-bg)', color: 'var(--red)' }}>
                DELETED
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <DifficultyDots level={difficulty} accent={accent} />
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{chapter.weightage}</span>
          </div>
        </div>
        <label className="flex items-center gap-1.5 cursor-pointer shrink-0" onClick={(e) => e.stopPropagation()}>
          <input type="checkbox" checked={done} onChange={onToggleDone} className="sr-only" aria-label={`Mark ${chapter.name} as done`} />
          <div className="w-6 h-6 rounded-lg flex items-center justify-center transition-all" style={{ background: done ? 'var(--green)' : 'transparent', border: `2px solid ${done ? 'var(--green)' : '#d1d5db'}` }}>
            {done && <span style={{ color: 'white' }}>{Icons.check}</span>}
          </div>
        </label>
        <div className="shrink-0 transition-transform duration-300" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', color: 'var(--text-tertiary)' }}>
          {Icons.chevron}
        </div>
      </button>

      <div id={`body-${chId}`} className={`accordion-body ${expanded ? 'open' : ''}`}>
        <div>
          <div className="px-5 pb-5 space-y-5">
            <div className="rounded-xl p-4 text-sm leading-relaxed" style={{ background: `${accent}06`, color: 'var(--text-secondary)', border: `1px solid ${accent}15` }}>
              {chapter.summary}
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: 'var(--text-tertiary)' }}>Key Concepts</h4>
              <div className="flex flex-wrap gap-2">
                {chapter.keyConcepts.map((c, i) => (
                  <span key={i} className="concept-chip text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: `${accent}08`, color: accent, border: `1px solid ${accent}20` }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: 'var(--text-tertiary)' }}>Must Know for Exam</h4>
              <div className="space-y-2">
                {chapter.mustKnow.map((m, i) => (
                  <div key={i} className="mustknow-item flex items-start text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {m}
                  </div>
                ))}
              </div>
            </div>

            {chapter.formulas.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5" style={{ color: 'var(--text-tertiary)' }}>
                  {Icons.formula} Important Formulas
                </h4>
                <div className="rounded-xl p-4 space-y-2" style={{ background: 'var(--amber-bg)', border: '1px solid rgba(217, 119, 6, 0.15)' }}>
                  {chapter.formulas.map((f, i) => (
                    <div key={i} className="text-sm font-mono font-medium" style={{ color: 'var(--amber)' }}>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {chapter.deleted.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: 'var(--red)' }}>Deleted Topics (Not in Syllabus)</h4>
                <div className="flex flex-wrap gap-2">
                  {chapter.deleted.map((d, i) => (
                    <span key={i} className="text-xs px-3 py-1.5 rounded-lg line-through" style={{ background: 'var(--red-bg)', color: 'var(--red)', border: '1px solid rgba(220,38,38,0.15)' }}>
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
              <span>📊</span>
              <span>{chapter.weightage}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Exam View ───────────────────────────────────────────────────────────────
function ExamView({ exam, done, onToggleDone, searchQuery }: { exam: ExamTrack; done: Record<string, boolean>; onToggleDone: (id: string) => void; searchQuery: string; }) {
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [activeSubject, setActiveSubject] = useState<string>('all');
  const [allExpanded, setAllExpanded] = useState(false);

  const subjects = useMemo(() => exam.groups.map(g => g.subject), [exam]);
  const { active: totalActive } = useMemo(() => countChapters(exam), [exam]);
  const doneCount = useMemo(() => countDone(exam, done), [exam, done]);
  const pct = totalActive > 0 ? Math.round((doneCount / totalActive) * 100) : 0;

  const toggleChapter = useCallback((id: string) => {
    setExpandedChapters(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    const all = new Set<string>();
    for (const g of exam.groups) {
      if (activeSubject !== 'all' && g.subject !== activeSubject) continue;
      for (const ch of g.chapters) {
        if (!matchesSearch(ch, searchQuery)) continue;
        all.add(getChapterId(exam.id, g.subject, ch.name));
      }
    }
    setExpandedChapters(all);
    setAllExpanded(true);
  }, [exam, activeSubject, searchQuery]);

  const collapseAll = useCallback(() => {
    setExpandedChapters(new Set());
    setAllExpanded(false);
  }, []);

  const filteredGroups = useMemo(() => {
    return exam.groups
      .filter(g => activeSubject === 'all' || g.subject === activeSubject)
      .map(g => ({ ...g, chapters: g.chapters.filter(ch => !ch.deletedChapter && matchesSearch(ch, searchQuery)) }))
      .filter(g => g.chapters.length > 0);
  }, [exam, activeSubject, searchQuery]);

  return (
    <div className="fade-in">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>{exam.label}</h2>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{exam.note}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={allExpanded ? collapseAll : expandAll} className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl font-medium transition-all hover:shadow-md" style={{ background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--text-secondary)' }}>
              {allExpanded ? Icons.collapse : Icons.expand}
              {allExpanded ? 'Collapse All' : 'Expand All'}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <ProgressBar value={doneCount} max={totalActive} accent={exam.accent} />
          </div>
          <span className="text-sm font-bold whitespace-nowrap" style={{ color: exam.accent }}>
            {doneCount}/{totalActive} · {pct}%
          </span>
        </div>
      </div>

      <div className="no-print flex items-center gap-2 mb-8 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
        <button onClick={() => setActiveSubject('all')} className="subject-pill text-xs font-semibold px-4 py-2 rounded-full whitespace-nowrap transition-all" style={{ background: activeSubject === 'all' ? exam.accent : 'var(--card)', color: activeSubject === 'all' ? 'white' : 'var(--text-secondary)', border: `1.5px solid ${activeSubject === 'all' ? exam.accent : 'var(--border)'}`, boxShadow: activeSubject === 'all' ? `0 2px 8px ${exam.accent}30` : 'none' }}>
          All Subjects
        </button>
        {subjects.map(s => (
          <button key={s} onClick={() => setActiveSubject(s)} className="subject-pill text-xs font-semibold px-4 py-2 rounded-full whitespace-nowrap transition-all" style={{ background: activeSubject === s ? exam.accent : 'var(--card)', color: activeSubject === s ? 'white' : 'var(--text-secondary)', border: `1.5px solid ${activeSubject === s ? exam.accent : 'var(--border)'}`, boxShadow: activeSubject === s ? `0 2px 8px ${exam.accent}30` : 'none' }}>
            {s}
          </button>
        ))}
      </div>

      {filteredGroups.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg font-semibold mb-1" style={{ color: 'var(--text-tertiary)' }}>No chapters found</p>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Try a different search term or subject filter.</p>
        </div>
      ) : (
        filteredGroups.map((group, gi) => (
          <div key={group.subject} className={gi > 0 ? 'mt-10 page-break' : ''}>
            <h3 className="text-xl font-bold mb-5 flex items-center gap-3" style={{ color: 'var(--text)' }}>
              <span className="w-3 h-3 rounded-full" style={{ background: exam.accent }} />
              {group.subject}
              <span className="text-sm font-normal" style={{ color: 'var(--text-tertiary)' }}>
                ({group.chapters.filter(c => !c.deletedChapter).length} chapters)
              </span>
            </h3>
            <div className="chapter-grid">
              {group.chapters.map(ch => {
                const chId = getChapterId(exam.id, group.subject, ch.name);
                return (
                  <ChapterCard key={chId} chapter={ch} examId={exam.id} subject={group.subject} accent={exam.accent} done={!!done[chId]} onToggleDone={() => onToggleDone(chId)} expanded={expandedChapters.has(chId)} onToggleExpand={() => toggleChapter(chId)} />
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ─── Formula Wall ────────────────────────────────────────────────────────────
function FormulaWall() {
  const [selectedSubject, setSelectedSubject] = useState<string>('Physics');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const currentSubject = FORMULAS.find(s => s.subject === selectedSubject);

  const filteredCategories = useMemo(() => {
    if (!currentSubject) return [];
    if (!searchQuery) return currentSubject.categories;
    
    const q = searchQuery.toLowerCase();
    return currentSubject.categories
      .map(cat => ({
        ...cat,
        formulas: cat.formulas.filter(f => f.toLowerCase().includes(q))
      }))
      .filter(cat => cat.formulas.length > 0);
  }, [currentSubject, searchQuery]);

  const totalFormulas = useMemo(() => {
    return FORMULAS.reduce((sum, subject) => 
      sum + subject.categories.reduce((s, cat) => s + cat.formulas.length, 0), 0
    );
  }, []);

  const toggleCategory = (key: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const expandAll = () => {
    const all = new Set<string>();
    filteredCategories.forEach(cat => all.add(`${selectedSubject}-${cat.category}-${cat.topic}`));
    setExpandedCategories(all);
  };

  const collapseAll = () => {
    setExpandedCategories(new Set());
  };

  return (
    <div className="fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
            <span style={{ color: 'white' }}>{Icons.formula}</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>Formula Wall</h2>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              {totalFormulas} formulas • {FORMULAS.reduce((sum, s) => sum + s.categories.length, 0)} topics • 3 subjects
            </p>
          </div>
        </div>
        <p className="text-base mt-4" style={{ color: 'var(--text-tertiary)' }}>
          Complete formula reference for JEE, HSC, and competitive exams. Search, browse, and master every formula you need.
        </p>
      </div>

      {/* Subject Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {FORMULAS.map(subject => (
          <button
            key={subject.subject}
            onClick={() => { setSelectedSubject(subject.subject); setSearchQuery(''); }}
            className="subject-pill text-sm font-semibold px-5 py-2.5 rounded-full whitespace-nowrap transition-all"
            style={{
              background: selectedSubject === subject.subject ? subject.accent : 'var(--card)',
              color: selectedSubject === subject.subject ? 'white' : 'var(--text-secondary)',
              border: `1.5px solid ${selectedSubject === subject.subject ? subject.accent : 'var(--border)'}`,
              boxShadow: selectedSubject === subject.subject ? `0 2px 8px ${subject.accent}30` : 'none'
            }}
          >
            {subject.subject}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-2xl mb-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }}>{Icons.search}</span>
        <label htmlFor="formula-search" className="sr-only">Search formulas</label>
        <input
          id="formula-search"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search in ${selectedSubject} formulas...`}
          className="w-full pl-11 pr-4 py-3 rounded-xl text-sm transition-all focus:ring-2 focus:ring-blue-500/20"
          style={{ background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 mb-6">
        <button onClick={expandAll} className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl font-medium transition-all hover:shadow-md" style={{ background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--text-secondary)' }}>
          {Icons.expand} Expand All
        </button>
        <button onClick={collapseAll} className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl font-medium transition-all hover:shadow-md" style={{ background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--text-secondary)' }}>
          {Icons.collapse} Collapse All
        </button>
      </div>

      {/* Formula Categories */}
      {filteredCategories.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg font-semibold mb-1" style={{ color: 'var(--text-tertiary)' }}>No formulas found</p>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Try a different search term.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredCategories.map((cat, idx) => {
            const key = `${selectedSubject}-${cat.category}-${cat.topic}`;
            const isExpanded = expandedCategories.has(key);

            return (
              <div key={idx} className="rounded-xl overflow-hidden transition-all hover:shadow-md" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
                <button
                  onClick={() => toggleCategory(key)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: currentSubject?.accent }}>
                      {cat.category}
                    </div>
                    <div className="text-base font-bold truncate" style={{ color: 'var(--text)' }}>
                      {cat.topic}
                    </div>
                    <div className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                      {cat.formulas.length} formulas
                    </div>
                  </div>
                  <div className="shrink-0 ml-3 transition-transform duration-300" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', color: 'var(--text-tertiary)' }}>
                    {Icons.chevron}
                  </div>
                </button>

                <div className={`accordion-body ${isExpanded ? 'open' : ''}`}>
                  <div>
                    <div className="px-4 pb-4">
                      <div className="rounded-lg p-3 space-y-2" style={{ background: 'var(--amber-bg)', border: '1px solid rgba(217, 119, 6, 0.15)' }}>
                        {cat.formulas.map((f, i) => (
                          <div key={i} className="text-sm leading-relaxed" style={{ color: 'var(--amber)' }}>
                            <MarkdownRenderer content={f} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Flashcards ──────────────────────────────────────────────────────────────
function Flashcards() {
  const [selectedSubject, setSelectedSubject] = useState<string>('Physics');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set());
  const [needRevisionCards, setNeedRevisionCards] = useState<Set<string>>(new Set());
  const [showHint, setShowHint] = useState(false);

  const currentSubject = FORMULAS.find(s => s.subject === selectedSubject);
  
  const allCards = useMemo(() => {
    if (!currentSubject) return [];
    if (selectedTopic === 'all') {
      return currentSubject.categories.flatMap(cat => 
        cat.formulas.map(f => ({ formula: f, topic: cat.topic, category: cat.category }))
      );
    }
    const topic = currentSubject.categories.find(c => c.topic === selectedTopic);
    return topic ? topic.formulas.map(f => ({ formula: f, topic: topic.topic, category: topic.category })) : [];
  }, [currentSubject, selectedTopic]);

  const topics = useMemo(() => {
    if (!currentSubject) return [];
    return currentSubject.categories.map(c => c.topic);
  }, [currentSubject]);

  const currentCard = allCards[currentCardIndex];
  const cardKey = currentCard ? `${currentCard.category}-${currentCard.topic}-${currentCard.formula}` : '';
  const isKnown = knownCards.has(cardKey);
  const needsRevision = needRevisionCards.has(cardKey);
  
  const progress = allCards.length > 0 ? Math.round((knownCards.size / allCards.length) * 100) : 0;

  const generateHint = (formula: string): string => {
    const lowerFormula = formula.toLowerCase();
    if (lowerFormula.includes('velocity') || lowerFormula.includes('v =')) return 'Think about rate of change of position';
    if (lowerFormula.includes('force') || lowerFormula.includes('f =')) return 'Related to mass and acceleration';
    if (lowerFormula.includes('energy') || lowerFormula.includes('e =')) return 'Capacity to do work';
    if (lowerFormula.includes('momentum') || lowerFormula.includes('p =')) return 'Mass in motion';
    if (lowerFormula.includes('acceleration') || lowerFormula.includes('a =')) return 'Rate of change of velocity';
    if (lowerFormula.includes('torque') || lowerFormula.includes('τ =')) return 'Rotational equivalent of force';
    return 'Think about the fundamental concept';
  };

  const getDifficulty = (formula: string): 'Easy' | 'Medium' | 'Hard' => {
    const length = formula.length;
    const hasGreek = /[αβγδεζηθλμπσφω]/.test(formula);
    const hasIntegral = /∫|∑|∏/.test(formula);
    
    if (hasIntegral || (hasGreek && length > 30)) return 'Hard';
    if (hasGreek || length > 20) return 'Medium';
    return 'Easy';
  };

  const nextCard = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentCardIndex((prev) => (prev + 1) % allCards.length);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentCardIndex((prev) => (prev - 1 + allCards.length) % allCards.length);
  };

  const shuffleCards = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentCardIndex(Math.floor(Math.random() * allCards.length));
  };

  const markAsKnown = () => {
    if (currentCard) {
      const newKnown = new Set(knownCards);
      const newRevision = new Set(needRevisionCards);
      
      if (isKnown) {
        newKnown.delete(cardKey);
      } else {
        newKnown.add(cardKey);
        newRevision.delete(cardKey);
      }
      
      setKnownCards(newKnown);
      setNeedRevisionCards(newRevision);
    }
    nextCard();
  };

  const markForRevision = () => {
    if (currentCard) {
      const newKnown = new Set(knownCards);
      const newRevision = new Set(needRevisionCards);
      
      if (needsRevision) {
        newRevision.delete(cardKey);
      } else {
        newRevision.add(cardKey);
        newKnown.delete(cardKey);
      }
      
      setKnownCards(newKnown);
      setNeedRevisionCards(newRevision);
    }
    nextCard();
  };

  if (allCards.length === 0) {
    return (
      <div className="fade-in">
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'var(--bg2)' }}>
            <span style={{ color: 'var(--text-tertiary)' }}>{Icons.cards}</span>
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>No Cards Available</h3>
          <p className="text-sm mb-6" style={{ color: 'var(--text-tertiary)' }}>
            Try selecting a different subject or topic
          </p>
          <button
            onClick={() => { setSelectedTopic('all'); setCurrentCardIndex(0); }}
            className="px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg"
            style={{ background: currentSubject?.accent, color: 'white' }}
          >
            View All Cards
          </button>
        </div>
      </div>
    );
  }

  const difficulty = currentCard ? getDifficulty(currentCard.formula) : 'Medium';
  const difficultyColor = difficulty === 'Easy' ? '#16a34a' : difficulty === 'Medium' ? '#f59e0b' : '#dc2626';

  return (
    <div className="fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}>
            <span style={{ color: 'white' }}>{Icons.cards}</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>Flashcards</h2>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Interactive study cards • {allCards.length} cards available
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
            <div className="text-2xl font-bold mb-1" style={{ color: currentSubject?.accent }}>{progress}%</div>
            <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Mastered</div>
          </div>
          <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
            <div className="text-2xl font-bold mb-1" style={{ color: 'var(--green)' }}>{knownCards.size}</div>
            <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Known</div>
          </div>
          <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
            <div className="text-2xl font-bold mb-1" style={{ color: 'var(--red)' }}>{needRevisionCards.size}</div>
            <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Need Revision</div>
          </div>
        </div>

        <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
          <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'var(--bg2)' }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${currentSubject?.accent}, ${currentSubject?.accent}dd)` }} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {FORMULAS.map(subject => (
          <button
            key={subject.subject}
            onClick={() => { setSelectedSubject(subject.subject); setSelectedTopic('all'); setCurrentCardIndex(0); setIsFlipped(false); }}
            className="subject-pill text-sm font-semibold px-5 py-2.5 rounded-full whitespace-nowrap transition-all"
            style={{
              background: selectedSubject === subject.subject ? subject.accent : 'var(--card)',
              color: selectedSubject === subject.subject ? 'white' : 'var(--text-secondary)',
              border: `1.5px solid ${selectedSubject === subject.subject ? subject.accent : 'var(--border)'}`,
              boxShadow: selectedSubject === subject.subject ? `0 2px 8px ${subject.accent}30` : 'none'
            }}
          >
            {subject.subject}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        <button
          onClick={() => { setSelectedTopic('all'); setCurrentCardIndex(0); setIsFlipped(false); }}
          className="subject-pill text-xs font-semibold px-4 py-2 rounded-full whitespace-nowrap transition-all"
          style={{
            background: selectedTopic === 'all' ? 'var(--text)' : 'var(--card)',
            color: selectedTopic === 'all' ? 'white' : 'var(--text-secondary)',
            border: `1.5px solid ${selectedTopic === 'all' ? 'var(--text)' : 'var(--border)'}`
          }}
        >
          All Topics
        </button>
        {topics.map(topic => (
          <button
            key={topic}
            onClick={() => { setSelectedTopic(topic); setCurrentCardIndex(0); setIsFlipped(false); }}
            className="subject-pill text-xs font-semibold px-4 py-2 rounded-full whitespace-nowrap transition-all"
            style={{
              background: selectedTopic === topic ? 'var(--text)' : 'var(--card)',
              color: selectedTopic === topic ? 'white' : 'var(--text-secondary)',
              border: `1.5px solid ${selectedTopic === topic ? 'var(--text)' : 'var(--border)'}`
            }}
          >
            {topic}
          </button>
        ))}
      </div>

      {currentCard && (
        <div className="max-w-3xl mx-auto mb-8">
          <div 
            className="relative cursor-pointer" 
            style={{ 
              perspective: '1500px', 
              minHeight: '450px',
              width: '100%'
            }}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div
              className="relative transition-transform duration-700 ease-in-out"
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                minHeight: '450px',
                width: '100%',
                height: '450px'
              }}
            >
              <div
                className="absolute inset-0 rounded-3xl p-8 flex flex-col"
                style={{
                  background: 'linear-gradient(135deg, var(--card) 0%, var(--bg2) 100%)',
                  border: '2px solid var(--border)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(0deg)',
                  width: '100%',
                  height: '100%'
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full" style={{ color: currentSubject?.accent, background: `${currentSubject?.accent}15` }}>
                      {currentCard.topic}
                    </span>
                    <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ color: difficultyColor, background: `${difficultyColor}15` }}>
                      {difficulty}
                    </span>
                  </div>
                  <div className="text-xs font-medium px-3 py-1 rounded-full" style={{ background: 'var(--bg2)', color: 'var(--text-tertiary)' }}>
                    {currentCardIndex + 1} / {allCards.length}
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6" style={{ background: `${currentSubject?.accent}10` }}>
                    <span style={{ color: currentSubject?.accent }}>{Icons.flip}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text)' }}>
                    What is the formula for...
                  </h3>
                  <p className="text-base mb-6" style={{ color: 'var(--text-tertiary)' }}>
                    {currentCard.category}
                  </p>
                  
                  {showHint && (
                    <div className="mt-4 p-4 rounded-xl w-full max-w-md" style={{ background: 'rgba(37, 99, 235, 0.05)', border: '1px solid rgba(37, 99, 235, 0.2)' }}>
                      <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--accent)' }}>
                        💡 Hint
                      </div>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {generateHint(currentCard.formula)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowHint(!showHint);
                    }}
                    className="text-xs font-semibold px-4 py-2 rounded-full transition-all hover:scale-105"
                    style={{ background: 'var(--bg2)', border: '1.5px solid var(--border)', color: 'var(--text-secondary)' }}
                  >
                    {showHint ? 'Hide Hint' : 'Show Hint'}
                  </button>
                  <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    <span>{Icons.flip}</span>
                    <span>Click to reveal</span>
                  </div>
                </div>
              </div>

              <div
                className="absolute inset-0 rounded-3xl p-8 flex flex-col"
                style={{
                  background: 'linear-gradient(135deg, var(--amber-bg) 0%, var(--card) 100%)',
                  border: '2px solid rgba(217, 119, 6, 0.3)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  width: '100%',
                  height: '100%'
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full" style={{ color: 'var(--amber)', background: 'var(--amber-bg)' }}>
                    {currentCard.category}
                  </span>
                  <div className="text-xs font-medium px-3 py-1 rounded-full" style={{ background: 'var(--bg2)', color: 'var(--text-tertiary)' }}>
                    {currentCardIndex + 1} / {allCards.length}
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6" style={{ background: 'var(--amber-bg)' }}>
                    <span style={{ color: 'var(--amber)' }}>{Icons.formula}</span>
                  </div>
                  
                  <div className="mb-6 px-6 py-4 rounded-2xl w-full max-w-2xl overflow-x-auto" style={{ background: 'rgba(217, 119, 6, 0.05)', border: '1px solid rgba(217, 119, 6, 0.2)' }}>
                    <div className="text-xl md:text-2xl font-mono font-bold" style={{ color: 'var(--amber)' }}>
                      <MarkdownRenderer content={`$$${currentCard.formula}$$`} />
                    </div>
                  </div>
                  
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    {currentCard.topic}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markForRevision();
                    }}
                    className="flex-1 text-xs font-semibold px-4 py-3 rounded-xl transition-all hover:scale-105"
                    style={{ 
                      background: needsRevision ? 'var(--red)' : 'var(--bg2)', 
                      color: needsRevision ? 'white' : 'var(--text-secondary)',
                      border: `1.5px solid ${needsRevision ? 'var(--red)' : 'var(--border)'}`
                    }}
                  >
                    {needsRevision ? '✓ Needs Revision' : 'Need Revision'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsKnown();
                    }}
                    className="flex-1 text-xs font-semibold px-4 py-3 rounded-xl transition-all hover:scale-105"
                    style={{ 
                      background: isKnown ? 'var(--green)' : 'var(--bg2)', 
                      color: isKnown ? 'white' : 'var(--text-secondary)',
                      border: `1.5px solid ${isKnown ? 'var(--green)' : 'var(--border)'}`
                    }}
                  >
                    {isKnown ? '✓ Know It' : 'Know It'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-3 flex-wrap mb-6">
        <button
          onClick={prevCard}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all hover:shadow-lg hover:-translate-y-0.5"
          style={{ background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Previous
        </button>
        <button
          onClick={shuffleCards}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all hover:shadow-lg hover:-translate-y-0.5"
          style={{ background: `linear-gradient(135deg, ${currentSubject?.accent}, ${currentSubject?.accent}dd)`, color: 'white', border: `1.5px solid ${currentSubject?.accent}` }}
        >
          {Icons.shuffle}
          Shuffle
        </button>
        <button
          onClick={nextCard}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all hover:shadow-lg hover:-translate-y-0.5"
          style={{ background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
        >
          Next
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>

      <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
        <div className="text-xs font-semibold mb-3" style={{ color: 'var(--text)' }}>⌨️ Keyboard Shortcuts</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 rounded font-mono" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>←</kbd>
            <span style={{ color: 'var(--text-tertiary)' }}>Previous</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 rounded font-mono" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>→</kbd>
            <span style={{ color: 'var(--text-tertiary)' }}>Next</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 rounded font-mono" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>Space</kbd>
            <span style={{ color: 'var(--text-tertiary)' }}>Flip</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 rounded font-mono" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>H</kbd>
            <span style={{ color: 'var(--text-tertiary)' }}>Hint</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 rounded font-mono" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>K</kbd>
            <span style={{ color: 'var(--text-tertiary)' }}>Know it</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 rounded font-mono" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>R</kbd>
            <span style={{ color: 'var(--text-tertiary)' }}>Revision</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Random Concepts ─────────────────────────────────────────────────────────
function RandomConcepts() {
  const [cards, setCards] = useState<Array<{ formula: string; topic: string; category: string; subject: string; accent: string }>>([]);

  const generateRandomCards = useCallback(() => {
    const allFormulas: Array<{ formula: string; topic: string; category: string; subject: string; accent: string }> = [];
    
    FORMULAS.forEach(subject => {
      subject.categories.forEach(cat => {
        cat.formulas.forEach(f => {
          allFormulas.push({
            formula: f,
            topic: cat.topic,
            category: cat.category,
            subject: subject.subject,
            accent: subject.accent
          });
        });
      });
    });

    const shuffled = [...allFormulas].sort(() => Math.random() - 0.5);
    setCards(shuffled.slice(0, 9));
  }, []);

  useEffect(() => {
    generateRandomCards();
  }, [generateRandomCards]);

  return (
    <div className="fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}>
            <span style={{ color: 'white' }}>{Icons.lightbulb}</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>Random Concepts</h2>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Quick revision • Random formulas from all subjects
            </p>
          </div>
        </div>
        <p className="text-base mt-4" style={{ color: 'var(--text-tertiary)' }}>
          Test yourself! Try to recall each formula before reading. Perfect for spaced repetition.
        </p>
      </div>

      <div className="mb-8">
        <button
          onClick={generateRandomCards}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)', color: 'white', border: 'none' }}
        >
          {Icons.reset} Generate New Set
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="rounded-2xl p-6 transition-all hover:shadow-xl hover:-translate-y-1"
            style={{
              background: 'var(--card)',
              border: `2px solid ${card.accent}30`,
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full" style={{ background: `${card.accent}15`, color: card.accent }}>
                {card.subject}
              </div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>
                #{idx + 1}
              </div>
            </div>
            <div className="mb-4">
              <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-tertiary)' }}>
                {card.category}
              </div>
              <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                {card.topic}
              </div>
            </div>
            <div className="rounded-xl p-4" style={{ background: 'var(--amber-bg)', border: '1px solid rgba(217, 119, 6, 0.15)' }}>
              <div className="text-base font-mono font-bold leading-relaxed" style={{ color: 'var(--amber)' }}>
                {card.formula}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── AI Study Buddy ──────────────────────────────────────────────────────────
function AIStudyBuddy() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hello! I\'m your AI Study Buddy. Ask me anything about your syllabus, concepts, formulas, or exam preparation!', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem('catchup:chat:history');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed);
      } catch (e) {
        console.error('Failed to parse chat history:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('catchup:chat:history', JSON.stringify(messages));
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await askAI(input);
      const aiMessage: ChatMessage = { role: 'assistant', content: response, timestamp: Date.now() };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', timestamp: Date.now() };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (confirm('Clear all chat history?')) {
      setMessages([
        { role: 'assistant', content: 'Hello! I\'m your AI Study Buddy. Ask me anything about your syllabus, concepts, formulas, or exam preparation!', timestamp: Date.now() }
      ]);
    }
  };

  const quickQuestions = [
    'Explain rotational motion',
    'What is the formula for integration by parts?',
    'How to solve quadratic equations?',
    'Tips for JEE Physics preparation',
    'Explain chemical bonding',
    'What is the binomial theorem?'
  ];

  return (
    <div className="fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
            <span style={{ color: 'white' }}>{Icons.brain}</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>AI Study Buddy</h2>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Your personal AI tutor • Powered by Gemini
            </p>
          </div>
        </div>
        <p className="text-base mt-4" style={{ color: 'var(--text-tertiary)' }}>
          Ask questions, get explanations, solve doubts, and get exam tips from your AI tutor.
        </p>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}>
        <div className="flex items-center justify-between px-6 py-3 border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg2)' }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>AI Chat</span>
          </div>
          <button
            onClick={handleClearChat}
            className="text-xs px-3 py-1.5 rounded-lg transition-all hover:shadow-md"
            style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
          >
            Clear Chat
          </button>
        </div>

        <div className="h-[500px] overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3xl rounded-2xl px-5 py-4 ${
                msg.role === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-50 text-gray-900 border border-gray-200'
              }`}>
                {msg.role === 'user' ? (
                  <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                ) : (
                  <div className="markdown-content text-sm">
                    <MarkdownRenderer content={msg.content} />
                  </div>
                )}
                <div className={`text-xs mt-2 ${msg.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="px-6 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-tertiary)' }}>Quick Questions:</div>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setInput(q)}
                className="text-xs px-3 py-1.5 rounded-full transition-all hover:shadow-md"
                style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything about your studies..."
              className="flex-1 px-4 py-3 rounded-xl text-sm"
              style={{ background: 'var(--bg2)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)', color: 'white' }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AI Quiz Generator ───────────────────────────────────────────────────────
function AIQuizGenerator() {
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [customTopic, setCustomTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [questionCount, setQuestionCount] = useState(5);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);

  const availableSubjects = useMemo(() => {
    if (!selectedExam) return [];
    const exam = DATA.find(e => e.id === selectedExam);
    return exam ? exam.groups.map(g => g.subject) : [];
  }, [selectedExam]);

  const availableChapters = useMemo(() => {
    if (!selectedExam || !selectedSubject) return [];
    const exam = DATA.find(e => e.id === selectedExam);
    const subject = exam?.groups.find(g => g.subject === selectedSubject);
    return subject ? subject.chapters.filter(ch => !ch.deletedChapter).map(ch => ch.name) : [];
  }, [selectedExam, selectedSubject]);

  const handleGenerate = async () => {
    const topic = customTopic.trim() || selectedChapter;
    if (!topic || isLoading) return;
    
    setIsLoading(true);
    setError('');
    setQuizQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setQuizCompleted(false);
    setUserAnswers([]);
    
    try {
      const result = await generateQuiz(topic, difficulty, questionCount, selectedSubject);
      
      if (typeof result === 'string') {
        setError(result);
      } else {
        setQuizQuestions(result);
        setUserAnswers(new Array(result.length).fill(null));
      }
    } catch (err) {
      setError('Failed to generate quiz. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setUserAnswers(newAnswers);
    
    if (answerIndex === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(userAnswers[currentQuestion + 1]);
      setShowExplanation(userAnswers[currentQuestion + 1] !== null);
    } else {
      setQuizCompleted(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(userAnswers[currentQuestion - 1]);
      setShowExplanation(userAnswers[currentQuestion - 1] !== null);
    }
  };

  const handleRestart = () => {
    setQuizQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setQuizCompleted(false);
    setError('');
    setUserAnswers([]);
  };

  if (quizQuestions.length === 0 && !isLoading) {
    return (
      <div className="fade-in max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
              <span style={{ color: 'white' }}>{Icons.target}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>AI Quiz Generator</h2>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Practice questions powered by AI</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-6" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text)' }}>Exam</label>
                <select
                  value={selectedExam}
                  onChange={(e) => {
                    setSelectedExam(e.target.value);
                    setSelectedSubject('');
                    setSelectedChapter('');
                  }}
                  className="w-full px-3 py-2.5 rounded-lg text-sm"
                  style={{ background: 'var(--bg2)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
                >
                  <option value="">Select Exam</option>
                  {DATA.map(exam => (
                    <option key={exam.id} value={exam.id}>{exam.label}</option>
                  ))}
                </select>
              </div>

              {selectedExam && (
                <div>
                  <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text)' }}>Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => {
                      setSelectedSubject(e.target.value);
                      setSelectedChapter('');
                    }}
                    className="w-full px-3 py-2.5 rounded-lg text-sm"
                    style={{ background: 'var(--bg2)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
                  >
                    <option value="">Select Subject</option>
                    {availableSubjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {selectedSubject && (
              <div>
                <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text)' }}>Chapter</label>
                <select
                  value={selectedChapter}
                  onChange={(e) => {
                    setSelectedChapter(e.target.value);
                    setCustomTopic('');
                  }}
                  className="w-full px-3 py-2.5 rounded-lg text-sm"
                  style={{ background: 'var(--bg2)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
                >
                  <option value="">Select Chapter</option>
                  {availableChapters.map(chapter => (
                    <option key={chapter} value={chapter}>{chapter}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text)' }}>Or Custom Topic</label>
              <input
                type="text"
                value={customTopic}
                onChange={(e) => {
                  setCustomTopic(e.target.value);
                  setSelectedChapter('');
                }}
                placeholder="e.g., Rotational Motion, Chemical Bonding..."
                className="w-full px-3 py-2.5 rounded-lg text-sm"
                style={{ background: 'var(--bg2)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text)' }}>Difficulty</label>
                <div className="flex gap-2">
                  {(['easy', 'medium', 'hard'] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                      style={{
                        background: difficulty === d ? 'var(--accent)' : 'var(--bg2)',
                        color: difficulty === d ? 'white' : 'var(--text-secondary)',
                        border: `1.5px solid ${difficulty === d ? 'var(--accent)' : 'var(--border)'}`
                      }}
                    >
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text)' }}>Questions</label>
                <div className="flex gap-2">
                  {[3, 5, 10].map((count) => (
                    <button
                      key={count}
                      onClick={() => setQuestionCount(count)}
                      className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                      style={{
                        background: questionCount === count ? 'var(--accent)' : 'var(--bg2)',
                        color: questionCount === count ? 'white' : 'var(--text-secondary)',
                        border: `1.5px solid ${questionCount === count ? 'var(--accent)' : 'var(--border)'}`
                      }}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading || (!customTopic.trim() && !selectedChapter)}
              className="w-full px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white' }}
            >
              {isLoading ? 'Generating...' : 'Generate Quiz'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="fade-in flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-6" style={{ borderColor: '#f59e0b', borderTopColor: 'transparent' }} />
          <p className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>Generating Quiz...</p>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>AI is creating questions for you</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fade-in max-w-2xl mx-auto">
        <div className="rounded-2xl p-8 text-center" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(220, 38, 38, 0.1)' }}>
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>Quiz Generation Failed</h3>
          <p className="text-sm mb-6" style={{ color: 'var(--text-tertiary)' }}>{error}</p>
          <button
            onClick={handleRestart}
            className="px-8 py-3 rounded-xl font-semibold transition-all hover:shadow-lg"
            style={{ background: 'var(--accent)', color: 'white' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    const accuracy = percentage;
    const correctAnswers = score;
    const wrongAnswers = quizQuestions.length - score;
    
    return (
      <div className="fade-in max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-4" style={{ 
            background: percentage >= 80 ? 'rgba(22, 163, 74, 0.1)' : percentage >= 60 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(220, 38, 38, 0.1)'
          }}>
            <span className="text-5xl">
              {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '💪'}
            </span>
          </div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>Quiz Completed!</h2>
          <p className="text-lg" style={{ color: 'var(--text-tertiary)' }}>
            Great effort! Here's how you performed
          </p>
        </div>

        <div className="rounded-2xl p-8 mb-6" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
          <div className="text-center mb-8">
            <div className="text-6xl font-bold mb-2" style={{ 
              color: percentage >= 80 ? '#16a34a' : percentage >= 60 ? '#f59e0b' : '#dc2626'
            }}>
              {percentage}%
            </div>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              {correctAnswers} correct out of {quizQuestions.length} questions
            </p>
          </div>

          <div className="w-full h-3 rounded-full overflow-hidden mb-8" style={{ background: 'var(--bg2)' }}>
            <div 
              className="h-full rounded-full transition-all duration-1000" 
              style={{ 
                width: `${percentage}%`, 
                background: percentage >= 80 ? '#16a34a' : percentage >= 60 ? '#f59e0b' : '#dc2626'
              }} 
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(22, 163, 74, 0.05)', border: '1px solid rgba(22, 163, 74, 0.2)' }}>
              <div className="text-3xl font-bold mb-1" style={{ color: '#16a34a' }}>{correctAnswers}</div>
              <div className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Correct</div>
            </div>
            <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(220, 38, 38, 0.05)', border: '1px solid rgba(220, 38, 38, 0.2)' }}>
              <div className="text-3xl font-bold mb-1" style={{ color: '#dc2626' }}>{wrongAnswers}</div>
              <div className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Wrong</div>
            </div>
            <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(37, 99, 235, 0.05)', border: '1px solid rgba(37, 99, 235, 0.2)' }}>
              <div className="text-3xl font-bold mb-1" style={{ color: 'var(--accent)' }}>{accuracy}%</div>
              <div className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Accuracy</div>
            </div>
          </div>

          <div className="text-center p-4 rounded-xl mb-6" style={{ background: 'var(--bg2)' }}>
            <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
              {percentage >= 80 ? '🌟 Excellent! You\'ve mastered this topic!' : 
               percentage >= 60 ? '👍 Good job! Keep practicing to improve further.' : 
               '💪 Keep going! Review the explanations and try again.'}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setCurrentQuestion(0);
                setSelectedAnswer(userAnswers[0]);
                setShowExplanation(userAnswers[0] !== null);
                setQuizCompleted(false);
              }}
              className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg"
              style={{ background: 'var(--bg2)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
            >
              Review Answers
            </button>
            <button
              onClick={handleRestart}
              className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg"
              style={{ background: 'var(--accent)', color: 'white' }}
            >
              New Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  
  return (
    <div className="fade-in max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>
              Question {currentQuestion + 1} of {quizQuestions.length}
            </span>
            <span className="text-xs px-2 py-1 rounded-full" style={{ 
              background: 'var(--bg2)', 
              color: 'var(--text-tertiary)',
              border: '1px solid var(--border)'
            }}>
              {selectedSubject || 'General'} • {difficulty.toUpperCase()}
            </span>
          </div>
          <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
            Score: {score}/{currentQuestion + (selectedAnswer !== null ? 1 : 0)}
          </span>
        </div>
        
        <div className="relative">
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg2)' }}>
            <div 
              className="h-full rounded-full transition-all duration-500" 
              style={{ 
                width: `${progress}%`, 
                background: 'linear-gradient(90deg, var(--accent), var(--accent))' 
              }} 
            />
          </div>
          
          <div className="flex justify-between mt-2">
            {quizQuestions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentQuestion(idx);
                  setSelectedAnswer(userAnswers[idx]);
                  setShowExplanation(userAnswers[idx] !== null);
                }}
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all hover:scale-110"
                style={{
                  background: idx === currentQuestion ? 'var(--accent)' : 
                             userAnswers[idx] !== null ? 
                               (userAnswers[idx] === quizQuestions[idx].correctAnswer ? '#16a34a' : '#dc2626') : 
                             'var(--bg2)',
                  color: idx === currentQuestion || userAnswers[idx] !== null ? 'white' : 'var(--text-tertiary)',
                  border: `2px solid ${idx === currentQuestion ? 'var(--accent)' : 'var(--border)'}`
                }}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-8 mb-6" style={{ 
        background: 'var(--card)', 
        border: '1.5px solid var(--border)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        <div className="mb-8">
          <h3 className="text-2xl font-bold leading-relaxed mb-4" style={{ color: 'var(--text)' }}>
            <MarkdownRenderer content={question.question} />
          </h3>
        </div>

        <div className="space-y-3 mb-6">
          {question.options.map((option: string, idx: number) => {
            const isSelected = selectedAnswer === idx;
            const isCorrect = idx === question.correctAnswer;
            const showResult = selectedAnswer !== null;
            
            let bgColor = 'var(--bg2)';
            let borderColor = 'var(--border)';
            let textColor = 'var(--text)';
            let iconBg = 'var(--card)';
            let iconColor = 'var(--text)';
            let iconBorder = 'var(--border)';
            
            if (showResult) {
              if (isCorrect) {
                bgColor = 'rgba(22, 163, 74, 0.08)';
                borderColor = '#16a34a';
                textColor = '#16a34a';
                iconBg = '#16a34a';
                iconColor = 'white';
                iconBorder = '#16a34a';
              } else if (isSelected && !isCorrect) {
                bgColor = 'rgba(220, 38, 38, 0.08)';
                borderColor = '#dc2626';
                textColor = '#dc2626';
                iconBg = '#dc2626';
                iconColor = 'white';
                iconBorder = '#dc2626';
              }
            }
            
            return (
              <button
                key={idx}
                onClick={() => handleAnswerSelect(idx)}
                disabled={selectedAnswer !== null}
                className="w-full text-left px-5 py-4 rounded-xl transition-all disabled:cursor-default"
                style={{ 
                  background: bgColor, 
                  border: `2px solid ${borderColor}`,
                  color: textColor,
                  transform: showResult && (isCorrect || (isSelected && !isCorrect)) ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all"
                    style={{ 
                      background: iconBg,
                      color: iconColor,
                      border: `2px solid ${iconBorder}`
                    }}
                  >
                    {showResult && isCorrect ? '✓' : showResult && isSelected && !isCorrect ? '✗' : String.fromCharCode(65 + idx)}
                  </div>
                  <div className="flex-1 text-base">
                    <MarkdownRenderer content={option} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="mt-6 p-5 rounded-xl" style={{ 
            background: 'rgba(37, 99, 235, 0.05)', 
            border: '1px solid rgba(37, 99, 235, 0.2)' 
          }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">💡</span>
              <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                Explanation
              </div>
            </div>
            <div className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
              <MarkdownRenderer content={question.explanation} />
            </div>
          </div>
        )}
      </div>

      {selectedAnswer !== null && (
        <div className="flex gap-3">
          {currentQuestion > 0 && (
            <button
              onClick={handlePreviousQuestion}
              className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg"
              style={{ background: 'var(--bg2)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
            >
              ← Previous
            </button>
          )}
          <button
            onClick={handleNextQuestion}
            className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg"
            style={{ background: 'var(--accent)', color: 'white' }}
          >
            {currentQuestion < quizQuestions.length - 1 ? 'Next Question →' : 'Finish Quiz →'}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
function Dashboard({ done, onNavigate }: { done: Record<string, boolean>; onNavigate: (examId: string) => void }) {
  const globalStats = countAllDone(done);
  const streak = getStreak(done);
  const globalPct = globalStats.total > 0 ? Math.round((globalStats.done / globalStats.total) * 100) : 0;

  return (
    <div className="fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>Welcome back! 👋</h2>
        <p className="text-base" style={{ color: 'var(--text-tertiary)' }}>Track your progress and stay consistent with your exam prep.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(37, 99, 235, 0.1)' }}>
              <span style={{ color: '#2563eb' }}>{Icons.trending}</span>
            </div>
          </div>
          <div className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>{globalPct}%</div>
          <div className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Overall Progress</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(22, 163, 74, 0.1)' }}>
              <span style={{ color: '#16a34a' }}>{Icons.check}</span>
            </div>
          </div>
          <div className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>{globalStats.done}</div>
          <div className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Chapters Done</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(234, 88, 12, 0.1)' }}>
              <span style={{ color: '#ea580c' }}>{Icons.fire}</span>
            </div>
          </div>
          <div className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>{streak}</div>
          <div className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Day Streak</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
              <span style={{ color: '#8b5cf6' }}>{Icons.target}</span>
            </div>
          </div>
          <div className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>{globalStats.total - globalStats.done}</div>
          <div className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Remaining</div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text)' }}>My Goals</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="stat-card" style={{ border: '1.5px solid rgba(37, 99, 235, 0.2)' }}>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #2563eb, #1e40af)' }}>
                <span style={{ color: 'white' }}>{Icons.graduationCap}</span>
              </div>
              <div className="flex-1">
                <div className="font-bold text-base mb-1" style={{ color: 'var(--text)' }}>IIT Bombay CSE</div>
                <div className="text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>Primary Goal • JEE Main & Advanced</div>
                <ProgressBar 
                  value={countDone(DATA.find(e => e.id === 'jee')!, done)} 
                  max={countChapters(DATA.find(e => e.id === 'jee')!).active} 
                  accent="#2563eb" 
                  size="sm" 
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {countDone(DATA.find(e => e.id === 'jee')!, done)}/{countChapters(DATA.find(e => e.id === 'jee')!).active} chapters
                  </span>
                  <span className="text-xs font-bold" style={{ color: '#2563eb' }}>
                    {countChapters(DATA.find(e => e.id === 'jee')!).active > 0 
                      ? Math.round((countDone(DATA.find(e => e.id === 'jee')!, done) / countChapters(DATA.find(e => e.id === 'jee')!).active) * 100) 
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('jee')}
              className="w-full px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-md"
              style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb', border: '1px solid rgba(37, 99, 235, 0.2)' }}
            >
              Continue Preparation →
            </button>
          </div>

          <div className="stat-card" style={{ border: '1.5px solid rgba(234, 88, 12, 0.2)' }}>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #ea580c, #c2410c)' }}>
                <span style={{ color: 'white' }}>{Icons.award}</span>
              </div>
              <div className="flex-1">
                <div className="font-bold text-base mb-1" style={{ color: 'var(--text)' }}>Maharashtra HSC: 95%+ Target</div>
                <div className="text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>Academic Goal • Board Exams</div>
                <ProgressBar 
                  value={
                    countDone(DATA.find(e => e.id === 'hsc-physics')!, done) +
                    countDone(DATA.find(e => e.id === 'hsc-chemistry')!, done) +
                    countDone(DATA.find(e => e.id === 'hsc-maths')!, done)
                  } 
                  max={
                    countChapters(DATA.find(e => e.id === 'hsc-physics')!).active +
                    countChapters(DATA.find(e => e.id === 'hsc-chemistry')!).active +
                    countChapters(DATA.find(e => e.id === 'hsc-maths')!).active
                  } 
                  accent="#ea580c" 
                  size="sm" 
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {countDone(DATA.find(e => e.id === 'hsc-physics')!, done) + countDone(DATA.find(e => e.id === 'hsc-chemistry')!, done) + countDone(DATA.find(e => e.id === 'hsc-maths')!, done)}/
                    {countChapters(DATA.find(e => e.id === 'hsc-physics')!).active + countChapters(DATA.find(e => e.id === 'hsc-chemistry')!).active + countChapters(DATA.find(e => e.id === 'hsc-maths')!).active} chapters
                  </span>
                  <span className="text-xs font-bold" style={{ color: '#ea580c' }}>
                    {(countChapters(DATA.find(e => e.id === 'hsc-physics')!).active + countChapters(DATA.find(e => e.id === 'hsc-chemistry')!).active + countChapters(DATA.find(e => e.id === 'hsc-maths')!).active) > 0 
                      ? Math.round(((countDone(DATA.find(e => e.id === 'hsc-physics')!, done) + countDone(DATA.find(e => e.id === 'hsc-chemistry')!, done) + countDone(DATA.find(e => e.id === 'hsc-maths')!, done)) / (countChapters(DATA.find(e => e.id === 'hsc-physics')!).active + countChapters(DATA.find(e => e.id === 'hsc-chemistry')!).active + countChapters(DATA.find(e => e.id === 'hsc-maths')!).active)) * 100) 
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onNavigate('hsc-physics')}
                className="flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all hover:shadow-md"
                style={{ background: 'rgba(234, 88, 12, 0.1)', color: '#ea580c', border: '1px solid rgba(234, 88, 12, 0.2)' }}
              >
                Physics →
              </button>
              <button
                onClick={() => onNavigate('hsc-chemistry')}
                className="flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all hover:shadow-md"
                style={{ background: 'rgba(234, 88, 12, 0.1)', color: '#ea580c', border: '1px solid rgba(234, 88, 12, 0.2)' }}
              >
                Chemistry →
              </button>
              <button
                onClick={() => onNavigate('hsc-maths')}
                className="flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all hover:shadow-md"
                style={{ background: 'rgba(234, 88, 12, 0.1)', color: '#ea580c', border: '1px solid rgba(234, 88, 12, 0.2)' }}
              >
                Maths →
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 stat-card" style={{ border: '1.5px solid rgba(16, 185, 129, 0.2)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
              <span style={{ color: '#10b981' }}>{Icons.clock}</span>
            </div>
            <div>
              <div className="font-bold text-sm" style={{ color: 'var(--text)' }}>Today's Mission</div>
              <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                {globalStats.total - globalStats.done > 0 
                  ? `${Math.min(3, globalStats.total - globalStats.done)} chapters to review`
                  : 'All caught up! 🎉'}
              </div>
            </div>
          </div>
          {globalStats.total - globalStats.done > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg2)' }}>
                <div 
                  className="h-full rounded-full transition-all" 
                  style={{ 
                    width: `${Math.min(100, (globalStats.done / globalStats.total) * 100)}%`, 
                    background: 'linear-gradient(90deg, #10b981, #059669)' 
                  }} 
                />
              </div>
              <span className="text-xs font-bold" style={{ color: '#10b981' }}>
                {Math.min(100, Math.round((globalStats.done / globalStats.total) * 100))}%
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text)' }}>Your Exams</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DATA.map(exam => {
            const { active } = countChapters(exam);
            const doneCount = countDone(exam, done);
            const pct = active > 0 ? Math.round((doneCount / active) * 100) : 0;

            return (
              <button
                key={exam.id}
                onClick={() => onNavigate(exam.id)}
                className="stat-card text-left hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-xs" style={{ background: `linear-gradient(135deg, ${exam.accent}, ${exam.accent}cc)` }}>
                    {exam.tag}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm mb-0.5 truncate" style={{ color: 'var(--text)' }}>{exam.label}</div>
                    <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{active} chapters</div>
                  </div>
                </div>
                <ProgressBar value={doneCount} max={active} accent={exam.accent} size="sm" />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>{doneCount}/{active} done</span>
                  <span className="text-xs font-bold" style={{ color: exam.accent }}>{pct}%</span>
                </div>
              </button>
            );
          })}

          <button
            onClick={() => onNavigate('formulas')}
            className="stat-card text-left hover:shadow-lg transition-all hover:-translate-y-1"
            style={{ border: '1.5px solid #7c3aed30' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
                {Icons.calculator}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm mb-0.5" style={{ color: 'var(--text)' }}>Formula Wall</div>
                <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>5000+ formulas</div>
              </div>
            </div>
            <div className="text-xs font-medium" style={{ color: '#7c3aed' }}>Physics • Chemistry • Maths →</div>
          </button>

          <button
            onClick={() => onNavigate('flashcards')}
            className="stat-card text-left hover:shadow-lg transition-all hover:-translate-y-1"
            style={{ border: '1.5px solid #f59e0b30' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white" style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}>
                {Icons.zap}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm mb-0.5" style={{ color: 'var(--text)' }}>Flashcards</div>
                <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Interactive study</div>
              </div>
            </div>
            <div className="text-xs font-medium" style={{ color: '#f59e0b' }}>Flip & Learn →</div>
          </button>

          <button
            onClick={() => onNavigate('random')}
            className="stat-card text-left hover:shadow-lg transition-all hover:-translate-y-1"
            style={{ border: '1.5px solid #ec489930' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white" style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}>
                {Icons.lightbulb}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm mb-0.5" style={{ color: 'var(--text)' }}>Random Concepts</div>
                <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Quick revision</div>
              </div>
            </div>
            <div className="text-xs font-medium" style={{ color: '#ec4899' }}>Test Yourself →</div>
          </button>

          <button
            onClick={() => onNavigate('ai-buddy')}
            className="stat-card text-left hover:shadow-lg transition-all hover:-translate-y-1"
            style={{ border: '1.5px solid #06b6d430' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white" style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
                {Icons.brain}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm mb-0.5" style={{ color: 'var(--text)' }}>AI Study Buddy</div>
                <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Personal AI tutor</div>
              </div>
            </div>
            <div className="text-xs font-medium" style={{ color: '#06b6d4' }}>Ask Questions →</div>
          </button>

          <button
            onClick={() => onNavigate('ai-quiz')}
            className="stat-card text-left hover:shadow-lg transition-all hover:-translate-y-1"
            style={{ border: '1.5px solid #f59e0b30' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                {Icons.target}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm mb-0.5" style={{ color: 'var(--text)' }}>AI Quiz Generator</div>
                <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Practice questions</div>
              </div>
            </div>
            <div className="text-xs font-medium" style={{ color: '#f59e0b' }}>Generate Quiz →</div>
          </button>
        </div>
      </div>

      <div className="rounded-2xl p-6" style={{ background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05), rgba(124, 58, 237, 0.05))', border: '1.5px solid rgba(37, 99, 235, 0.1)' }}>
        <h3 className="text-base font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
          💡 Pro Tips
        </h3>
        <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <li>• Mark chapters as done to track your progress across devices</li>
          <li>• Use the search to quickly find specific topics</li>
          <li>• Check the "Must Know" section for exam-critical points</li>
          <li>• Review formulas regularly - they're highlighted in amber</li>
          <li>• Stay consistent - even 30 minutes daily makes a difference!</li>
        </ul>
      </div>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [quizScores, setQuizScores] = useState<Record<string, number>>({});
  const [mistakes, setMistakes] = useState<any[]>([]);
  const [activeExam, setActiveExam] = useState<string>('jee');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchAll, setSearchAll] = useState(false);
  const [showResetMenu, setShowResetMenu] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'local' | 'syncing' | 'synced'>('local');
  const [view, setView] = useState<'dashboard' | 'exam' | 'formulas' | 'flashcards' | 'random' | 'ai-buddy' | 'ai-quiz' | 'periodic-table' | 'daily-mission' | 'goals' | 'mistakes' | 'weekly-review'>('dashboard');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('catchup:syllabus:v2:done');
      if (saved) setDone(JSON.parse(saved));
      
      const savedScores = localStorage.getItem('catchup:quizScores');
      if (savedScores) setQuizScores(JSON.parse(savedScores));
      
      const savedMistakes = localStorage.getItem('catchup:mistakes');
      if (savedMistakes) setMistakes(JSON.parse(savedMistakes));
    } catch {}
  }, []);

  useEffect(() => {
    const onboardingCompleted = localStorage.getItem('catchup:onboarding:completed');
    if (!onboardingCompleted) {
      setShowOnboarding(true);
    }
  }, []);

  useEffect(() => {
    const unsub = onAuthChange((u: any) => {
      setUser(u);
      if (u) {
        setSyncStatus('syncing');
        loadProgress(u.uid, (progress: Record<string, boolean>) => {
          setDone(progress);
          setSyncStatus('synced');
        });
      } else {
        setSyncStatus('local');
      }
    });
    return unsub;
  }, []);

  const saveDone = useCallback((newDone: Record<string, boolean>) => {
    setDone(newDone);
    try { localStorage.setItem('catchup:syllabus:v2:done', JSON.stringify(newDone)); } catch {}
    if (user) {
      setSyncStatus('syncing');
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        saveProgress(user.uid, newDone).then(() => setSyncStatus('synced'));
      }, 1000);
    }
  }, [user]);

  const toggleDone = useCallback((id: string) => {
    const newDone = { ...done };
    if (newDone[id]) {
      delete newDone[id];
      setToast({ message: 'Chapter unmarked', type: 'info' });
    } else {
      newDone[id] = true;
      localStorage.setItem(`catchup:activity:${id}`, Date.now().toString());
      setToast({ message: 'Chapter marked as done! 🎉', type: 'success' });
    }
    saveDone(newDone);
  }, [done, saveDone]);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      setShowSignIn(false);
      setToast({ message: 'Signed in successfully! Progress will sync to cloud.', type: 'success' });
    } catch (e: any) {
      alert('Sign-in failed: ' + (e.message || 'Unknown error'));
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
    setUser(null);
    setSyncStatus('local');
    setToast({ message: 'Signed out. Progress saved locally.', type: 'info' });
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  const resetExam = useCallback((examId: string) => {
    if (!confirm('Reset all progress for this exam?')) return;
    const newDone = { ...done };
    const exam = DATA.find(e => e.id === examId);
    if (!exam) return;
    for (const g of exam.groups) {
      for (const ch of g.chapters) {
        delete newDone[getChapterId(examId, g.subject, ch.name)];
      }
    }
    saveDone(newDone);
    setToast({ message: 'Exam progress reset', type: 'info' });
  }, [done, saveDone]);

  const resetAll = useCallback(() => {
    if (!confirm('Reset ALL progress across all exams? This cannot be undone.')) return;
    saveDone({});
    setToast({ message: 'All progress reset', type: 'info' });
  }, [saveDone]);

  const navigateToExam = (examId: string) => {
    if (examId === 'formulas') {
      setView('formulas');
    } else if (examId === 'flashcards') {
      setView('flashcards');
    } else if (examId === 'random') {
      setView('random');
    } else if (examId === 'ai-buddy') {
      setView('ai-buddy');
    } else if (examId === 'ai-quiz') {
      setView('ai-quiz');
    } else if (examId === 'periodic-table') {
      setView('periodic-table');
    } else {
      setActiveExam(examId);
      setView('exam');
    }
    setSearchQuery('');
    
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  };

  const currentExam = DATA.find(e => e.id === activeExam)!;
  const globalStats = useMemo(() => countAllDone(done), [done]);
  const globalPct = globalStats.total > 0 ? Math.round((globalStats.done / globalStats.total) * 100) : 0;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)' }}>
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
              <span style={{ color: 'white' }}>{Icons.book}</span>
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>CatchUp Vault</h1>
            <p className="text-base" style={{ color: 'var(--text-tertiary)' }}>Your complete exam prep companion</p>
          </div>

          <div className="rounded-2xl p-8 mb-6" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
            <p className="text-sm mb-6 text-center" style={{ color: 'var(--text-tertiary)' }}>Sign in with Google to sync your progress across devices</p>
            <button
              onClick={handleSignIn}
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: 'white', color: '#333', border: '1.5px solid #e5e7eb' }}
            >
              {Icons.google}
              Continue with Google
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              Free forever • No credit card required • Cloud sync
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-bg">
      {showOnboarding && (
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      )}

      <header className="sticky top-0 z-50 no-print header-glass" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)' }}>
                <span style={{ color: 'white' }}>{Icons.book}</span>
              </div>
              <div>
                <h1 className="text-sm font-bold leading-tight" style={{ color: 'var(--text)' }}>CatchUp Vault</h1>
                <p className="text-[11px] flex items-center gap-1" style={{ color: 'var(--text-tertiary)' }}>
                  Syllabus + Progress Tracker
                  {syncStatus === 'synced' && <span style={{ color: 'var(--green)' }}>{Icons.cloud}</span>}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-28">
                  <ProgressBar value={globalStats.done} max={globalStats.total} accent="#2563eb" size="sm" />
                </div>
                <span className="text-xs font-bold" style={{ color: 'var(--text-tertiary)' }}>{globalPct}%</span>
              </div>
              <button onClick={() => setSearchAll(!searchAll)} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-medium transition-all hover:shadow-md" style={{ background: searchAll ? 'rgba(37,99,235,0.08)' : 'var(--card)', border: `1.5px solid ${searchAll ? '#2563eb' : 'var(--border)'}`, color: searchAll ? '#2563eb' : 'var(--text-secondary)' }} title="Search across all exams">
                {Icons.globe}
                <span className="hidden sm:inline">All Exams</span>
              </button>
              <div className="relative">
                <button onClick={() => setShowResetMenu(!showResetMenu)} className="flex items-center gap-1 text-xs px-3 py-2 rounded-xl font-medium transition-all hover:shadow-md" style={{ background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--text-secondary)' }}>
                  {Icons.reset}
                </button>
                {showResetMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowResetMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 py-1.5 rounded-xl shadow-xl z-50 min-w-[180px]" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
                      <button onClick={() => { resetExam(activeExam); setShowResetMenu(false); }} className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-gray-50 transition-colors" style={{ color: 'var(--text-secondary)' }}>Reset this exam</button>
                      <button onClick={() => { resetAll(); setShowResetMenu(false); }} className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-red-50 transition-colors" style={{ color: 'var(--red)' }}>Reset all exams</button>
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-medium transition-all hover:shadow-md"
                style={{ background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--text-secondary)' }}
                title="Settings"
              >
                {Icons.settings}
              </button>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowProfile(true)} 
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  title="View Profile"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full ring-2 ring-white shadow-sm" />
                  ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-white shadow-sm" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: 'white' }}>
                      {user.displayName?.[0] || 'U'}
                    </div>
                  )}
                </button>
                <button onClick={handleSignOut} className="text-xs px-2 py-1 rounded-lg transition-all hover:bg-gray-100" style={{ color: 'var(--text-tertiary)' }} title="Sign out">
                  {Icons.logout}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            <button onClick={() => { setView('dashboard'); window.scrollTo(0, 0); }} className={`nav-item ${view === 'dashboard' ? 'active' : ''}`}>
              {Icons.home}
              <span>Dashboard</span>
            </button>
            <div className="w-px h-5" style={{ background: 'var(--border)' }} />
            <div className="flex items-center gap-1">
              {DATA.slice(0, 4).map(exam => (
                <button key={exam.id} onClick={() => navigateToExam(exam.id)} className={`nav-item ${view === 'exam' && activeExam === exam.id ? 'active' : ''}`} style={view === 'exam' && activeExam === exam.id ? { color: exam.accent } : {}}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: exam.accent }} />
                  <span className="text-xs">{exam.tag}</span>
                </button>
              ))}
            </div>
            <div className="w-px h-5" style={{ background: 'var(--border)' }} />
            <div className="flex items-center gap-1">
              <button onClick={() => { setView('formulas'); window.scrollTo(0, 0); }} className={`nav-item ${view === 'formulas' ? 'active' : ''}`} style={view === 'formulas' ? { color: '#7c3aed' } : {}}>
                {Icons.formula}
                <span>Formulas</span>
              </button>
              <button onClick={() => { setView('flashcards'); window.scrollTo(0, 0); }} className={`nav-item ${view === 'flashcards' ? 'active' : ''}`} style={view === 'flashcards' ? { color: '#f59e0b' } : {}}>
                {Icons.zap}
                <span>Flashcards</span>
              </button>
              <button onClick={() => { setView('random'); window.scrollTo(0, 0); }} className={`nav-item ${view === 'random' ? 'active' : ''}`} style={view === 'random' ? { color: '#ec4899' } : {}}>
                {Icons.lightbulb}
                <span>Random</span>
              </button>
            </div>
            <div className="w-px h-5" style={{ background: 'var(--border)' }} />
            <div className="flex items-center gap-1">
              <button onClick={() => { setView('ai-buddy'); window.scrollTo(0, 0); }} className={`nav-item ${view === 'ai-buddy' ? 'active' : ''}`} style={view === 'ai-buddy' ? { color: '#06b6d4' } : {}}>
                {Icons.brain}
                <span>AI Tutor</span>
              </button>
              <button onClick={() => { setView('ai-quiz'); window.scrollTo(0, 0); }} className={`nav-item ${view === 'ai-quiz' ? 'active' : ''}`} style={view === 'ai-quiz' ? { color: '#f59e0b' } : {}}>
                {Icons.target}
                <span>AI Quiz</span>
              </button>
              <button onClick={() => { setView('periodic-table'); window.scrollTo(0, 0); }} className={`nav-item ${view === 'periodic-table' ? 'active' : ''}`} style={view === 'periodic-table' ? { color: '#16a34a' } : {}}>
                {Icons.atom}
                <span>Periodic Table</span>
              </button>
              <button onClick={() => { setView('daily-mission'); window.scrollTo(0, 0); }} className={`nav-item ${view === 'daily-mission' ? 'active' : ''}`} style={view === 'daily-mission' ? { color: '#10b981' } : {}}>
                {Icons.clock}
                <span>Daily Mission</span>
              </button>
              <button onClick={() => { setView('goals'); window.scrollTo(0, 0); }} className={`nav-item ${view === 'goals' ? 'active' : ''}`} style={view === 'goals' ? { color: '#2563eb' } : {}}>
                {Icons.trophy}
                <span>Goals</span>
              </button>
              <button onClick={() => { setView('mistakes'); window.scrollTo(0, 0); }} className={`nav-item ${view === 'mistakes' ? 'active' : ''}`} style={view === 'mistakes' ? { color: '#dc2626' } : {}}>
                {Icons.book}
                <span>Mistake Book</span>
              </button>
              <button onClick={() => { setView('weekly-review'); window.scrollTo(0, 0); }} className={`nav-item ${view === 'weekly-review' ? 'active' : ''}`} style={view === 'weekly-review' ? { color: '#8b5cf6' } : {}}>
                {Icons.trending}
                <span>Weekly Review</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {view === 'exam' && (
        <div className="sticky top-[72px] z-40 no-print" style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
            <div className="relative max-w-2xl">
              <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }}>{Icons.search}</span>
              <label htmlFor="search-input" className="sr-only">Search chapters</label>
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchAll ? 'Search across all exams...' : `Search in ${currentExam.label}...`}
                className="w-full pl-11 pr-4 py-2.5 rounded-lg text-sm transition-all focus:ring-2 focus:ring-blue-500/20"
                style={{ background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
              />
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {view === 'dashboard' ? (
          <Dashboard done={done} onNavigate={navigateToExam} />
        ) : view === 'formulas' ? (
          <FormulaWall />
        ) : view === 'flashcards' ? (
          <Flashcards />
        ) : view === 'random' ? (
          <RandomConcepts />
        ) : view === 'ai-buddy' ? (
          <AIStudyBuddy />
        ) : view === 'ai-quiz' ? (
          <AIQuizGenerator />
        ) : view === 'periodic-table' ? (
          <PeriodicTable />
        ) : view === 'daily-mission' ? (
          <DailyMission done={done} onTaskComplete={(taskId) => {
            setToast({ message: 'Task completed! 🎉', type: 'success' });
          }} />
        ) : view === 'goals' ? (
          <GoalTracker done={done} quizScores={quizScores} />
        ) : view === 'mistakes' ? (
          <MistakeBook />
        ) : view === 'weekly-review' ? (
          <WeeklyReview done={done} quizScores={quizScores} mistakes={mistakes} />
        ) : searchAll && searchQuery ? (
          <div className="fade-in">
            <p className="text-sm mb-6" style={{ color: 'var(--text-tertiary)' }}>
              Found <strong style={{ color: 'var(--text)' }}>{DATA.reduce((acc, exam) => acc + exam.groups.reduce((a, g) => a + g.chapters.filter(ch => !ch.deletedChapter && matchesSearch(ch, searchQuery)).length, 0), 0)}</strong> results across all exams for "<strong style={{ color: 'var(--text)' }}>{searchQuery}</strong>"
            </p>
            <div className="chapter-grid">
              {DATA.flatMap(exam => exam.groups.flatMap(g => g.chapters.filter(ch => !ch.deletedChapter && matchesSearch(ch, searchQuery)).map(ch => ({ exam, subject: g.subject, chapter: ch }))))
                .map(({ exam, subject, chapter }) => {
                  const chId = getChapterId(exam.id, subject, chapter.name);
                  return <ChapterCard key={chId} chapter={chapter} examId={exam.id} subject={subject} accent={exam.accent} done={!!done[chId]} onToggleDone={() => toggleDone(chId)} expanded={false} onToggleExpand={() => {}} />;
                })}
            </div>
          </div>
        ) : (
          <ExamView
            exam={currentExam}
            done={done}
            onToggleDone={toggleDone}
            searchQuery={searchQuery}
          />
        )}
      </main>

      <footer className="no-print mt-12 py-8" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg2)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ 
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)'
              }}>
                <span style={{ color: 'white' }}>{Icons.book}</span>
              </div>
              <div>
                <div className="font-bold text-sm" style={{ color: 'var(--text)' }}>CatchUp Vault</div>
                <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Exam Prep Platform</div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs" style={{ color: 'var(--text-tertiary)' }}>
              <button onClick={() => setView('dashboard')} className="hover:text-blue-600 transition-colors">Dashboard</button>
              <button onClick={() => setView('formulas')} className="hover:text-blue-600 transition-colors">Formulas</button>
              <button onClick={() => setView('flashcards')} className="hover:text-blue-600 transition-colors">Flashcards</button>
              <button onClick={() => setView('ai-buddy')} className="hover:text-blue-600 transition-colors">AI Tutor</button>
            </div>

            <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              <p className="flex items-center gap-2">
                <span>Built with</span>
                <span style={{ color: '#ef4444' }}>❤️</span>
                <span>for students</span>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {showSettings && (
        <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      )}

      {showProfile && user && (
        <Profile 
          user={user} 
          onClose={() => setShowProfile(false)}
          onLogout={() => {
            setShowProfile(false);
            handleSignOut();
          }}
          showToast={showToast}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

// ─── Settings Modal ──────────────────────────────────────────────────────────
function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [selectedModel, setSelectedModel] = useState(localStorage.getItem('gemini_model') || getBestModel());
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!apiKey.trim()) {
      setStatus('error');
      setMessage('Please enter an API key');
      return;
    }

    const success = initializeAI(apiKey.trim(), selectedModel);
    if (success) {
      setStatus('success');
      setMessage('✅ AI configured successfully!');
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setMessage('');
      }, 1500);
    } else {
      setStatus('error');
      setMessage('❌ Failed to initialize AI. Please check your API key.');
    }
  };

  const handleClear = () => {
    localStorage.removeItem('gemini_api_key');
    localStorage.removeItem('gemini_model');
    setApiKey('');
    setStatus('idle');
    setMessage('API key cleared');
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="modal-content max-w-lg w-full rounded-2xl p-6 shadow-2xl" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <span style={{ color: 'white' }}>{Icons.settings}</span>
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Settings</h3>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Configure AI features</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" style={{ color: 'var(--text-tertiary)' }}>
            {Icons.x}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
              Gemini API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key..."
              className="w-full px-4 py-3 rounded-xl text-sm"
              style={{ background: 'var(--bg2)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
            />
            <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>
              Get your free API key at{' '}
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: '#6366f1' }}>
                aistudio.google.com
              </a>
            </p>
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
              AI Model
              <span className="text-xs font-normal" style={{ color: 'var(--text-tertiary)' }}>
                (Auto-selects best available)
              </span>
            </label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {GEMINI_MODELS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedModel(m.id)}
                  className="w-full text-left px-4 py-3 rounded-xl transition-all hover:shadow-md"
                  style={{
                    background: selectedModel === m.id ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg2)',
                    border: `1.5px solid ${selectedModel === m.id ? '#6366f1' : 'var(--border)'}`,
                    color: 'var(--text)'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-sm">{m.name}</div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{
                      background: m.tier === 'premium' ? 'rgba(124, 58, 237, 0.15)' : 'rgba(37, 99, 235, 0.15)',
                      color: m.tier === 'premium' ? '#7c3aed' : '#2563eb'
                    }}>
                      {m.tier === 'premium' ? '⭐ PREMIUM' : '⚡ FAST'}
                    </span>
                  </div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {message && (
            <div className="px-4 py-3 rounded-xl text-sm" style={{
              background: status === 'success' ? 'rgba(22, 163, 74, 0.1)' : status === 'error' ? 'rgba(220, 38, 38, 0.1)' : 'var(--bg2)',
              color: status === 'success' ? '#16a34a' : status === 'error' ? '#dc2626' : 'var(--text-tertiary)',
              border: `1px solid ${status === 'success' ? 'rgba(22, 163, 74, 0.2)' : status === 'error' ? 'rgba(220, 38, 38, 0.2)' : 'var(--border)'}`
            }}>
              {message}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-3 rounded-xl font-semibold text-sm transition-all hover:shadow-lg"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white' }}
            >
              Save Settings
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-3 rounded-xl font-semibold text-sm transition-all hover:shadow-md"
              style={{ background: 'var(--bg2)', border: '1.5px solid var(--border)', color: 'var(--text-secondary)' }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
