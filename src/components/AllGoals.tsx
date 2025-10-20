import React, { useMemo, useState } from 'react';
import {
  Archive,
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Clock,
  RefreshCcw,
  Search,
  Target,
  Plus
} from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';
import { useDarkMode } from '../hooks/useDarkMode';
import { Goal, useGoals } from '../hooks/useGoals';

interface AllGoalsProps {
  onBack: () => void;
  onSelectGoal: (goalId: string) => void;
  onAddGoal: () => void;
}

const statusFilters = [
  { id: 'all', label: 'All goals' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
  { id: 'archived', label: 'Archived' }
] as const;

type StatusFilter = (typeof statusFilters)[number]['id'];

const AllGoals: React.FC<AllGoalsProps> = ({ onBack, onSelectGoal, onAddGoal }) => {
  const { isDarkMode } = useDarkMode();
  const { goals, updateGoal } = useGoals();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const formatDateShort = (date?: string | null) => {
    if (!date) {
      return 'No deadline';
    }
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) {
      return 'No deadline';
    }
    return parsed.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const describeDueDate = (deadline?: string) => {
    if (!deadline) {
      return 'No deadline';
    }
    const parsed = new Date(deadline);
    if (Number.isNaN(parsed.getTime())) {
      return 'No deadline';
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.round((parsed.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays > 1) {
      return `Due in ${diffDays} days`;
    }
    if (diffDays === 1) {
      return 'Due tomorrow';
    }
    if (diffDays === 0) {
      return 'Due today';
    }
    if (diffDays === -1) {
      return 'Overdue by 1 day';
    }
    return `Overdue by ${Math.abs(diffDays)} days`;
  };

  const getPriorityBadgeClass = (priority?: Goal['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50 text-red-600 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium':
        return 'border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
      case 'low':
        return 'border-green-200 bg-green-50 text-green-600 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'border-gray-200 bg-gray-100 text-gray-600 dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-300';
    }
  };

  const getStatusBadgeClass = (status: Goal['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'archived':
        return 'bg-gray-200 text-gray-600 dark:bg-gray-700/60 dark:text-gray-300';
      default:
        return 'bg-primary/10 text-primary';
    }
  };

  const formatUpdatedAt = (updatedAt: string) => {
    const parsed = new Date(updatedAt);
    if (Number.isNaN(parsed.getTime())) {
      return 'just now';
    }
    const diffMs = Date.now() - parsed.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    if (diffMinutes < 1) {
      return 'just now';
    }
    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    }
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) {
      return `${diffDays}d ago`;
    }
    return parsed.toLocaleDateString();
  };

  const activeGoals = useMemo(() => goals.filter((goal) => goal.status === 'active'), [goals]);
  const completedGoals = useMemo(() => goals.filter((goal) => goal.status === 'completed'), [goals]);
  const archivedGoals = useMemo(() => goals.filter((goal) => goal.status === 'archived'), [goals]);

  const recentActivityCount = useMemo(() => {
    const cutoff = Date.now() - 1000 * 60 * 60 * 24 * 7;
    return goals.filter((goal) => new Date(goal.updatedAt).getTime() >= cutoff).length;
  }, [goals]);

  const consistencyScore = goals.length
    ? Math.min(100, Math.round((recentActivityCount / goals.length) * 100))
    : 0;

  const averageProgress = activeGoals.length
    ? Math.round(
        activeGoals.reduce((total, goal) => total + goal.progress, 0) /
          activeGoals.length
      )
    : 0;

  const completionRate = goals.length
    ? Math.round((completedGoals.length / goals.length) * 100)
    : 0;

  const upcomingGoal = useMemo(() => {
    const withDeadline = activeGoals.filter((goal) => goal.deadline);
    return withDeadline
      .sort(
        (a, b) =>
          new Date(a.deadline as string).getTime() -
          new Date(b.deadline as string).getTime()
      )[0] ?? null;
  }, [activeGoals]);

  const summaryCards = useMemo(
    () => [
      {
        label: 'Total goals',
        value: goals.length.toString(),
        helper: `${activeGoals.length} active · ${completedGoals.length} completed`
      },
      {
        label: 'Consistency',
        value: `${consistencyScore}%`,
        helper:
          consistencyScore >= 70
            ? 'Momentum looks strong'
            : 'Aim for 70% consistency this week'
      },
      {
        label: 'Avg progress',
        value: `${averageProgress}%`,
        helper: activeGoals.length ? 'Across active goals' : 'Add a goal to start tracking'
      },
      {
        label: 'Next deadline',
        value: upcomingGoal ? formatDateShort(upcomingGoal.deadline) : 'No deadline',
        helper: upcomingGoal
          ? `${describeDueDate(upcomingGoal.deadline)} · ${upcomingGoal.title}`
          : 'Set target dates to stay accountable'
      }
    ],
    [
      goals.length,
      activeGoals.length,
      completedGoals.length,
      consistencyScore,
      averageProgress,
      upcomingGoal?.deadline,
      upcomingGoal?.title
    ]
  );

  const filteredGoals = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return goals
      .filter((goal) => (statusFilter === 'all' ? true : goal.status === statusFilter))
      .filter((goal) => {
        if (!query) {
          return true;
        }
        return (
          goal.title.toLowerCase().includes(query) ||
          (goal.description?.toLowerCase().includes(query) ?? false) ||
          (goal.category?.toLowerCase().includes(query) ?? false)
        );
      })
      .sort((a, b) => {
        const statusWeight = (status: Goal['status']) => {
          if (status === 'active') return 0;
          if (status === 'completed') return 1;
          return 2;
        };
        const statusDiff = statusWeight(a.status) - statusWeight(b.status);
        if (statusDiff !== 0) {
          return statusDiff;
        }
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [goals, statusFilter, searchTerm]);

  const handleMarkCompleted = (goalId: string) => {
    updateGoal(goalId, { status: 'completed', progress: 100 });
  };

  const handleReopen = (goal: Goal) => {
    updateGoal(goal.id, {
      status: 'active',
      progress: Math.min(goal.progress, 95),
      completedAt: null
    });
  };

  const handleArchive = (goal: Goal) => {
    updateGoal(goal.id, { status: 'archived' });
  };

  const handleActivate = (goal: Goal) => {
    updateGoal(goal.id, { status: 'active' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    scrollToTop();
    onBack();
  };

  const handleAddGoal = () => {
    scrollToTop();
    onAddGoal();
  };

  return (
    <div className={`min-h-screen bg-white dark:bg-gray-900 animate-fade-in ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={handleBack}
              className="p-2 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              <ArrowLeft size={20} />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">All Goals</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {goals.length} total · {activeGoals.length} active · {completedGoals.length} completed ·{' '}
                {archivedGoals.length} archived · {completionRate}% completion rate
              </p>
            </div>
            <Button onClick={handleAddGoal} className="inline-flex items-center gap-2">
              <Plus size={16} />
              Add goal
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((card) => (
            <Card
              key={card.label}
              className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-4`}
            >
              <p className="text-xs uppercase tracking-wide text-muted">{card.label}</p>
              <p className="mt-2 text-2xl font-semibold text-primary">{card.value}</p>
              <p className="mt-1 text-xs text-muted">{card.helper}</p>
            </Card>
          ))}
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative lg:max-w-sm w-full">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search goals by title, description, or category..."
              className={`w-full rounded-2xl border px-10 py-3 text-sm transition focus:ring-2 focus:ring-primary focus:border-transparent ${
                isDarkMode
                  ? 'border-gray-700 bg-gray-800 text-white placeholder-gray-500'
                  : 'border-gray-200 bg-white text-gray-800 placeholder-gray-400'
              }`}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setStatusFilter(filter.id)}
                className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                  statusFilter === filter.id
                    ? 'bg-primary text-white shadow-sm'
                    : isDarkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredGoals.length === 0 ? (
            <Card
              className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center ${
                isDarkMode ? 'border-gray-700 bg-gray-800 text-gray-300' : 'border-gray-200 bg-gray-50 text-gray-600'
              }`}
            >
              <Target size={32} className="text-primary" />
              <h3 className="text-lg font-semibold">No goals match your filters</h3>
              <p className="text-sm">
                Try adjusting the filters or add a new goal to keep your momentum rolling.
              </p>
              {statusFilter !== 'all' || searchTerm.trim() ? (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setStatusFilter('all');
                    setSearchTerm('');
                  }}
                >
                  Reset filters
                </Button>
              ) : (
                <Button onClick={handleAddGoal} className="inline-flex items-center gap-2">
                  <Plus size={16} />
                  Add goal
                </Button>
              )}
            </Card>
          ) : (
            filteredGoals.map((goal) => {
              const progress = Math.min(Math.max(goal.progress, 0), 100);
              return (
                <Card
                  key={goal.id}
                  className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-5`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                          {goal.title}
                        </h3>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getStatusBadgeClass(
                            goal.status
                          )}`}
                        >
                          {goal.status}
                        </span>
                      </div>
                      {goal.description && (
                        <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {goal.description}
                        </p>
                      )}
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted">
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{goal.deadline ? formatDateShort(goal.deadline) : 'No deadline'}</span>
                          <span className="opacity-70">· {describeDueDate(goal.deadline)}</span>
                        </span>
                        {goal.priority && (
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 capitalize ${getPriorityBadgeClass(
                              goal.priority
                            )}`}
                          >
                            Priority {goal.priority}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <Clock size={14} />
                          <span>Updated {formatUpdatedAt(goal.updatedAt)}</span>
                        </span>
                      </div>
                    </div>
                    <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Target size={22} />
                    </div>
                  </div>
                  <div className={`mt-4 h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted">
                    <span>{progress}% complete</span>
                    {goal.completedAt && goal.status === 'completed' && (
                      <span>Completed {formatDateShort(goal.completedAt)}</span>
                    )}
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => onSelectGoal(goal.id)}
                      className="inline-flex items-center gap-2"
                    >
                      <ArrowUpRight size={14} />
                      View roadmap
                    </Button>
                    {goal.status !== 'completed' && goal.status !== 'archived' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleMarkCompleted(goal.id)}
                        className="inline-flex items-center gap-2"
                      >
                        <CheckCircle2 size={14} />
                        Mark complete
                      </Button>
                    )}
                    {goal.status === 'completed' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleReopen(goal)}
                        className="inline-flex items-center gap-2"
                      >
                        <RefreshCcw size={14} />
                        Reopen
                      </Button>
                    )}
                    {goal.status !== 'archived' ? (
                      <button
                        type="button"
                        onClick={() => handleArchive(goal)}
                        className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-medium transition ${
                          isDarkMode
                            ? 'border-gray-700 text-gray-300 hover:bg-gray-700'
                            : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Archive size={14} />
                        Archive
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleActivate(goal)}
                        className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-medium transition ${
                          isDarkMode
                            ? 'border-gray-700 text-gray-300 hover:bg-gray-700'
                            : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <RefreshCcw size={14} />
                        Restore
                      </button>
                    )}
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AllGoals;
