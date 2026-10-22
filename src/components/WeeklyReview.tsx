import { useState, useEffect } from 'react';
import { DATA } from '../data';
import type { WeeklyReview } from '../data';

interface WeeklyReviewProps {
  done: Record<string, boolean>;
  quizScores: Record<string, number>;
  mistakes: any[];
}

export function WeeklyReview({ done, quizScores, mistakes }: WeeklyReviewProps) {
  const [review, setReview] = useState<WeeklyReview | null>(null);

  useEffect(() => {
    generateWeeklyReview();
  }, [done, quizScores, mistakes]);

  const generateWeeklyReview = () => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const weekStartStr = weekStart.toISOString().split('T')[0];
    const weekEndStr = weekEnd.toISOString().split('T')[0];

    // Calculate tasks planned vs completed
    const tasksPlanned = 7 * 5; // Assume 5 tasks per day
    let tasksCompleted = 0;
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const storedTasks = localStorage.getItem(`catchup:dailyTasks:${dateStr}`);
      if (storedTasks) {
        const tasks = JSON.parse(storedTasks);
        tasksCompleted += tasks.filter((t: any) => t.completed).length;
      }
    }

    // Chapters learned this week
    const chaptersLearned: string[] = [];
    const chaptersRevised: string[] = [];
    
    Object.keys(done).forEach(chapterId => {
      const timestamp = localStorage.getItem(`catchup:activity:${chapterId}`);
      if (timestamp) {
        const activityDate = new Date(parseInt(timestamp));
        if (activityDate >= weekStart && activityDate <= weekEnd) {
          const parts = chapterId.split('|');
          if (parts.length === 3) {
            chaptersLearned.push(`${parts[1]}: ${parts[2]}`);
          }
        }
      }
    });

    // Mock tests taken
    const mockTestsTaken = Object.keys(quizScores).filter(key => {
      const date = key.split('-')[0];
      const testDate = new Date(date);
      return testDate >= weekStart && testDate <= weekEnd;
    }).length;

    // Average accuracy
    const scores = Object.values(quizScores);
    const averageAccuracy = scores.length > 0 
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

    // Weak subjects
    const subjectPerformance: Record<string, { correct: number; total: number }> = {};
    
    DATA.forEach(exam => {
      exam.groups.forEach(group => {
        const subjectKey = group.subject;
        if (!subjectPerformance[subjectKey]) {
          subjectPerformance[subjectKey] = { correct: 0, total: 0 };
        }
        
        group.chapters.forEach(chapter => {
          if (!chapter.deletedChapter) {
            subjectPerformance[subjectKey].total++;
            const chapterId = `${exam.id}|${group.subject}|${chapter.name}`;
            if (done[chapterId]) {
              subjectPerformance[subjectKey].correct++;
            }
          }
        });
      });
    });

    const weakSubjects = Object.entries(subjectPerformance)
      .filter(([, perf]) => perf.total > 0 && (perf.correct / perf.total) < 0.5)
      .map(([subject]) => subject);

    // Recurring mistakes
    const recentMistakes = mistakes.filter(m => {
      const mistakeDate = new Date(m.date);
      return mistakeDate >= weekStart && mistakeDate <= weekEnd;
    });

    const mistakeCategories: Record<string, number> = {};
    recentMistakes.forEach(m => {
      mistakeCategories[m.category] = (mistakeCategories[m.category] || 0) + 1;
    });

    const recurringMistakes = Object.entries(mistakeCategories)
      .filter(([, count]) => count >= 2)
      .map(([category]) => category);

    // Revision backlog
    const revisionBacklog: string[] = [];
    DATA.forEach(exam => {
      exam.groups.forEach(group => {
        group.chapters.forEach(chapter => {
          if (!chapter.deletedChapter) {
            const chapterId = `${exam.id}|${group.subject}|${chapter.name}`;
            if (!done[chapterId] && chapter.weightage.toLowerCase().includes('high')) {
              revisionBacklog.push(`${group.subject}: ${chapter.name}`);
            }
          }
        });
      });
    });

    // Next week priorities
    const nextWeekPriorities = revisionBacklog.slice(0, 5);

    const weeklyReview: WeeklyReview = {
      id: `review-${weekStartStr}`,
      weekStart: weekStartStr,
      weekEnd: weekEndStr,
      tasksPlanned,
      tasksCompleted,
      chaptersLearned,
      chaptersRevised,
      mockTestsTaken,
      averageAccuracy,
      weakSubjects,
      recurringMistakes,
      revisionBacklog: revisionBacklog.slice(0, 10),
      nextWeekPriorities
    };

    setReview(weeklyReview);
  };

  if (!review) {
    return (
      <div className="text-center py-12">
        <p className="text-lg font-semibold" style={{ color: 'var(--text-tertiary)' }}>
          Loading weekly review...
        </p>
      </div>
    );
  }

  const taskCompletionRate = review.tasksPlanned > 0 
    ? Math.round((review.tasksCompleted / review.tasksPlanned) * 100)
    : 0;

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>Weekly Review</h2>
        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
          {new Date(review.weekStart).toLocaleDateString()} - {new Date(review.weekEnd).toLocaleDateString()}
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
          <div className="text-2xl font-bold mb-1" style={{ color: 'var(--accent)' }}>
            {taskCompletionRate}%
          </div>
          <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Task Completion
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
            {review.tasksCompleted}/{review.tasksPlanned}
          </div>
        </div>

        <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
          <div className="text-2xl font-bold mb-1" style={{ color: '#16a34a' }}>
            {review.chaptersLearned.length}
          </div>
          <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Chapters Learned
          </div>
        </div>

        <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
          <div className="text-2xl font-bold mb-1" style={{ color: '#f59e0b' }}>
            {review.mockTestsTaken}
          </div>
          <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Mock Tests
          </div>
        </div>

        <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
          <div className="text-2xl font-bold mb-1" style={{ color: '#8b5cf6' }}>
            {review.averageAccuracy}%
          </div>
          <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Avg Accuracy
          </div>
        </div>
      </div>

      {/* Chapters Learned */}
      {review.chaptersLearned.length > 0 && (
        <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
          <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>
            📚 Chapters Learned This Week
          </h3>
          <div className="flex flex-wrap gap-2">
            {review.chaptersLearned.map((chapter, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg text-xs font-medium"
                style={{ background: 'rgba(22, 163, 74, 0.1)', color: '#16a34a', border: '1px solid rgba(22, 163, 74, 0.2)' }}
              >
                {chapter}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Weak Subjects */}
      {review.weakSubjects.length > 0 && (
        <div className="rounded-2xl p-6 mb-6" style={{ background: 'rgba(220, 38, 38, 0.05)', border: '1px solid rgba(220, 38, 38, 0.2)' }}>
          <h3 className="text-lg font-bold mb-3" style={{ color: '#dc2626' }}>
            ⚠️ Weak Subjects
          </h3>
          <div className="flex flex-wrap gap-2">
            {review.weakSubjects.map((subject, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg text-xs font-medium"
                style={{ background: 'rgba(220, 38, 38, 0.1)', color: '#dc2626' }}
              >
                {subject}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recurring Mistakes */}
      {review.recurringMistakes.length > 0 && (
        <div className="rounded-2xl p-6 mb-6" style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
          <h3 className="text-lg font-bold mb-3" style={{ color: '#f59e0b' }}>
            🔄 Recurring Mistakes
          </h3>
          <div className="flex flex-wrap gap-2">
            {review.recurringMistakes.map((mistake, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg text-xs font-medium"
                style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}
              >
                {mistake}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Revision Backlog */}
      {review.revisionBacklog.length > 0 && (
        <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
          <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>
            📋 Revision Backlog
          </h3>
          <div className="space-y-2">
            {review.revisionBacklog.slice(0, 5).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#f59e0b' }} />
                {item}
              </div>
            ))}
            {review.revisionBacklog.length > 5 && (
              <div className="text-xs" style={{ color: 'var(--muted)' }}>
                + {review.revisionBacklog.length - 5} more
              </div>
            )}
          </div>
        </div>
      )}

      {/* Next Week Priorities */}
      {review.nextWeekPriorities.length > 0 && (
        <div className="rounded-2xl p-6" style={{ background: 'rgba(37, 99, 235, 0.05)', border: '1px solid rgba(37, 99, 235, 0.2)' }}>
          <h3 className="text-lg font-bold mb-3" style={{ color: '#2563eb' }}>
            🎯 Next Week Priorities
          </h3>
          <div className="space-y-2">
            {review.nextWeekPriorities.map((priority, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text)' }}>
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: '#2563eb', color: 'white' }}>
                  {idx + 1}
                </span>
                {priority}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
