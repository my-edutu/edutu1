import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
  duration?: number;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  message,
  description,
  duration = 5000,
  onClose,
}) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  const config = {
    success: {
      icon: CheckCircle2,
      bgColor: 'bg-success-50 dark:bg-success-900/10',
      borderColor: 'border-success-200 dark:border-success-800/30',
      iconColor: 'text-success-600 dark:text-success-400',
      textColor: 'text-success-900 dark:text-success-100',
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50 dark:bg-red-900/10',
      borderColor: 'border-red-200 dark:border-red-800/30',
      iconColor: 'text-red-600 dark:text-red-400',
      textColor: 'text-red-900 dark:text-red-100',
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-amber-50 dark:bg-amber-900/10',
      borderColor: 'border-amber-200 dark:border-amber-800/30',
      iconColor: 'text-amber-600 dark:text-amber-400',
      textColor: 'text-amber-900 dark:text-amber-100',
    },
    info: {
      icon: Info,
      bgColor: 'bg-cyan-50 dark:bg-cyan-900/10',
      borderColor: 'border-cyan-200 dark:border-cyan-800/30',
      iconColor: 'text-cyan-600 dark:text-cyan-400',
      textColor: 'text-cyan-900 dark:text-cyan-100',
    },
  };

  const { icon: Icon, bgColor, borderColor, iconColor, textColor } = config[type];

  return (
    <div
      className={`
        ${bgColor} ${borderColor}
        border rounded-2xl p-4 shadow-elevated
        flex items-start gap-3
        min-w-[320px] max-w-md
        bounce-in
      `}
      role="alert"
    >
      {/* Icon */}
      <div className={`flex-shrink-0 ${iconColor}`}>
        <Icon className="w-5 h-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-sm ${textColor}`}>
          {message}
        </p>
        {description && (
          <p className={`text-xs mt-1 ${textColor} opacity-80`}>
            {description}
          </p>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={() => onClose(id)}
        className={`flex-shrink-0 ${iconColor} hover:opacity-70 transition-opacity active-press`}
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Toast container component
interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type: ToastType;
    message: string;
    description?: string;
    duration?: number;
  }>;
  onClose: (id: string) => void;
  position?: 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center';
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onClose,
  position = 'top-right',
}) => {
  const positionClasses = {
    'top-right': 'top-4 right-4 items-end',
    'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
    'bottom-right': 'bottom-4 right-4 items-end',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
  };

  return (
    <div
      className={`
        fixed z-50 flex flex-col gap-3
        ${positionClasses[position]}
      `}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
};

export default Toast;
