import React from 'react';
import { Lock } from 'lucide-react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji?: string;
  icon?: string;
  xp: number;
  unlocked: boolean;
  unlockedAt?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  progress?: {
    current: number;
    total: number;
  };
}

interface AchievementBadgeProps {
  achievement: Achievement;
  onClick?: () => void;
  variant?: 'default' | 'compact' | 'showcase';
  className?: string;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  onClick,
  variant = 'default',
  className = '',
}) => {
  const rarityColors = {
    common: {
      bg: 'bg-neutral-100 dark:bg-neutral-800/30',
      border: 'border-neutral-300 dark:border-neutral-700',
      glow: 'shadow-neutral-500/20',
      text: 'text-neutral-700 dark:text-neutral-300',
    },
    rare: {
      bg: 'bg-cyan-50 dark:bg-cyan-900/20',
      border: 'border-cyan-300 dark:border-cyan-700/50',
      glow: 'shadow-cyan-500/30',
      text: 'text-cyan-700 dark:text-cyan-300',
    },
    epic: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-300 dark:border-purple-700/50',
      glow: 'shadow-purple-500/30',
      text: 'text-purple-700 dark:text-purple-300',
    },
    legendary: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-300 dark:border-amber-700/50',
      glow: 'shadow-amber-500/40',
      text: 'text-amber-700 dark:text-amber-300',
    },
  };

  const rarity = achievement.rarity || 'common';
  const colors = rarityColors[rarity];
  const isLocked = !achievement.unlocked;

  if (variant === 'compact') {
    return (
      <button
        onClick={onClick}
        disabled={isLocked && !onClick}
        className={`
          relative flex items-center gap-3 p-3 rounded-xl border
          transition-all
          ${isLocked ? 'opacity-50' : `${colors.bg} ${colors.border} hover-lift`}
          ${onClick && !isLocked ? 'cursor-pointer active-press' : ''}
          ${className}
        `}
      >
        {/* Icon */}
        <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center text-2xl
          ${isLocked ? 'bg-neutral-200 dark:bg-neutral-700' : `${colors.bg} shadow-soft`}
        `}>
          {isLocked ? <Lock className="w-5 h-5 text-neutral-400" /> : (achievement.emoji || '<Æ')}
        </div>

        {/* Info */}
        <div className="flex-1 text-left min-w-0">
          <h4 className="font-semibold text-sm text-strong truncate">
            {isLocked ? '???' : achievement.title}
          </h4>
          <p className="text-xs text-muted truncate">
            {isLocked ? 'Locked' : `${achievement.xp} XP`}
          </p>
        </div>

        {/* Progress */}
        {achievement.progress && !isLocked && (
          <div className="text-xs font-medium text-soft">
            {achievement.progress.current}/{achievement.progress.total}
          </div>
        )}
      </button>
    );
  }

  if (variant === 'showcase') {
    return (
      <div className={`
        relative p-8 text-center
        bg-gradient-to-br from-surface-layer to-surface-elevated
        rounded-3xl border-2 ${colors.border}
        ${isLocked ? 'opacity-60' : `shadow-2xl ${colors.glow}`}
        ${className}
      `}>
        {/* Rarity badge */}
        {!isLocked && achievement.rarity && achievement.rarity !== 'common' && (
          <div className="absolute top-4 right-4">
            <span className={`
              px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
              ${colors.bg} ${colors.text} border ${colors.border}
            `}>
              {achievement.rarity}
            </span>
          </div>
        )}

        {/* Icon */}
        <div className="relative mx-auto mb-4">
          {!isLocked && (
            <div className={`absolute inset-0 ${colors.glow} blur-2xl`} />
          )}
          <div className={`
            relative w-32 h-32 rounded-3xl flex items-center justify-center
            ${isLocked ? 'bg-neutral-200 dark:bg-neutral-700' : `${colors.bg} shadow-elevated`}
          `}>
            {isLocked ? (
              <Lock className="w-16 h-16 text-neutral-400" />
            ) : (
              <span className="text-7xl">{achievement.emoji || '<Æ'}</span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold font-display text-strong mb-2">
          {isLocked ? 'Secret Achievement' : achievement.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-soft mb-4 max-w-sm mx-auto">
          {isLocked ? 'Complete more challenges to unlock this achievement' : achievement.description}
        </p>

        {/* XP */}
        {!isLocked && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-100 dark:bg-accent-900/30 rounded-xl">
            <span className="text-lg">P</span>
            <span className="font-bold text-accent-700 dark:text-accent-300">
              {achievement.xp} XP
            </span>
          </div>
        )}

        {/* Unlocked date */}
        {!isLocked && achievement.unlockedAt && (
          <p className="text-xs text-muted mt-4">
            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
          </p>
        )}

        {/* Progress */}
        {achievement.progress && isLocked && (
          <div className="mt-4">
            <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-brand rounded-full transition-all duration-500"
                style={{
                  width: `${(achievement.progress.current / achievement.progress.total) * 100}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted mt-2">
              {achievement.progress.current} / {achievement.progress.total}
            </p>
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <button
      onClick={onClick}
      disabled={isLocked && !onClick}
      className={`
        relative text-left w-full p-5 rounded-2xl border-2
        transition-all
        ${isLocked ? 'opacity-50 bg-surface-layer border-subtle' : `${colors.bg} ${colors.border} hover-lift shadow-soft`}
        ${onClick && !isLocked ? 'cursor-pointer active-press' : ''}
        ${className}
      `}
    >
      {/* Rarity indicator */}
      {!isLocked && achievement.rarity && achievement.rarity !== 'common' && (
        <div className="absolute top-3 right-3">
          <div className={`w-3 h-3 rounded-full ${colors.border.replace('border', 'bg')} animate-pulse`} />
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`
          flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center
          ${isLocked ? 'bg-neutral-200 dark:bg-neutral-700' : `${colors.bg} shadow-soft`}
        `}>
          {isLocked ? (
            <Lock className="w-8 h-8 text-neutral-400" />
          ) : (
            <span className="text-4xl">{achievement.emoji || '<Æ'}</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-bold text-base text-strong">
              {isLocked ? 'Secret Achievement' : achievement.title}
            </h4>
            {!isLocked && (
              <div className="flex items-center gap-1 text-accent-600 dark:text-accent-400 text-sm font-medium flex-shrink-0">
                <span>P</span>
                <span>{achievement.xp}</span>
              </div>
            )}
          </div>

          <p className="text-sm text-soft leading-relaxed mb-3">
            {isLocked ? 'Complete more challenges to unlock' : achievement.description}
          </p>

          {/* Progress bar */}
          {achievement.progress && (
            <div className="space-y-1">
              <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${isLocked ? 'bg-neutral-400' : 'bg-gradient-brand'}`}
                  style={{
                    width: `${(achievement.progress.current / achievement.progress.total) * 100}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted">
                <span>Progress</span>
                <span>{achievement.progress.current}/{achievement.progress.total}</span>
              </div>
            </div>
          )}

          {/* Unlocked date */}
          {!isLocked && achievement.unlockedAt && (
            <p className="text-xs text-muted mt-2">
              Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </button>
  );
};

export default AchievementBadge;
