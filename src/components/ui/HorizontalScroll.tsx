import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HorizontalScrollProps {
  title?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  children: React.ReactNode;
  className?: string;
  showArrows?: boolean;
}

export const HorizontalScroll: React.FC<HorizontalScrollProps> = ({
  title,
  action,
  children,
  className = '',
  showArrows = true,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
    const newScrollLeft =
      direction === 'left'
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;

    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    });
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header */}
      {(title || action) && (
        <div className="flex items-center justify-between px-4 md:px-6">
          {title && (
            <h2 className="text-lg md:text-xl font-semibold font-display text-strong">
              {title}
            </h2>
          )}
          {action && (
            <button
              onClick={action.onClick}
              className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors active-press"
            >
              {action.label} →
            </button>
          )}
        </div>
      )}

      {/* Scrollable container */}
      <div className="relative group">
        {/* Left arrow */}
        {showArrows && showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-surface-layer/95 backdrop-blur-sm border border-subtle rounded-full p-2 shadow-elevated opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active-press"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-strong" />
          </button>
        )}

        {/* Right arrow */}
        {showArrows && showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-surface-layer/95 backdrop-blur-sm border border-subtle rounded-full p-2 shadow-elevated opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active-press"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-strong" />
          </button>
        )}

        {/* Content */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-4 md:px-6 pb-2"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default HorizontalScroll;
