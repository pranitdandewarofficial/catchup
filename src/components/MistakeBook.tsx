import { useState, useEffect } from 'react';
import type { Mistake, MistakeCategory } from '../data';

interface MistakeBookProps {
  subject?: string;
}

export function MistakeBook({ subject }: MistakeBookProps) {
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [filter, setFilter] = useState<'all' | 'unreviewed' | 'reviewed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<MistakeCategory | 'all'>('all');

  useEffect(() => {
    loadMistakes();
  }, [subject]);

  const loadMistakes = () => {
    const stored = localStorage.getItem('catchup:mistakes');
    if (stored) {
      let parsed: Mistake[] = JSON.parse(stored);
      if (subject) {
        parsed = parsed.filter(m => m.subject === subject);
      }
      setMistakes(parsed);
    }
  };

  const addMistake = (mistake: Omit<Mistake, 'id' | 'reviewed' | 'reviewCount'>) => {
    const newMistake: Mistake = {
      ...mistake,
      id: `mistake-${Date.now()}`,
      reviewed: false,
      reviewCount: 0
    };
    
    const updated = [...mistakes, newMistake];
    setMistakes(updated);
    localStorage.setItem('catchup:mistakes', JSON.stringify(updated));
  };

  const markAsReviewed = (mistakeId: string) => {
    const updated = mistakes.map(m => {
      if (m.id === mistakeId) {
        return {
          ...m,
          reviewed: true,
          reviewCount: m.reviewCount + 1,
          lastReviewed: new Date().toISOString()
        };
      }
      return m;
    });
    
    setMistakes(updated);
    localStorage.setItem('catchup:mistakes', JSON.stringify(updated));
  };

  const deleteMistake = (mistakeId: string) => {
    const updated = mistakes.filter(m => m.id !== mistakeId);
    setMistakes(updated);
    localStorage.setItem('catchup:mistakes', JSON.stringify(updated));
  };

  const filteredMistakes = mistakes.filter(m => {
    if (filter === 'unreviewed' && m.reviewed) return false;
    if (filter === 'reviewed' && !m.reviewed) return false;
    if (categoryFilter !== 'all' && m.category !== categoryFilter) return false;
    return true;
  });

  const getCategoryColor = (category: MistakeCategory) => {
    switch (category) {
      case 'conceptGap': return '#dc2626';
      case 'calculationError': return '#f59e0b';
      case 'formulaError': return '#8b5cf6';
      case 'misreading': return '#06b6d4';
      case 'timeManagement': return '#10b981';
    }
  };

  const getCategoryLabel = (category: MistakeCategory) => {
    switch (category) {
      case 'conceptGap': return 'Concept Gap';
      case 'calculationError': return 'Calculation Error';
      case 'formulaError': return 'Formula Error';
      case 'misreading': return 'Misreading';
      case 'timeManagement': return 'Time Management';
    }
  };

  const unreviewedCount = mistakes.filter(m => !m.reviewed).length;

  return (
    <div className="fade-in">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Mistake Book</h2>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Track and learn from your mistakes • {unreviewedCount} unreviewed
            </p>
          </div>
          <button
            onClick={() => {
              const newMistake: Omit<Mistake, 'id' | 'reviewed' | 'reviewCount'> = {
                date: new Date().toISOString().split('T')[0],
                subject: subject || 'Physics',
                chapter: 'Chapter Name',
                category: 'conceptGap',
                description: 'Describe your mistake',
                correctApproach: 'What should you have done'
              };
              addMistake(newMistake);
            }}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-md"
            style={{ background: 'var(--accent)', color: 'white' }}
          >
            + Add Mistake
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Status:</span>
            <div className="flex gap-1">
              {(['all', 'unreviewed', 'reviewed'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: filter === f ? 'var(--accent)' : 'var(--bg2)',
                    color: filter === f ? 'white' : 'var(--text-secondary)',
                    border: `1px solid ${filter === f ? 'var(--accent)' : 'var(--border)'}`
                  }}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="px-3 py-1 rounded-lg text-xs"
              style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text)' }}
            >
              <option value="all">All Categories</option>
              <option value="conceptGap">Concept Gap</option>
              <option value="calculationError">Calculation Error</option>
              <option value="formulaError">Formula Error</option>
              <option value="misreading">Misreading</option>
              <option value="timeManagement">Time Management</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mistakes List */}
      {filteredMistakes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg font-semibold mb-2" style={{ color: 'var(--text-tertiary)' }}>
            No mistakes found
          </p>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {filter !== 'all' ? 'Try changing filters' : 'Start adding your mistakes to track them'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMistakes.map(mistake => (
            <MistakeCard
              key={mistake.id}
              mistake={mistake}
              onReview={() => markAsReviewed(mistake.id)}
              onDelete={() => deleteMistake(mistake.id)}
              getCategoryColor={getCategoryColor}
              getCategoryLabel={getCategoryLabel}
            />
          ))}
        </div>
      )}

      {/* Statistics */}
      {mistakes.length > 0 && (
        <div className="mt-8 rounded-2xl p-6" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
          <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text)' }}>Mistake Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {(['conceptGap', 'calculationError', 'formulaError', 'misreading', 'timeManagement'] as MistakeCategory[]).map(category => {
              const count = mistakes.filter(m => m.category === category).length;
              const percentage = mistakes.length > 0 ? Math.round((count / mistakes.length) * 100) : 0;
              
              return (
                <div key={category} className="text-center">
                  <div className="text-2xl font-bold mb-1" style={{ color: getCategoryColor(category) }}>
                    {count}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {getCategoryLabel(category)}
                  </div>
                  <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                    {percentage}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function MistakeCard({
  mistake,
  onReview,
  onDelete,
  getCategoryColor,
  getCategoryLabel
}: {
  mistake: Mistake;
  onReview: () => void;
  onDelete: () => void;
  getCategoryColor: (category: MistakeCategory) => string;
  getCategoryLabel: (category: MistakeCategory) => string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(mistake.description);
  const [correctApproach, setCorrectApproach] = useState(mistake.correctApproach);

  const handleSave = () => {
    const updated = { ...mistake, description, correctApproach };
    const stored = localStorage.getItem('catchup:mistakes');
    if (stored) {
      const mistakes: Mistake[] = JSON.parse(stored);
      const index = mistakes.findIndex(m => m.id === mistake.id);
      if (index !== -1) {
        mistakes[index] = updated;
        localStorage.setItem('catchup:mistakes', JSON.stringify(mistakes));
      }
    }
    setIsEditing(false);
  };

  return (
    <div
      className="rounded-xl p-4 transition-all"
      style={{
        background: mistake.reviewed ? 'rgba(16, 185, 129, 0.05)' : 'var(--card)',
        border: `1.5px solid ${mistake.reviewed ? 'rgba(16, 185, 129, 0.3)' : 'var(--border)'}`,
        opacity: mistake.reviewed ? 0.8 : 1
      }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className="px-2 py-1 rounded-lg text-xs font-semibold"
          style={{
            background: `${getCategoryColor(mistake.category)}15`,
            color: getCategoryColor(mistake.category)
          }}
        >
          {getCategoryLabel(mistake.category)}
        </div>
        <div className="flex-1">
          <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            {mistake.subject} • {mistake.chapter} • {mistake.date}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!mistake.reviewed && (
            <button
              onClick={onReview}
              className="px-3 py-1 rounded-lg text-xs font-medium transition-all hover:shadow-md"
              style={{ background: 'var(--green)', color: 'white' }}
            >
              Mark Reviewed
            </button>
          )}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3 py-1 rounded-lg text-xs font-medium transition-all hover:shadow-md"
            style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-1 rounded-lg text-xs font-medium transition-all hover:shadow-md"
            style={{ background: 'var(--red-bg)', color: 'var(--red)' }}
          >
            Delete
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--text)' }}>
              What was your mistake?
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text)' }}
              rows={3}
            />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--text)' }}>
              What's the correct approach?
            </label>
            <textarea
              value={correctApproach}
              onChange={(e) => setCorrectApproach(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text)' }}
              rows={3}
            />
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-md"
            style={{ background: 'var(--accent)', color: 'white' }}
          >
            Save Changes
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div>
            <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-tertiary)' }}>
              Mistake:
            </div>
            <div className="text-sm" style={{ color: 'var(--text)' }}>
              {mistake.description}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-tertiary)' }}>
              Correct Approach:
            </div>
            <div className="text-sm" style={{ color: 'var(--text)' }}>
              {mistake.correctApproach}
            </div>
          </div>
          {mistake.reviewCount > 0 && (
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              Reviewed {mistake.reviewCount} time{mistake.reviewCount > 1 ? 's' : ''}
              {mistake.lastReviewed && ` • Last: ${new Date(mistake.lastReviewed).toLocaleDateString()}`}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
