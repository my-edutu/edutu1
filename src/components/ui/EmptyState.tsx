import React from 'react';
import { LucideIcon } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  emoji?: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  emoji,
  title,
  description,
  action,
  secondaryAction,
  className = '',
}) => {
  return (
    <div
      className={`
        flex flex-col items-center justify-center
        text-center px-6 py-12
        ${className}
      `}
    >
      {/* Illustration */}
      <div className="mb-6">
        {emoji ? (
          <div className="text-7xl animate-bounce-subtle">
            {emoji}
          </div>
        ) : Icon ? (
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-brand-500/20 blur-3xl rounded-full animate-pulse" />
            {/* Icon container */}
            <div className="relative w-24 h-24 bg-gradient-brand rounded-3xl flex items-center justify-center shadow-elevated">
              <Icon className="w-12 h-12 text-white" strokeWidth={1.5} />
            </div>
          </div>
        ) : null}
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold font-display text-strong mb-3">
        {title}
      </h3>

      {/* Description */}
      <p className="text-base text-soft max-w-md leading-relaxed mb-8">
        {description}
      </p>

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {action && (
            <Button
              onClick={action.onClick}
              className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl font-semibold active-press hover-lift shadow-soft"
            >
              {action.icon && <action.icon className="w-5 h-5" />}
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              className="bg-surface-elevated hover:bg-neutral-200 dark:hover:bg-neutral-700 text-strong px-6 py-3 rounded-xl font-medium active-press"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
