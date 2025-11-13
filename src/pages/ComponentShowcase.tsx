import React, { useState } from 'react';
import {
  ProgressRing,
  StatCard,
  StreakCounter,
  Timeline,
  HorizontalScroll,
  OpportunityCard,
  Badge,
  EmptyState,
  BottomSheet,
  AchievementBadge,
  Toast,
  ToastContainer,
  type TimelineItem,
  type Achievement,
} from '../components/ui';
import { Target, TrendingUp, Award, Plus, Sparkles } from 'lucide-react';
import { confettiPresets } from '../lib/utils/confetti';

const ComponentShowcase: React.FC = () => {
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [toasts, setToasts] = useState<any[]>([]);

  const addToast = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    setToasts([...toasts, {
      id: Date.now().toString(),
      type,
      message,
      description: 'This is a demo notification',
      duration: 5000,
    }]);
  };

  const mockOpportunity = {
    id: '1',
    title: 'Rhodes Scholarship',
    description: 'Full funding to study at Oxford University',
    category: 'scholarship' as const,
    deadline: '2024-12-31',
    amount: 150000,
    eligibility: ['Undergraduate', 'Graduate'],
  };

  const timelineItems: TimelineItem[] = [
    {
      id: '1',
      title: 'Research Phase',
      description: 'Find and list relevant opportunities',
      status: 'completed',
      date: '2 days ago',
      metadata: { duration: '2h', xp: 50, tasks: 3 },
    },
    {
      id: '2',
      title: 'Application Prep',
      description: 'Prepare documents and essays',
      status: 'current',
      metadata: { duration: '4h', xp: 100, tasks: 5 },
    },
    {
      id: '3',
      title: 'Submit Applications',
      description: 'Submit to all selected programs',
      status: 'locked',
      metadata: { duration: '1h', xp: 200, tasks: 3 },
    },
  ];

  const mockAchievement: Achievement = {
    id: '1',
    title: 'First Steps',
    description: 'Created your first goal',
    emoji: '🎯',
    xp: 50,
    unlocked: true,
    unlockedAt: '2024-01-15',
    rarity: 'common',
  };

  const lockedAchievement: Achievement = {
    id: '2',
    title: 'Goal Master',
    description: 'Complete 10 goals',
    emoji: '🏆',
    xp: 500,
    unlocked: false,
    rarity: 'epic',
    progress: { current: 7, total: 10 },
  };

  return (
    <div className="min-h-screen bg-surface-body text-strong p-6 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold font-display bg-gradient-accent bg-clip-text text-transparent">
          Edutu UI Component Showcase
        </h1>
        <p className="text-soft text-lg">
          Preview all the new Phase 1, 2, and 3 components
        </p>
      </div>

      {/* Progress & Visualization */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold font-display text-strong border-b border-subtle pb-2">
          Progress & Visualization
        </h2>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-soft">ProgressRing</h3>
          <div className="flex flex-wrap gap-6">
            <ProgressRing progress={25} size={80} color="brand" label="Starting" />
            <ProgressRing progress={50} size={80} color="accent" label="In Progress" />
            <ProgressRing progress={75} size={80} color="success" label="Almost There" />
            <ProgressRing progress={100} size={80} color="warning" label="Complete" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-soft">StatCard</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              label="Active Goals"
              value="12"
              helper="3 completed this week"
              trend="up"
              trendValue="+25%"
              icon={Target}
              color="brand"
            />
            <StatCard
              label="Weekly Progress"
              value="85%"
              helper="Above your average"
              trend="up"
              trendValue="+12%"
              icon={TrendingUp}
              color="success"
            />
            <StatCard
              label="Achievements"
              value="8"
              helper="2 away from Gold tier"
              icon={Award}
              color="accent"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-soft">StreakCounter</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StreakCounter currentStreak={7} longestStreak={21} goal={30} variant="full" />
            <div className="flex items-center justify-center">
              <StreakCounter currentStreak={15} variant="compact" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-soft">Timeline</h3>
          <Timeline items={timelineItems} variant="default" />
        </div>
      </section>

      {/* Cards & Content */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold font-display text-strong border-b border-subtle pb-2">
          Cards & Content
        </h2>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-soft">OpportunityCard Variants</h3>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted mb-3">Compact Variant</p>
              <OpportunityCard
                opportunity={mockOpportunity}
                variant="compact"
                onSelect={() => {}}
                onSave={() => addToast('success', 'Opportunity saved!')}
              />
            </div>

            <div>
              <p className="text-sm text-muted mb-3">Featured Variant</p>
              <div className="max-w-md">
                <OpportunityCard
                  opportunity={mockOpportunity}
                  variant="featured"
                  onSelect={() => {}}
                  onSave={() => addToast('success', 'Opportunity saved!')}
                />
              </div>
            </div>

            <div>
              <p className="text-sm text-muted mb-3">Hero Variant</p>
              <div className="max-w-2xl">
                <OpportunityCard
                  opportunity={mockOpportunity}
                  variant="hero"
                  onSelect={() => {}}
                  onSave={() => addToast('success', 'Opportunity saved!')}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-soft">HorizontalScroll</h3>
          <HorizontalScroll
            title="Trending Opportunities"
            action={{ label: "View All", onClick: () => {} }}
          >
            {[1, 2, 3, 4].map(i => (
              <OpportunityCard
                key={i}
                opportunity={{...mockOpportunity, id: i.toString(), title: `Opportunity ${i}`}}
                variant="featured"
                onSelect={() => {}}
              />
            ))}
          </HorizontalScroll>
        </div>
      </section>

      {/* Feedback & Notifications */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold font-display text-strong border-b border-subtle pb-2">
          Feedback & Notifications
        </h2>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-soft">Badges</h3>
          <div className="flex flex-wrap gap-3">
            <Badge variant="brand" pill>Brand</Badge>
            <Badge variant="accent" pill>Accent</Badge>
            <Badge variant="success" pill>Success</Badge>
            <Badge variant="warning" pill>Warning</Badge>
            <Badge variant="danger" pill>Danger</Badge>
            <Badge variant="info" pill>Info</Badge>
            <Badge variant="neutral">Neutral</Badge>
            <Badge variant="brand" dot>Live</Badge>
            <Badge variant="success" icon={Target} size="lg">With Icon</Badge>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-soft">Toast Notifications</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => addToast('success', 'Success message')}
              className="px-4 py-2 bg-success-500 text-white rounded-xl hover:bg-success-600"
            >
              Show Success
            </button>
            <button
              onClick={() => addToast('error', 'Error message')}
              className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
            >
              Show Error
            </button>
            <button
              onClick={() => addToast('warning', 'Warning message')}
              className="px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600"
            >
              Show Warning
            </button>
            <button
              onClick={() => addToast('info', 'Info message')}
              className="px-4 py-2 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600"
            >
              Show Info
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-soft">EmptyState</h3>
          <div className="bg-surface-layer rounded-2xl p-6 border border-subtle">
            <EmptyState
              icon={Target}
              title="No goals yet"
              description="Start your learning journey by creating your first goal. We'll help you break it down into achievable milestones."
              action={{
                label: 'Create Goal',
                onClick: () => addToast('info', 'Create goal clicked'),
                icon: Plus
              }}
              secondaryAction={{
                label: 'Browse Templates',
                onClick: () => {}
              }}
            />
          </div>
        </div>
      </section>

      {/* Modals & Overlays */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold font-display text-strong border-b border-subtle pb-2">
          Modals & Overlays
        </h2>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-soft">BottomSheet</h3>
          <button
            onClick={() => setShowBottomSheet(true)}
            className="px-6 py-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 font-semibold"
          >
            Open BottomSheet
          </button>
        </div>
      </section>

      {/* Gamification */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold font-display text-strong border-b border-subtle pb-2">
          Gamification
        </h2>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-soft">AchievementBadge Variants</h3>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted mb-3">Compact Variant</p>
              <div className="space-y-3">
                <AchievementBadge achievement={mockAchievement} variant="compact" />
                <AchievementBadge achievement={lockedAchievement} variant="compact" />
              </div>
            </div>

            <div>
              <p className="text-sm text-muted mb-3">Default Variant</p>
              <div className="space-y-3 max-w-2xl">
                <AchievementBadge achievement={mockAchievement} variant="default" />
                <AchievementBadge achievement={lockedAchievement} variant="default" />
              </div>
            </div>

            <div>
              <p className="text-sm text-muted mb-3">Showcase Variant</p>
              <div className="max-w-md mx-auto">
                <AchievementBadge
                  achievement={{
                    ...mockAchievement,
                    rarity: 'legendary',
                    title: 'Streak Legend',
                    description: 'Maintained a 30-day learning streak',
                    emoji: '🔥',
                    xp: 1000,
                  }}
                  variant="showcase"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Animations */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold font-display text-strong border-b border-subtle pb-2">
          Animations & Effects
        </h2>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-soft">Confetti Presets</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => confettiPresets.celebration()}
              className="px-4 py-2 bg-brand-600 text-white rounded-xl hover:bg-brand-700"
            >
              🎉 Celebration
            </button>
            <button
              onClick={() => confettiPresets.goalCompleted()}
              className="px-4 py-2 bg-success-600 text-white rounded-xl hover:bg-success-700"
            >
              ✅ Goal Completed
            </button>
            <button
              onClick={() => confettiPresets.achievement()}
              className="px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700"
            >
              🏆 Achievement
            </button>
            <button
              onClick={() => confettiPresets.streakMilestone()}
              className="px-4 py-2 bg-accent-600 text-white rounded-xl hover:bg-accent-700"
            >
              🔥 Streak Milestone
            </button>
          </div>
        </div>
      </section>

      {/* BottomSheet Modal */}
      <BottomSheet
        isOpen={showBottomSheet}
        onClose={() => setShowBottomSheet(false)}
        title="BottomSheet Demo"
        height="md"
        showHandle
        showClose
      >
        <div className="space-y-4">
          <p className="text-soft">
            This is a BottomSheet component with iOS-style animations and gesture support.
          </p>
          <p className="text-soft">
            Try swiping down on the handle or backdrop to dismiss!
          </p>
          <div className="space-y-3">
            <Badge variant="brand" pill>Swipeable</Badge>
            <Badge variant="success" pill>Touch Gestures</Badge>
            <Badge variant="info" pill>Smooth Animations</Badge>
          </div>
        </div>
      </BottomSheet>

      {/* Toast Container */}
      <ToastContainer
        toasts={toasts}
        onClose={(id) => setToasts(toasts.filter(t => t.id !== id))}
        position="top-right"
      />
    </div>
  );
};

export default ComponentShowcase;
