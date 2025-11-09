import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  showHandle?: boolean;
  showClose?: boolean;
  height?: 'sm' | 'md' | 'lg' | 'full';
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  showHandle = true,
  showClose = true,
  height = 'md',
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);

  const heightClasses = {
    sm: 'max-h-[40vh]',
    md: 'max-h-[60vh]',
    lg: 'max-h-[85vh]',
    full: 'h-[calc(100vh-4rem)]',
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    currentY.current = e.touches[0].clientY;
    const diff = currentY.current - startY.current;

    if (diff > 0 && sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${diff}px)`;
    }
  };

  const handleTouchEnd = () => {
    const diff = currentY.current - startY.current;

    if (diff > 100) {
      onClose();
    }

    if (sheetRef.current) {
      sheetRef.current.style.transform = '';
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={`
          relative w-full bg-surface-layer rounded-t-3xl shadow-elevated
          animate-in slide-in-from-bottom duration-300
          transition-transform
          ${heightClasses[height]}
          ${className}
        `}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Handle */}
        {showHandle && (
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-neutral-300 dark:bg-neutral-600 rounded-full" />
          </div>
        )}

        {/* Header */}
        {(title || showClose) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-subtle">
            <h2 className="text-xl font-semibold font-display text-strong">
              {title}
            </h2>
            {showClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-surface-elevated rounded-xl transition-colors active-press"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-muted" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto overscroll-contain" style={{ maxHeight: 'calc(100% - 80px)' }}>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;
