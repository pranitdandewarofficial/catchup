import { useState, useEffect } from 'react';
import { auth, signInWithGoogle, signOutUser } from './firebase';
import { Profile } from './components/Profile';
import { Onboarding } from './components/Onboarding';
import { DATA } from './data';
import { FORMULAS } from './formulas';

// Icons
const Icons = {
  book: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>,
  graduationCap: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  award: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
  clock: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  calculator: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>,
  zap: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  lightbulb: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>,
  brain: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/></svg>,
  target: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  atom: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z"/><path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z"/></svg>,
  settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
  logout: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  trending: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  check: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>,
  fire: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>,
  cloud: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>,
  formula: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16"/><path d="M4 12h10"/><path d="M4 20h16"/><circle cx="18" cy="12" r="2"/></svg>,
};

// Helper functions
function countChapters(exam: any): { total: number; active: number } {
  let total = 0, active = 0;
  for (const g of exam.groups) {
    for (const ch of g.chapters) {
      total++;
      if (!ch.deletedChapter) active++;
    }
  }
  return { total, active };
}

function countDone(exam: any, done: Record<string, boolean>): number {
  let count = 0;
  for (const g of exam.groups) {
    for (const ch of g.chapters) {
      if (!ch.deletedChapter && done[`${exam.id}|${g.subject}|${ch.name}`]) count++;
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

function getStreak(done: Record<string, boolean>): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let streak = 0;
  const checkDate = new Date(today);
  
  while (true) {
    const dateStr = checkDate.toISOString().split('T')[0];
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

function ProgressBar({ value, max, accent, size = 'md' }: { value: number; max: number; accent: string; size?: 'sm' | 'md' }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  const h = size === 'sm' ? 'h-2' : 'h-3';
  return (
    <div className={`w-full ${h} rounded-full overflow-hidden`} style={{ background: '#f1f5f9' }}>
      <div className={`progress-fill ${h} rounded-full`} style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${accent}, ${accent}dd)` }} />
    </div>
  );
}

// Dashboard Component
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

      {/* Stats Grid */}
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

      {/* My Goals Section */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text)' }}>My Goals</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {/* IIT Bombay CSE Goal */}
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

          {/* Maharashtra HSC 95%+ Goal */}
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

        {/* Daily Mission */}
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

      {/* Exam Cards */}
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

          {/* Formula Wall Card */}
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

          {/* Flashcards Card */}
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

          {/* Random Concepts Card */}
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

          {/* AI Study Buddy Card */}
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

          {/* AI Quiz Generator Card */}
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

      {/* Quick Tips */}
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

// Main App Component
export default function App() {
  const [user, setUser] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [view, setView] = useState<string>('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
      if (u) {
        // Load progress from localStorage
        const saved = localStorage.getItem('catchup:syllabus:v2:done');
        if (saved) {
          try {
            setDone(JSON.parse(saved));
          } catch (e) {
            console.error('Failed to parse saved progress:', e);
          }
        }
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const onboardingCompleted = localStorage.getItem('catchup:onboarding:completed');
    if (!onboardingCompleted && user) {
      setShowOnboarding(true);
    }
  }, [user]);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      showToast('Signed in successfully!', 'success');
    } catch (error: any) {
      showToast(`Sign-in failed: ${error.message}`, 'error');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      showToast('Signed out successfully', 'info');
    } catch (error: any) {
      showToast(`Sign-out failed: ${error.message}`, 'error');
    }
  };

  const navigateToExam = (examId: string) => {
    setView(examId);
    window.scrollTo(0, 0);
  };

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
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
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
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Onboarding */}
      {showOnboarding && (
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      )}

      {/* Header */}
      <header className="sticky top-0 z-50" style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
                <span style={{ color: 'white' }}>{Icons.book}</span>
              </div>
              <div>
                <h1 className="text-sm font-bold" style={{ color: 'var(--text)' }}>CatchUp Vault</h1>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Exam Prep Platform</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowProfile(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: 'white' }}>
                    {user.displayName?.[0] || 'U'}
                  </div>
                )}
              </button>
              <button
                onClick={handleSignOut}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Sign out"
              >
                {Icons.logout}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="sticky top-[60px] z-40" style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 overflow-x-auto py-2">
            <button
              onClick={() => setView('dashboard')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                view === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Dashboard
            </button>
            {DATA.map(exam => (
              <button
                key={exam.id}
                onClick={() => setView(exam.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  view === exam.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {exam.tag}
              </button>
            ))}
            <button
              onClick={() => setView('formulas')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                view === 'formulas' ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Formulas
            </button>
            <button
              onClick={() => setView('flashcards')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                view === 'flashcards' ? 'bg-amber-50 text-amber-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Flashcards
            </button>
            <button
              onClick={() => setView('random')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                view === 'random' ? 'bg-pink-50 text-pink-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Random
            </button>
            <button
              onClick={() => setView('ai-buddy')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                view === 'ai-buddy' ? 'bg-cyan-50 text-cyan-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              AI Tutor
            </button>
            <button
              onClick={() => setView('ai-quiz')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                view === 'ai-quiz' ? 'bg-orange-50 text-orange-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              AI Quiz
            </button>
            <button
              onClick={() => setView('periodic-table')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                view === 'periodic-table' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Periodic Table
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {view === 'dashboard' && <Dashboard done={done} onNavigate={navigateToExam} />}
        {view === 'formulas' && <div>Formula Wall - Coming Soon</div>}
        {view === 'flashcards' && <div>Flashcards - Coming Soon</div>}
        {view === 'random' && <div>Random Concepts - Coming Soon</div>}
        {view === 'ai-buddy' && <div>AI Tutor - Coming Soon</div>}
        {view === 'ai-quiz' && <div>AI Quiz - Coming Soon</div>}
        {view === 'periodic-table' && <div>Periodic Table - Coming Soon</div>}
        {DATA.find(e => e.id === view) && <div>Exam View for {view} - Coming Soon</div>}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-8" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg2)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
                  <span style={{ color: 'white' }}>{Icons.book}</span>
                </div>
                <div>
                  <div className="font-bold text-sm" style={{ color: 'var(--text)' }}>CatchUp Vault</div>
                  <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Your Exam Prep Companion</div>
                </div>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                Track syllabus, master concepts with 3000+ formulas, and get AI-powered tutoring for JEE, HSC, and more.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-xs mb-3 uppercase tracking-wide" style={{ color: 'var(--text)' }}>Quick Links</h4>
              <ul className="space-y-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                <li><button onClick={() => setView('dashboard')} className="hover:text-blue-600 transition-colors">Dashboard</button></li>
                <li><button onClick={() => setView('formulas')} className="hover:text-blue-600 transition-colors">Formula Wall</button></li>
                <li><button onClick={() => setView('flashcards')} className="hover:text-blue-600 transition-colors">Flashcards</button></li>
                <li><button onClick={() => setView('ai-buddy')} className="hover:text-blue-600 transition-colors">AI Tutor</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-xs mb-3 uppercase tracking-wide" style={{ color: 'var(--text)' }}>Support</h4>
              <ul className="space-y-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                <li><button onClick={() => setShowProfile(true)} className="hover:text-blue-600 transition-colors">Settings</button></li>
                <li><button onClick={() => setShowProfile(true)} className="hover:text-blue-600 transition-colors">Profile</button></li>
                <li><a href="mailto:support@catchupvault.com" className="hover:text-blue-600 transition-colors">Help & Feedback</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              <p className="flex items-center gap-2">
                <span>© 2026 CatchUp Vault. Built with</span>
                <span style={{ color: '#ef4444' }}>❤️</span>
                <span>for students.</span>
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-tertiary)' }}>
              <span className="flex items-center gap-1">
                <span style={{ color: 'var(--green)' }}>{Icons.cloud}</span>
                <span>Cloud Synced</span>
              </span>
              <span>•</span>
              <span>{countAllDone(done).done}/{countAllDone(done).total} chapters completed</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Profile Modal */}
      {showProfile && (
        <Profile
          user={user}
          onClose={() => setShowProfile(false)}
          onLogout={handleSignOut}
          showToast={showToast}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-in">
          <div className={`px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 ${
            toast.type === 'success' ? 'bg-green-500' :
            toast.type === 'error' ? 'bg-red-500' :
            'bg-blue-500'
          } text-white`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
