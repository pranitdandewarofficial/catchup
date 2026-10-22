import { useState, useEffect } from 'react';
import { DATA } from '../data';
import type { DailyTask, TaskType, TaskPriority } from '../data';

interface DailyMissionProps {
  done: Record<string, boolean>;
  onTaskComplete: (taskId: string) => void;
}

export function DailyMission({ done, onTaskComplete }: DailyMissionProps) {
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [studyHours, setStudyHours] = useState(6); // Default 6 hours

  useEffect(() => {
    generateDailyTasks();
  }, [studyHours, done]);

  const generateDailyTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    const storedTasks = localStorage.getItem(`catchup:dailyTasks:${today}`);
    
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
      return;
    }

    // Generate tasks based on weak areas and priorities
    const newTasks: DailyTask[] = [];
    const weakAreas = identifyWeakAreas();
    
    // Must Do tasks (60% of time)
    const mustDoMinutes = Math.floor(studyHours * 60 * 0.6);
    const mustDoTasks = generateTasksForTime(weakAreas, 'mustDo', mustDoMinutes);
    newTasks.push(...mustDoTasks);

    // Should Do tasks (30% of time)
    const shouldDoMinutes = Math.floor(studyHours * 60 * 0.3);
    const shouldDoTasks = generateTasksForTime(weakAreas, 'shouldDo', shouldDoMinutes);
    newTasks.push(...shouldDoTasks);

    // Bonus tasks (10% of time)
    const bonusMinutes = Math.floor(studyHours * 60 * 0.1);
    const bonusTasks = generateTasksForTime(weakAreas, 'bonus', bonusMinutes);
    newTasks.push(...bonusTasks);

    setTasks(newTasks);
    localStorage.setItem(`catchup:dailyTasks:${today}`, JSON.stringify(newTasks));
  };

  const identifyWeakAreas = () => {
    const weakAreas: { subject: string; chapter: string; priority: number }[] = [];
    
    DATA.forEach(exam => {
      exam.groups.forEach(group => {
        group.chapters.forEach(chapter => {
          if (chapter.deletedChapter) return;
          
          const chapterId = `${exam.id}|${group.subject}|${chapter.name}`;
          const isCompleted = done[chapterId];
          const weightage = chapter.weightage.toLowerCase();
          
          let priority = 1;
          if (weightage.includes('very high')) priority = 4;
          else if (weightage.includes('high')) priority = 3;
          else if (weightage.includes('medium')) priority = 2;
          
          if (!isCompleted) {
            weakAreas.push({
              subject: group.subject,
              chapter: chapter.name,
              priority
            });
          }
        });
      });
    });
    
    return weakAreas.sort((a, b) => b.priority - a.priority);
  };

  const generateTasksForTime = (
    weakAreas: { subject: string; chapter: string; priority: number }[],
    priority: TaskPriority,
    totalMinutes: number
  ): DailyTask[] => {
    const tasks: DailyTask[] = [];
    const today = new Date().toISOString().split('T')[0];
    let remainingMinutes = totalMinutes;
    let areaIndex = 0;

    const taskTypes: TaskType[] = ['conceptStudy', 'problemPractice', 'revision'];
    
    while (remainingMinutes > 0 && areaIndex < weakAreas.length) {
      const area = weakAreas[areaIndex];
      const taskType = taskTypes[tasks.length % taskTypes.length];
      const duration = Math.min(45, remainingMinutes); // Max 45 min per task
      
      tasks.push({
        id: `task-${today}-${tasks.length}`,
        date: today,
        subject: area.subject,
        chapter: area.chapter,
        type: taskType,
        priority,
        title: getTaskTitle(taskType, area.chapter),
        description: getTaskDescription(taskType, area.subject),
        estimatedMinutes: duration,
        completed: false,
        carriedForward: false
      });
      
      remainingMinutes -= duration;
      areaIndex++;
    }

    return tasks;
  };

  const getTaskTitle = (type: TaskType, chapter: string): string => {
    switch (type) {
      case 'lecture': return `Watch lecture: ${chapter}`;
      case 'conceptStudy': return `Study concepts: ${chapter}`;
      case 'problemPractice': return `Practice problems: ${chapter}`;
      case 'revision': return `Revise: ${chapter}`;
      case 'mockTest': return `Take mock test: ${chapter}`;
      case 'writtenAnswer': return `Practice written answers: ${chapter}`;
    }
  };

  const getTaskDescription = (type: TaskType, subject: string): string => {
    switch (type) {
      case 'lecture': return `Watch video lecture on ${subject} concepts`;
      case 'conceptStudy': return `Read and understand key concepts from textbook`;
      case 'problemPractice': return `Solve 10-15 problems from this chapter`;
      case 'revision': return `Review formulas, key concepts, and solved examples`;
      case 'mockTest': return `Take timed practice test (30 minutes)`;
      case 'writtenAnswer': return `Practice writing detailed answers for board exam`;
    }
  };

  const handleTaskToggle = (taskId: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const completed = !task.completed;
        return {
          ...task,
          completed,
          completedAt: completed ? new Date().toISOString() : undefined
        };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`catchup:dailyTasks:${today}`, JSON.stringify(updatedTasks));
    
    if (updatedTasks.find(t => t.id === taskId)?.completed) {
      onTaskComplete(taskId);
    }
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const mustDoTasks = tasks.filter(t => t.priority === 'mustDo');
  const shouldDoTasks = tasks.filter(t => t.priority === 'shouldDo');
  const bonusTasks = tasks.filter(t => t.priority === 'bonus');

  return (
    <div className="fade-in">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Daily Mission</h2>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Study Hours:
            </label>
            <select
              value={studyHours}
              onChange={(e) => setStudyHours(Number(e.target.value))}
              className="px-3 py-2 rounded-lg text-sm"
              style={{ background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
            >
              {[2, 3, 4, 5, 6, 7, 8, 10, 12].map(h => (
                <option key={h} value={h}>{h} hours</option>
              ))}
            </select>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="rounded-2xl p-4 mb-6" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
              Daily Progress
            </span>
            <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
              {completedTasks}/{totalTasks} tasks • {completionPercentage}%
            </span>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'var(--bg2)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${completionPercentage}%`,
                background: 'linear-gradient(90deg, #10b981, #059669)'
              }}
            />
          </div>
        </div>
      </div>

      {/* Must Do Tasks */}
      {mustDoTasks.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <span className="w-2 h-2 rounded-full" style={{ background: '#dc2626' }} />
            Must Do ({mustDoTasks.filter(t => t.completed).length}/{mustDoTasks.length})
          </h3>
          <div className="space-y-2">
            {mustDoTasks.map(task => (
              <TaskCard key={task.id} task={task} onToggle={handleTaskToggle} />
            ))}
          </div>
        </div>
      )}

      {/* Should Do Tasks */}
      {shouldDoTasks.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <span className="w-2 h-2 rounded-full" style={{ background: '#f59e0b' }} />
            Should Do ({shouldDoTasks.filter(t => t.completed).length}/{shouldDoTasks.length})
          </h3>
          <div className="space-y-2">
            {shouldDoTasks.map(task => (
              <TaskCard key={task.id} task={task} onToggle={handleTaskToggle} />
            ))}
          </div>
        </div>
      )}

      {/* Bonus Tasks */}
      {bonusTasks.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <span className="w-2 h-2 rounded-full" style={{ background: '#10b981' }} />
            Bonus ({bonusTasks.filter(t => t.completed).length}/{bonusTasks.length})
          </h3>
          <div className="space-y-2">
            {bonusTasks.map(task => (
              <TaskCard key={task.id} task={task} onToggle={handleTaskToggle} />
            ))}
          </div>
        </div>
      )}

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg font-semibold mb-2" style={{ color: 'var(--text-tertiary)' }}>
            All tasks completed! 🎉
          </p>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Great work today. Consider increasing study hours for more tasks.
          </p>
        </div>
      )}
    </div>
  );
}

