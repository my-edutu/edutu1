import React from 'react';
import { Flame, Award, Zap } from 'lucide-react';

interface StreakCounterProps {
  currentStreak: number;
  longestStreak?: number;
  goal?: number;
  variant?: 'compact' | 'full';
  className?: string;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({
  currentStreak,
  longestStreak,
  goal = 30,
  variant = 'full',
  className = '',
}) => {
  const progress = Math.min((currentStreak / goal) * 100, 100);

  const getStreakLevel = () => {
    if (currentStreak >= 30) return { name: 'Diamond', color: 'text-cyan-500', icon: Award };
    if (currentStreak >= 14) return { name: 'Gold', color: 'text-amber-500', icon: Award };
    if (currentStreak >= 7) return { name: 'Silver', color: 'text-neutral-400', icon: Zap };
    return { name: 'Bronze', color: 'text-accent-600', icon: Flame };
  };

  const level = getStreakLevel();
  const LevelIcon = level.icon;

  if (variant === 'compact') {
    return (
      <div
        className={`
          flex items-center gap-2 px-3 py-2
          bg-gradient-vibrant rounded-xl shadow-soft
          ${className}
        `}
      >
        <Flame className="w-5 h-5 text-white animate-pulse" />
        <div>
          <p className="text-xl font-bold text-white font-display">
            {currentStreak}
          </p>
          <p className="text-xs text-white/80">Day Streak</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        bg-surface-layer border border-subtle rounded-2xl p-5 space-y-4
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-vibrant rounded-xl shadow-soft">
            <Flame className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="font-semibold text-strong">Your Streak</h3>
            <p className="text-xs text-muted">Keep the momentum going!</p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 ${level.color}`}>
          <LevelIcon className="w-5 h-5" />
          <span className="text-sm font-medium">{level.name}</span>
        </div>
      </div>

      {/* Current streak display */}
      <div className="text-center py-4">
        <div className="inline-flex items-baseline gap-2">
          <span className="text-5xl font-bold font-display bg-gradient-vibrant bg-clip-text text-transparent">
            {currentStreak}
          </span>
          <span className="text-2xl text-soft">
            {currentStreak === 1 ? 'day' : 'days'}
          </span>
        </div>
        <p className="text-sm text-muted mt-2">
          {currentStreak >= goal ? 'Incredible! Goal achieved! <‰' : `${goal - currentStreak} more to reach ${level.name === 'Diamond' ? 'beyond' : 'Diamond'}`}
        </p>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
          <div
            className="h-full gradient-vibrant rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted">
          <span>{currentStreak}/{goal} days</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Stats */}
      {longestStreak !== undefined && (
        <div className="flex items-center justify-between pt-3 border-t border-subtle">
          <div>
            <p className="text-xs text-muted">Longest Streak</p>
            <p className="text-lg font-bold text-strong">{longestStreak} days</p>
          </div>
          {longestStreak > currentStreak && (
            <div className="text-right">
              <p className="text-xs text-muted">To Beat Record</p>
              <p className="text-lg font-bold text-accent-600">{longestStreak - currentStreak + 1} days</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StreakCounter;
