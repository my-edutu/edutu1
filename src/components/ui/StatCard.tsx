import React from 'react';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  helper?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: LucideIcon;
  color?: 'brand' | 'accent' | 'success' | 'warning' | 'info';
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  helper,
  trend,
  trendValue,
  icon: Icon,
  color = 'brand',
  onClick,
  className = '',
}) => {
  const colorClasses = {
    brand: {
      bg: 'bg-brand-50 dark:bg-brand-900/10',
      text: 'text-brand-600 dark:text-brand-400',
      icon: 'text-brand-500',
    },
    accent: {
      bg: 'bg-accent-50 dark:bg-accent-900/10',
      text: 'text-accent-600 dark:text-accent-400',
      icon: 'text-accent-500',
    },
    success: {
      bg: 'bg-green-50 dark:bg-green-900/10',
      text: 'text-green-600 dark:text-green-400',
      icon: 'text-green-500',
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-900/10',
      text: 'text-amber-600 dark:text-amber-400',
      icon: 'text-amber-500',
    },
    info: {
      bg: 'bg-cyan-50 dark:bg-cyan-900/10',
      text: 'text-cyan-600 dark:text-cyan-400',
      icon: 'text-cyan-500',
    },
  };

  const colors = colorClasses[color];

  const getTrendIcon = () => {
    if (trend === 'up') return TrendingUp;
    if (trend === 'down') return TrendingDown;
    return Minus;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-success-600';
    if (trend === 'down') return 'text-danger-600';
    return 'text-muted';
  };

  const TrendIcon = getTrendIcon();

  return (
    <div
      onClick={onClick}
      className={`
        bg-surface-layer border border-subtle rounded-2xl p-5
        transition-all hover-lift
        ${onClick ? 'cursor-pointer active-press' : ''}
        ${className}
      `}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm font-medium text-soft">{label}</span>
        {Icon && (
          <div className={`p-2 ${colors.bg} rounded-xl`}>
            <Icon className={`w-5 h-5 ${colors.icon}`} />
          </div>
        )}
      </div>

      <div className="space-y-2">
        {/* Value */}
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl font-bold font-display ${colors.text}`}>
            {value}
          </span>
          {trend && trendValue && (
            <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()}`}>
              <TrendIcon className="w-4 h-4" />
              <span>{trendValue}</span>
            </div>
          )}
        </div>

        {/* Helper text */}
        {helper && (
          <p className="text-xs text-muted leading-relaxed">
            {helper}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
