import { useState, useEffect } from 'react';
import { DATA } from '../data';
import type { Goal, GoalMilestone } from '../data';

interface GoalTrackerProps {
  done: Record<string, boolean>;
  quizScores: Record<string, number>;
}

export function GoalTracker({ done, quizScores }: GoalTrackerProps) {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    initializeGoals();
  }, []);

  useEffect(() => {
    updateGoalProgress();
  }, [done, quizScores]);

  const initializeGoals = () => {
    const storedGoals = localStorage.getItem('catchup:goals');
    
    if (storedGoals) {
      setGoals(JSON.parse(storedGoals));
      return;
    }

    const newGoals: Goal[] = [
      {
        id: 'iit-bombay-cse',
        type: 'iitBombayCSE',
        title: 'IIT Bombay CSE',
        description: 'Crack JEE Advanced and secure CSE branch at IIT Bombay',
        progress: 0,
        milestones: [
          {
            id: 'milestone-1',
            title: 'Complete 50% JEE Syllabus',
            completed: false,
            metrics: { jeeProgress: 50 }
          },
          {
            id: 'milestone-2',
            title: 'Score 90%+ in JEE Main Mock Tests',
            completed: false,
            metrics: { jeeMainMockScore: 90 }
          },
          {
            id: 'milestone-3',
            title: 'Complete 100% JEE Syllabus',
            completed: false,
            metrics: { jeeProgress: 100 }
          },
          {
            id: 'milestone-4',
            title: 'Score 85%+ in JEE Advanced Mock Tests',
            completed: false,
            metrics: { jeeAdvancedMockScore: 85 }
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'hsc-95-plus',
        type: 'hsc95Plus',
        title: 'Maharashtra HSC 95%+',
        description: 'Score 95% or above in Maharashtra HSC Class 12 Board Exams',
        progress: 0,
        milestones: [
          {
            id: 'milestone-1',
            title: 'Complete 50% HSC Syllabus',
            completed: false,
            metrics: { hscProgress: 50 }
          },
          {
            id: 'milestone-2',
            title: 'Score 90%+ in HSC Mock Tests',
            completed: false,
            metrics: { hscMockScore: 90 }
          },
          {
            id: 'milestone-3',
            title: 'Complete 100% HSC Syllabus',
            completed: false,
            metrics: { hscProgress: 100 }
          },
          {
            id: 'milestone-4',
            title: 'Score 95%+ in HSC Mock Tests',
            completed: false,
            metrics: { hscMockScore: 95 }
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    setGoals(newGoals);
    localStorage.setItem('catchup:goals', JSON.stringify(newGoals));
  };

  const updateGoalProgress = () => {
    const updatedGoals = goals.map(goal => {
      if (goal.type === 'iitBombayCSE') {
        return updateIITGoal(goal);
      } else if (goal.type === 'hsc95Plus') {
        return updateHSCGoal(goal);
      }
      return goal;
    });

    setGoals(updatedGoals);
    localStorage.setItem('catchup:goals', JSON.stringify(updatedGoals));
  };

  const updateIITGoal = (goal: Goal): Goal => {
    const jeeExam = DATA.find(e => e.id === 'jee');
    if (!jeeExam) return goal;

    let totalChapters = 0;
    let completedChapters = 0;

    jeeExam.groups.forEach(group => {
      group.chapters.forEach(chapter => {
        if (!chapter.deletedChapter) {
          totalChapters++;
          const chapterId = `jee|${group.subject}|${chapter.name}`;
          if (done[chapterId]) {
            completedChapters++;
          }
        }
      });
    });

    const progress = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

    const updatedMilestones = goal.milestones.map(milestone => {
      if (milestone.metrics.jeeProgress !== undefined) {
        const completed = progress >= milestone.metrics.jeeProgress;
        return {
          ...milestone,
          completed,
          completedAt: completed && !milestone.completed ? new Date().toISOString() : milestone.completedAt
        };
      }
      if (milestone.metrics.jeeMainMockScore !== undefined) {
        const avgScore = calculateAverageScore('jee');
        const completed = avgScore >= milestone.metrics.jeeMainMockScore;
        return {
          ...milestone,
          completed,
          completedAt: completed && !milestone.completed ? new Date().toISOString() : milestone.completedAt
        };
      }
      if (milestone.metrics.jeeAdvancedMockScore !== undefined) {
        const avgScore = calculateAverageScore('jee');
        const completed = avgScore >= milestone.metrics.jeeAdvancedMockScore;
        return {
          ...milestone,
          completed,
          completedAt: completed && !milestone.completed ? new Date().toISOString() : milestone.completedAt
        };
      }
      return milestone;
    });

    return {
      ...goal,
      progress,
      milestones: updatedMilestones,
      updatedAt: new Date().toISOString()
    };
  };

  const updateHSCGoal = (goal: Goal): Goal => {
    const hscExams = DATA.filter(e => e.id.startsWith('hsc-') && e.id !== 'hsc-cs1' && e.id !== 'hsc-cs2');
    
    let totalChapters = 0;
    let completedChapters = 0;

    hscExams.forEach(exam => {
      exam.groups.forEach(group => {
        group.chapters.forEach(chapter => {
          if (!chapter.deletedChapter) {
            totalChapters++;
            const chapterId = `${exam.id}|${group.subject}|${chapter.name}`;
            if (done[chapterId]) {
              completedChapters++;
            }
          }
        });
      });
    });

    const progress = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

    const updatedMilestones = goal.milestones.map(milestone => {
      if (milestone.metrics.hscProgress !== undefined) {
        const completed = progress >= milestone.metrics.hscProgress;
        return {
          ...milestone,
          completed,
          completedAt: completed && !milestone.completed ? new Date().toISOString() : milestone.completedAt
        };
      }
      if (milestone.metrics.hscMockScore !== undefined) {
        const avgScore = calculateAverageScore('hsc');
        const completed = avgScore >= milestone.metrics.hscMockScore;
        return {
          ...milestone,
          completed,
          completedAt: completed && !milestone.completed ? new Date().toISOString() : milestone.completedAt
        };
      }
      return milestone;
    });

    return {
      ...goal,
      progress,
      milestones: updatedMilestones,
      updatedAt: new Date().toISOString()
    };
  };

  const calculateAverageScore = (examType: 'jee' | 'hsc'): number => {
    const relevantScores = Object.entries(quizScores)
      .filter(([key]) => key.startsWith(examType))
      .map(([, score]) => score);

    if (relevantScores.length === 0) return 0;
    return Math.round(relevantScores.reduce((a, b) => a + b, 0) / relevantScores.length);
  };

  const getWeakTopics = (examType: 'jee' | 'hsc'): string[] => {
    const weakTopics: string[] = [];
    const exams = examType === 'jee' 
      ? DATA.filter(e => e.id === 'jee')
      : DATA.filter(e => e.id.startsWith('hsc-') && e.id !== 'hsc-cs1' && e.id !== 'hsc-cs2');

    exams.forEach(exam => {
      exam.groups.forEach(group => {
        group.chapters.forEach(chapter => {
          if (!chapter.deletedChapter) {
            const chapterId = `${exam.id}|${group.subject}|${chapter.name}`;
            if (!done[chapterId] && chapter.weightage.toLowerCase().includes('high')) {
              weakTopics.push(`${group.subject}: ${chapter.name}`);
            }
          }
        });
      });
    });

    return weakTopics.slice(0, 5); // Top 5 weak topics
  };

  return (
    <div className="fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>Goal Tracker</h2>
        <p className="text-base" style={{ color: 'var(--text-tertiary)' }}>
          Track your progress towards your dream goals
        </p>
      </div>

      <div className="space-y-6">
        {goals.map(goal => (
          <GoalCard key={goal.id} goal={goal} weakTopics={getWeakTopics(goal.type === 'iitBombayCSE' ? 'jee' : 'hsc')} />
        ))}
      </div>
    </div>
  );
}

function GoalCard({ goal, weakTopics }: { goal: Goal; weakTopics: string[] }) {
  const getGoalColor = (type: string) => {
    return type === 'iitBombayCSE' ? '#2563eb' : '#ea580c';
  };

  const getGoalIcon = (type: string) => {
    return type === 'iitBombayCSE' ? '🎓' : '🏆';
  };

  const completedMilestones = goal.milestones.filter(m => m.completed).length;
  const totalMilestones = goal.milestones.length;

  return (
    <div className="rounded-2xl p-6" style={{ 
      background: 'var(--card)', 
      border: `1.5px solid ${getGoalColor(goal.type)}30` 
    }}>
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl" style={{ 
          background: `${getGoalColor(goal.type)}15` 
        }}>
          {getGoalIcon(goal.type)}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--text)' }}>{goal.title}</h3>
          <p className="text-sm mb-3" style={{ color: 'var(--text-tertiary)' }}>{goal.description}</p>
          
          {/* Progress Bar */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                Overall Progress
              </span>
              <span className="text-xs font-bold" style={{ color: getGoalColor(goal.type) }}>
                {goal.progress}%
              </span>
            </div>
            <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'var(--bg2)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${goal.progress}%`,
                  background: `linear-gradient(90deg, ${getGoalColor(goal.type)}, ${getGoalColor(goal.type)}dd)`
                }}
              />
            </div>
          </div>

          <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            {completedMilestones}/{totalMilestones} milestones completed
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="space-y-2 mb-4">
        {goal.milestones.map((milestone, idx) => (
          <div
            key={milestone.id}
            className="flex items-center gap-3 p-3 rounded-lg"
            style={{
              background: milestone.completed ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg2)',
              border: `1px solid ${milestone.completed ? 'rgba(16, 185, 129, 0.2)' : 'var(--border)'}`
            }}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: milestone.completed ? '#16a34a' : 'var(--card)',
                color: milestone.completed ? 'white' : 'var(--text-tertiary)',
                border: `2px solid ${milestone.completed ? '#16a34a' : 'var(--border)'}`
              }}
            >
              {milestone.completed ? '✓' : idx + 1}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium" style={{ 
                color: milestone.completed ? 'var(--text-tertiary)' : 'var(--text)',
                textDecoration: milestone.completed ? 'line-through' : 'none'
              }}>
                {milestone.title}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Weak Topics */}
      {weakTopics.length > 0 && (
        <div className="p-4 rounded-lg" style={{ background: 'rgba(220, 38, 38, 0.05)', border: '1px solid rgba(220, 38, 38, 0.2)' }}>
          <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#dc2626' }}>
            ⚠️ Focus Areas
          </div>
          <ul className="space-y-1">
            {weakTopics.map((topic, idx) => (
              <li key={idx} className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                • {topic}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
