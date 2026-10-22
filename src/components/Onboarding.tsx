import { useState } from 'react';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to CatchUp Vault!',
      description: 'Your complete exam prep companion for JEE & HSC',
      icon: '🎓',
      color: '#2563eb'
    },
    {
      title: 'Track Your Progress',
      description: 'Mark chapters as done and watch your progress grow',
      icon: '📊',
      color: '#16a34a'
    },
    {
      title: '3000+ Formulas',
      description: 'Complete formula reference for Physics, Chemistry & Maths',
      icon: '📐',
      color: '#7c3aed'
    },
    {
      title: 'AI-Powered Learning',
      description: 'Get instant help from AI tutor & generate quizzes',
      icon: '🤖',
      color: '#06b6d4'
    },
    {
      title: 'Interactive Flashcards',
      description: 'Master concepts with smart flashcards & spaced repetition',
      icon: '⚡',
      color: '#f59e0b'
    },
    {
      title: 'You\'re All Set!',
      description: 'Start your journey to exam success now',
      icon: '🚀',
      color: '#ec4899'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem('catchup:onboarding:completed', 'true');
      onComplete();
    }
  };

  const handleSkip = () => {
    localStorage.setItem('catchup:onboarding:completed', 'true');
    onComplete();
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{
      background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)',
      backdropFilter: 'blur(8px)'
    }}>
      <div className="max-w-2xl w-full rounded-3xl p-8 shadow-2xl" style={{
        background: 'var(--card)',
        border: '1.5px solid var(--border)'
      }}>
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
              Step {currentStep + 1} of {steps.length}
            </span>
            <button
              onClick={handleSkip}
              className="text-xs font-medium hover:underline"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Skip
            </button>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg2)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
                background: `linear-gradient(90deg, ${currentStepData.color}, ${currentStepData.color}dd)`
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <div className="text-7xl mb-6 animate-bounce-in">
            {currentStepData.icon}
          </div>
          <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--text)' }}>
            {currentStepData.title}
          </h2>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            {currentStepData.description}
          </p>
        </div>

        {/* Features Grid (only on last step) */}
        {currentStep === steps.length - 1 && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-xl" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
              <div className="text-2xl mb-2">📚</div>
              <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>7 Exam Tracks</div>
              <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>JEE, HSC & more</div>
            </div>
            <div className="p-4 rounded-xl" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>150+ Chapters</div>
              <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Complete syllabus</div>
            </div>
            <div className="p-4 rounded-xl" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
              <div className="text-2xl mb-2">💡</div>
              <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>AI Tutor</div>
              <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Instant help</div>
            </div>
            <div className="p-4 rounded-xl" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
              <div className="text-2xl mb-2">🔥</div>
              <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>Study Streaks</div>
              <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Stay motivated</div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className="w-2 h-2 rounded-full transition-all"
                style={{
                  background: idx === currentStep ? currentStepData.color : 'var(--border)',
                  transform: idx === currentStep ? 'scale(1.5)' : 'scale(1)'
                }}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            className="px-8 py-3 rounded-xl font-semibold transition-all hover:shadow-lg hover:-translate-y-0.5"
            style={{
              background: `linear-gradient(135deg, ${currentStepData.color}, ${currentStepData.color}dd)`,
              color: 'white'
            }}
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};
