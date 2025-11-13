import React from 'react';
import { CheckCircle2, Circle, Lock, LucideIcon } from 'lucide-react';

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  status: 'completed' | 'current' | 'upcoming' | 'locked';
  date?: string;
  icon?: LucideIcon;
  metadata?: {
    duration?: string;
    xp?: number;
    tasks?: number;
  };
}

interface TimelineProps {
  items: TimelineItem[];
  onItemClick?: (item: TimelineItem) => void;
  className?: string;
  variant?: 'default' | 'compact';
}

export const Timeline: React.FC<TimelineProps> = ({
  items,
  onItemClick,
  className = '',
  variant = 'default',
}) => {
  const getStatusIcon = (status: TimelineItem['status'], CustomIcon?: LucideIcon) => {
    if (CustomIcon) return CustomIcon;

    switch (status) {
      case 'completed':
        return CheckCircle2;
      case 'locked':
        return Lock;
      default:
        return Circle;
    }
  };

  const getStatusColor = (status: TimelineItem['status']) => {
    switch (status) {
      case 'completed':
        return {
          dot: 'bg-success-500 border-success-200',
          line: 'bg-success-200',
          icon: 'text-success-600',
          card: 'border-success-200 bg-success-50/30',
        };
      case 'current':
        return {
          dot: 'bg-brand-500 border-brand-200 animate-pulse',
          line: 'bg-gradient-to-b from-brand-200 to-neutral-200',
          icon: 'text-brand-600',
          card: 'border-brand-300 bg-brand-50/50 shadow-ring',
        };
      case 'locked':
        return {
          dot: 'bg-neutral-300 border-neutral-200',
          line: 'bg-neutral-200',
          icon: 'text-neutral-400',
          card: 'border-neutral-200 bg-neutral-50/30 opacity-60',
        };
      default:
        return {
          dot: 'bg-neutral-200 border-neutral-100',
          line: 'bg-neutral-200',
          icon: 'text-neutral-500',
          card: 'border-neutral-200 bg-surface-layer',
        };
    }
  };

  if (variant === 'compact') {
    return (
      <div className={`space-y-3 ${className}`}>
        {items.map((item, index) => {
          const Icon = getStatusIcon(item.status, item.icon);
          const colors = getStatusColor(item.status);
          const isLast = index === items.length - 1;

          return (
            <div key={item.id} className="flex gap-3">
              {/* Timeline indicator */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full border-2 ${colors.dot} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${colors.icon}`} />
                </div>
                {!isLast && (
                  <div className={`w-0.5 h-full min-h-[24px] ${colors.line} mt-2`} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <button
                  onClick={() => onItemClick?.(item)}
                  disabled={item.status === 'locked'}
                  className={`
                    text-left w-full
                    ${onItemClick && item.status !== 'locked' ? 'cursor-pointer hover:opacity-80' : ''}
                    ${item.status === 'locked' ? 'cursor-not-allowed' : ''}
                  `}
                >
                  <h4 className="font-semibold text-strong text-sm">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-xs text-muted mt-0.5">
                      {item.description}
                    </p>
                  )}
                  {item.metadata && (
                    <div className="flex items-center gap-3 mt-2 text-xs text-soft">
                      {item.metadata.duration && <span>ñ {item.metadata.duration}</span>}
                      {item.metadata.xp && <span>P {item.metadata.xp} XP</span>}
                      {item.metadata.tasks && <span> {item.metadata.tasks} tasks</span>}
                    </div>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Default variant
  return (
    <div className={`space-y-6 ${className}`}>
      {items.map((item, index) => {
        const Icon = getStatusIcon(item.status, item.icon);
        const colors = getStatusColor(item.status);
        const isLast = index === items.length - 1;

        return (
          <div key={item.id} className="flex gap-4">
            {/* Timeline indicator */}
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-xl border-2 ${colors.dot} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${colors.icon}`} />
              </div>
              {!isLast && (
                <div className={`w-1 h-full min-h-[40px] rounded-full ${colors.line} mt-3`} />
              )}
            </div>

            {/* Card */}
            <div className="flex-1 pb-2">
              <button
                onClick={() => onItemClick?.(item)}
                disabled={item.status === 'locked'}
                className={`
                  text-left w-full p-5 rounded-2xl border transition-all
                  ${colors.card}
                  ${onItemClick && item.status !== 'locked' ? 'cursor-pointer hover-lift active-press' : ''}
                  ${item.status === 'locked' ? 'cursor-not-allowed' : ''}
                `}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-strong text-base">
                      {item.title}
                    </h3>
                    {item.date && (
                      <p className="text-xs text-muted mt-1">
                        {item.date}
                      </p>
                    )}
                  </div>
                  {item.status === 'completed' && (
                    <div className="flex-shrink-0 ml-2">
                      <div className="px-2.5 py-1 bg-success-100 dark:bg-success-900/20 rounded-lg">
                        <span className="text-xs font-medium text-success-700 dark:text-success-400">
                          Done
                        </span>
                      </div>
                    </div>
                  )}
                  {item.status === 'current' && (
                    <div className="flex-shrink-0 ml-2">
                      <div className="px-2.5 py-1 bg-brand-100 dark:bg-brand-900/20 rounded-lg">
                        <span className="text-xs font-medium text-brand-700 dark:text-brand-400">
                          In Progress
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {item.description && (
                  <p className="text-sm text-soft leading-relaxed">
                    {item.description}
                  </p>
                )}

                {item.metadata && (
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-subtle">
                    {item.metadata.duration && (
                      <div className="flex items-center gap-1.5 text-xs text-soft">
                        <span>ñ</span>
                        <span>{item.metadata.duration}</span>
                      </div>
                    )}
                    {item.metadata.xp && (
                      <div className="flex items-center gap-1.5 text-xs text-soft">
                        <span>P</span>
                        <span>{item.metadata.xp} XP</span>
                      </div>
                    )}
                    {item.metadata.tasks && (
                      <div className="flex items-center gap-1.5 text-xs text-soft">
                        <span></span>
                        <span>{item.metadata.tasks} tasks</span>
                      </div>
                    )}
                  </div>
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
