import React from 'react';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  className?: string;
  showPercentage?: boolean;
  label?: string;
  color?: 'brand' | 'accent' | 'success' | 'warning';
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 80,
  strokeWidth = 8,
  className = '',
  showPercentage = true,
  label,
  color = 'brand',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  const center = size / 2;

  const colorMap = {
    brand: {
      stroke: 'rgb(var(--color-brand-500))',
      bg: 'rgba(var(--color-brand-200), 0.2)',
      glow: 'rgba(20, 184, 166, 0.3)',
    },
    accent: {
      stroke: 'rgb(var(--color-accent-500))',
      bg: 'rgba(var(--color-accent-200), 0.2)',
      glow: 'rgba(249, 115, 22, 0.3)',
    },
    success: {
      stroke: 'rgb(var(--color-success-500))',
      bg: 'rgba(var(--color-success-200), 0.2)',
      glow: 'rgba(16, 185, 129, 0.3)',
    },
    warning: {
      stroke: 'rgb(var(--color-warning-500))',
      bg: 'rgba(var(--color-warning-200), 0.2)',
      glow: 'rgba(245, 158, 11, 0.3)',
    },
  };

  const colors = colorMap[color];

  return (
    <div className={`inline-flex flex-col items-center gap-2 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={colors.bg}
            strokeWidth={strokeWidth}
          />

          {/* Progress circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="progress-ring transition-all duration-500 ease-out"
            style={{
              filter: `drop-shadow(0 0 ${strokeWidth}px ${colors.glow})`,
            }}
          />
        </svg>

        {/* Percentage text */}
        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-semibold font-display text-strong">
              {Math.round(progress)}%
            </span>
          </div>
        )}
      </div>

      {/* Label */}
      {label && (
        <span className="text-sm font-medium text-soft text-center">
          {label}
        </span>
      )}
    </div>
  );
};

export default ProgressRing;