function TaskCard({ task, onToggle }: { task: DailyTask; onToggle: (id: string) => void }) {
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'mustDo': return '#dc2626';
      case 'shouldDo': return '#f59e0b';
      case 'bonus': return '#10b981';
    }
  };

  const getTypeIcon = (type: TaskType) => {
    switch (type) {
      case 'lecture': return '🎥';
      case 'conceptStudy': return '📖';
      case 'problemPractice': return '✍️';
      case 'revision': return '🔄';
      case 'mockTest': return '📝';
      case 'writtenAnswer': return '📄';
    }
  };

  return (
    <div
      className="rounded-xl p-4 transition-all hover:shadow-md"
      style={{
        background: task.completed ? 'rgba(16, 185, 129, 0.05)' : 'var(--card)',
        border: `1.5px solid ${task.completed ? 'rgba(16, 185, 129, 0.3)' : 'var(--border)'}`,
        opacity: task.completed ? 0.7 : 1
      }}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="mt-1 w-5 h-5 rounded cursor-pointer"
          style={{ accentColor: getPriorityColor(task.priority) }}
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{getTypeIcon(task.type)}</span>
            <h4 className="font-semibold text-sm" style={{ 
              color: task.completed ? 'var(--text-tertiary)' : 'var(--text)',
              textDecoration: task.completed ? 'line-through' : 'none'
            }}>
              {task.title}
            </h4>
          </div>
          <p className="text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}>
            {task.description}
          </p>
          <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-tertiary)' }}>
            <span>{task.subject}</span>
            {task.chapter && <span>• {task.chapter}</span>}
            <span>• {task.estimatedMinutes} min</span>
          </div>
        </div>
      </div>
    </div>
  );
}
