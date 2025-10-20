import React, { useMemo, useState, useEffect } from 'react';
import {
  Award,
  Bell,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Globe,
  Menu,
  MessageCircle,
  Plus,
  Target,
  TrendingUp,
  Upload,
  Users,
  FileText,
  X
} from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';
import NotificationInbox from './NotificationInbox';
import { useDarkMode } from '../hooks/useDarkMode';
import { useGoals } from '../hooks/useGoals';

interface DashboardProps {
  user: { name: string; age: number } | null;
  onOpportunityClick: (opportunity: any) => void;
  onViewAllOpportunities: () => void;
  onGoalClick: (goalId: string) => void;
  onNavigate?: (screen: string) => void;
  onAddGoal?: () => void;
  onViewAllGoals?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  user,
  onOpportunityClick,
  onViewAllOpportunities,
  onGoalClick,
  onNavigate,
  onAddGoal,
  onViewAllGoals
}) => {
  const [recentAchievements] = useState([
    {
      id: '1',
      title: 'Set up Python development environment',
      icon: <CheckCircle2 size={16} />,
      date: 'Today',
      type: 'task_completed'
    },
    {
      id: '2',
      title: 'Complete Python basics tutorial',
      icon: <CheckCircle2 size={16} />,
      date: 'Today',
      type: 'task_completed'
    },
    {
      id: '3',
      title: 'Profile Complete',
      icon: <Award size={16} />,
      date: 'Yesterday',
      type: 'milestone'
    }
  ]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount] = useState(3);
  const [showMenu, setShowMenu] = useState(false);
  const { isDarkMode } = useDarkMode();
  const { goals } = useGoals();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showMenu && !target.closest('.dashboard-menu')) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const opportunities = [
    {
      id: '1',
      title: 'African Leadership Academy Scholarship',
      organization: 'African Leadership Academy',
      category: 'Education',
      deadline: 'March 15, 2024',
      location: 'South Africa',
      match: 95,
      difficulty: 'Hard' as const,
      applicants: '10,000+',
      successRate: '5%',
      description:
        'A comprehensive scholarship program for academically talented yet economically disadvantaged young people from Africa.',
      requirements: [
        'African citizenship',
        'Demonstrated academic excellence',
        'Financial need',
        'Leadership potential',
        'Commitment to giving back to Africa'
      ],
      benefits: [
        'Full tuition coverage',
        'Living expenses',
        'Books and supplies',
        'Leadership development',
        'Mentorship program'
      ],
      applicationProcess: [
        'Complete online application',
        'Submit academic transcripts',
        'Provide financial documentation',
        'Write personal essays',
        'Attend interview if selected'
      ],
      image: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg'
    },
    {
      id: '2',
      title: 'Tech Skills Bootcamp - Lagos',
      organization: 'TechPoint Africa',
      category: 'Skills',
      deadline: 'February 28, 2024',
      location: 'Lagos, Nigeria',
      match: 88,
      difficulty: 'Medium' as const,
      applicants: '2,000+',
      successRate: '25%',
      description:
        '6-month intensive programming bootcamp designed to transform beginners into job-ready developers.',
      requirements: [
        'Basic computer literacy',
        'Commitment to full-time learning',
        'Age 18-35',
        'Passion for technology',
        'Available for 6 months'
      ],
      benefits: [
        'Full-stack development training',
        'Job placement assistance',
        'Industry mentorship',
        'Project portfolio development',
        'Networking opportunities'
      ],
      applicationProcess: [
        'Submit online application',
        'Complete coding challenge',
        'Attend virtual interview',
        'Participate in orientation',
        'Begin intensive training'
      ],
      image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg'
    },
    {
      id: '3',
      title: 'Young Entrepreneurs Network',
      organization: 'African Entrepreneurship Network',
      category: 'Networking',
      deadline: 'Ongoing',
      location: 'Pan-African',
      match: 82,
      difficulty: 'Easy' as const,
      applicants: '5,000+',
      successRate: '60%',
      description:
        'Connect with like-minded entrepreneurs across Africa and access resources for business growth.',
      requirements: [
        'African resident or citizen',
        'Business idea or existing business',
        'Age 18-40',
        'Commitment to networking',
        'Entrepreneurial mindset'
      ],
      benefits: [
        'Access to mentor network',
        'Business development resources',
        'Funding opportunities',
        'Regular networking events',
        'Online community access'
      ],
      applicationProcess: [
        'Create profile on platform',
        'Submit business pitch',
        'Connect with mentors',
        'Participate in events',
        'Access resources and funding'
      ],
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg'
    }
  ];

  const formatDateShort = (deadline?: string) => {
    if (!deadline) {
      return 'No deadline';
    }
    const parsed = new Date(deadline);
    if (Number.isNaN(parsed.getTime())) {
      return 'No deadline';
    }
    return parsed.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
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
    const diffDays = Math.round(
      (parsed.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
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

  const getPriorityBadgeClass = (priority?: string) => {
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

  const formatUpdatedAt = (updatedAt: string) => {
    const parsed = new Date(updatedAt);
    if (Number.isNaN(parsed.getTime())) {
      return '';
    }
    const diffMs = Date.now() - parsed.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    if (diffMinutes < 1) {
      return 'Moments ago';
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

  const orderedGoals = useMemo(() => {
    const statusRank = (status: string) => {
      if (status === 'active') return 0;
      if (status === 'completed') return 1;
      return 2;
    };
    const priorityRank = (priority?: string) => {
      if (priority === 'high') return 0;
      if (priority === 'medium') return 1;
      if (priority === 'low') return 2;
      return 3;
    };

    return [...goals]
      .filter((goal) => goal.status !== 'archived')
      .sort((a, b) => {
        const statusDiff = statusRank(a.status) - statusRank(b.status);
        if (statusDiff !== 0) return statusDiff;

        const priorityDiff = priorityRank(a.priority) - priorityRank(b.priority);
        if (priorityDiff !== 0) return priorityDiff;

        const deadlineA = a.deadline ? new Date(a.deadline).getTime() : Number.MAX_SAFE_INTEGER;
        const deadlineB = b.deadline ? new Date(b.deadline).getTime() : Number.MAX_SAFE_INTEGER;
        if (deadlineA !== deadlineB) return deadlineA - deadlineB;

        return a.progress - b.progress;
      });
  }, [goals]);

  const focusGoals = useMemo(() => orderedGoals.slice(0, 3), [orderedGoals]);
  const hasMoreGoals = orderedGoals.length > focusGoals.length;

  const activeGoals = useMemo(() => goals.filter((goal) => goal.status === 'active'), [goals]);
  const completedGoals = useMemo(() => goals.filter((goal) => goal.status === 'completed'), [goals]);
  const openGoals = useMemo(() => goals.filter((goal) => goal.status !== 'archived'), [goals]);

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

  const completionRate = openGoals.length
    ? Math.round((completedGoals.length / openGoals.length) * 100)
    : 0;

  const nextDeadlineGoal = useMemo(() => {
    const withDeadline = activeGoals.filter((goal) => goal.deadline);
    return withDeadline.sort(
      (a, b) =>
        new Date(a.deadline as string).getTime() - new Date(b.deadline as string).getTime()
    )[0] ?? null;
  }, [activeGoals]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Target size={18} /> },
    { id: 'all-goals', label: 'All Goals', icon: <CheckCircle2 size={18} /> },
    { id: 'opportunities', label: 'Opportunities', icon: <Briefcase size={18} /> },
    { id: 'chat', label: 'AI Coach', icon: <MessageCircle size={18} /> },
    { id: 'community-marketplace', label: 'Community Roadmaps', icon: <Globe size={18} /> },
    { id: 'cv-management', label: 'CV Management', icon: <FileText size={18} /> },
    { id: 'add-goal', label: 'Add Goal', icon: <Plus size={18} /> },
    { id: 'profile', label: 'Profile', icon: <Users size={18} /> }
  ];

  const stats = useMemo(
    () => [
      {
        label: 'Active goals',
        value: activeGoals.length.toString(),
        helper: `${completedGoals.length} completed Â· ${completionRate}% done`
      },
      {
        label: 'Consistency',
        value: `${consistencyScore}%`,
        helper:
          consistencyScore >= 70
            ? 'Momentum looks strong'
            : 'Aim for 70% consistency'
      },
      {
        label: 'Avg progress',
        value: `${averageProgress}%`,
        helper: activeGoals.length ? 'Across active goals' : 'Add a goal to start tracking'
      },
      {
        label: 'Next deadline',
        value: nextDeadlineGoal ? formatDateShort(nextDeadlineGoal.deadline) : 'No deadline',
        helper: nextDeadlineGoal
          ? `${describeDueDate(nextDeadlineGoal.deadline)} · ${nextDeadlineGoal.title}`
          : 'Add a deadline to stay on pace'
      }
    ],
    [
      activeGoals.length,
      completedGoals.length,
      completionRate,
      consistencyScore,
      averageProgress,
      nextDeadlineGoal?.id,
      nextDeadlineGoal?.deadline,
      nextDeadlineGoal?.title
    ]
  );

  const handleAddGoal = () => {
    if (onAddGoal) {
      onAddGoal();
    }
  };

  const handleViewAllGoalsClick = () => {
    if (onViewAllGoals) {
      onViewAllGoals();
    }
  };

  const handleMenuItemClick = (itemId: string) => {
    setShowMenu(false);
    if (itemId === 'add-goal') {
      handleAddGoal();
      return;
    }
    if (itemId === 'all-goals') {
      handleViewAllGoalsClick();
      return;
    }
    if (itemId === 'opportunities') {
      onViewAllOpportunities();
      return;
    }
    if (onNavigate) {
      onNavigate(itemId);
    }
  };

  const headerTone = isDarkMode ? 'bg-gray-900/95 backdrop-blur border-gray-800' : 'bg-white border-slate-200';
  const controlTone = isDarkMode ? 'border-white/10 text-white hover:bg-white/10' : 'border-slate-200 text-slate-600 hover:bg-slate-100';
  const popupTone = isDarkMode ? 'bg-gray-900/95 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800';
  const trayTone = isDarkMode ? 'bg-white/5' : 'bg-slate-50';
  const badgeTone = isDarkMode ? 'bg-white/10 text-white' : 'bg-primary/10 text-primary';
  const navItemTone = isDarkMode ? 'text-gray-200 hover:text-white' : 'text-slate-600 hover:text-primary';

  const handleCommunityMarketplace = () => {
    if (onNavigate) {
      onNavigate('community-marketplace');
    }
  };

  const handleCVManagement = () => {
    if (onNavigate) {
      onNavigate('cv-management');
    }
  };

  const handleViewMoreAchievements = () => {
    if (onNavigate) {
      onNavigate('achievements');
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} animate-fade-in`}>
      <header className={`sticky top-0 z-30 border-b ${headerTone}`}>
        <div className="px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="flex shrink-0 items-center gap-3">
              <svg viewBox="0 0 64 64" className="h-9 w-9" aria-hidden="true">
                <path d="M32 8 6 19.5 32 31l26-11.5L32 8z" fill="#2c3192" />
                <path d="M14 27v10.5C14 44 22.8 49.5 32 49.5S50 44 50 37.5V27l-18 8-18-8z" fill="#2c3192" opacity="0.85" />
                <path d="M30 24h4v16l6-6 3 3-10 10-10-10 3-3 4 4V24z" fill="#1fb6aa" />
              </svg>
              <span className={`text-xl font-black tracking-tight sm:text-2xl ${isDarkMode ? 'text-white' : 'text-primary'}`}>
                edutu
              </span>
            </div>
            <nav className="hidden flex-1 items-center justify-center gap-6 lg:flex">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMenuItemClick(item.id)}
                  className={`text-sm font-semibold tracking-wide transition-colors ${navItemTone}`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowNotifications(true)}
                className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition-all ${controlTone}`}
                aria-label="Open notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowMenu((prev) => !prev)}
                className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all ${controlTone}`}
                aria-expanded={showMenu}
                aria-controls="dashboard-menu-popup"
                aria-label="Open navigation menu"
              >
                {showMenu ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>
        {/* Greeting and Daily Motivation Section */}
        <div className="px-6 py-6">
          <div className="mb-6">
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Good day, {user?.name?.split(' ')[0] ?? 'there'}!
            </h1>
            <div className={`mt-2 p-4 rounded-2xl ${isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`text-sm italic ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                "Success is the sum of small efforts repeated day in and day out." - Robert Collier
              </p>
            </div>
          </div>
        </div>

      {showMenu && (
        <div className="fixed inset-0 z-[60]">
          <button
            type="button"
            onClick={() => setShowMenu(false)}
            className="absolute inset-0"
            aria-label="Close menu overlay"
          />
          <div
            id="dashboard-menu-popup"
            className={`absolute right-4 top-20 w-[min(100%,20rem)] rounded-3xl border shadow-2xl sm:right-6 sm:top-24 ${popupTone}`}
          >
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-xs font-semibold uppercase tracking-[0.3em]">Menu</span>
              <button
                type="button"
                onClick={() => setShowMenu(false)}
                className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${controlTone}`}
                aria-label="Close menu"
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-4 px-5 pb-5">
              <div className={`rounded-2xl px-4 py-3 ${trayTone}`}>
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    setShowNotifications(true);
                  }}
                  className="flex w-full items-center justify-between text-sm font-medium"
                >
                  <span className="flex items-center gap-3">
                    <span className={`grid h-9 w-9 place-items-center rounded-xl ${badgeTone}`}>
                      <Bell size={18} />
                    </span>
                    Recent alerts
                  </span>
                  {unreadCount > 0 && (
                    <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-rose-500 px-2 text-[10px] font-bold text-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              </div>
              <nav className="space-y-2" aria-label="Dashboard navigation">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMenuItemClick(item.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold transition-colors ${
                      isDarkMode ? 'hover:bg-white/10' : 'hover:bg-slate-100'
                    }`}
                  >
                    <span className={`grid h-8 w-8 place-items-center rounded-xl ${badgeTone}`}>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      <div className="px-6 py-6">
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-2">
          {stats.map((stat, index) => (
            <Card
              key={stat.label}
              className={`border-none p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                isDarkMode ? 'bg-gray-800/70' : 'bg-gradient-to-br from-white to-primary/5'
              }`}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <p className="text-xs uppercase tracking-wide text-muted">{stat.label}</p>
              <p className="mt-3 text-2xl font-semibold text-brand-600">{stat.value}</p>
              <p className="mt-2 text-xs text-muted">{stat.helper}</p>
            </Card>
          ))}
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">
        <Card
          className="cursor-pointer border-none bg-gradient-to-br from-emerald-50 to-emerald-100 p-5 text-emerald-900 transition hover:-translate-y-1 hover:shadow-lg dark:from-emerald-700/30 dark:to-emerald-600/20 dark:text-emerald-200"
          onClick={handleCommunityMarketplace}
        >
          <div className="relative">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-white/60 p-3 text-emerald-600 shadow-inner dark:bg-emerald-900/50 dark:text-emerald-200">
                <Globe size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Community roadmaps</h2>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600/20 text-emerald-600 dark:text-emerald-300 dark:bg-emerald-500/20">
                    <ChevronRight size={16} />
                  </div>
                </div>
                <p className="mt-1 text-sm opacity-80">
                  Discover playbooks from ambitious builders across the continent. Learn the exact moves that worked.
                </p>
                <div className="mt-2 flex flex-wrap gap-1 text-xs font-medium">
                  <span className="rounded-full bg-white/70 px-2 py-1 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                    500+ curated paths
                  </span>
                  <span className="rounded-full bg-white/70 px-2 py-1 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                    Weekly live sessions
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card
          className={`${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} p-5 cursor-pointer transition hover:-translate-y-1 hover:shadow-lg`}
          onClick={handleCVManagement}
        >
          <div className="relative">
            <div className="flex items-start gap-3">
              <div
                className={`rounded-xl p-3 shadow-inner ${
                  isDarkMode ? 'bg-blue-900/30 text-blue-200' : 'bg-blue-50 text-blue-600'
                }`}
              >
                <Upload size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">CV workspace</h2>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-300 dark:bg-blue-500/20">
                    <ChevronRight size={16} />
                  </div>
                </div>
                <p className="mt-1 text-sm text-soft">
                  Upload, optimise, and version your CV with instant AI quality checks and recruiter tips.
                </p>
                <div className="mt-2 flex flex-wrap gap-1 text-xs text-muted">
                  <span className="rounded-full bg-blue-500/10 px-2 py-1 text-blue-600 dark:text-blue-300">
                    ATS scan
                  </span>
                  <span className="rounded-full bg-blue-500/10 px-2 py-1 text-blue-600 dark:text-blue-300">
                    Tone adjustments
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 shadow-sm`}>
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Target size={20} className="text-primary" />
                <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Focus this week
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {goals.length > 0 && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleViewAllGoalsClick}
                    className="flex-shrink-0"
                  >
                    View all
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={handleAddGoal}
                  className="inline-flex items-center gap-2 px-4 py-2 flex-shrink-0"
                >
                  <Plus size={14} />
                  Add goal
                </Button>
              </div>
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {goals.length === 0
                ? 'Create your first goal to start tracking your momentum.'
                : hasMoreGoals
                ? `Showing your top ${focusGoals.length} goals. View all to explore everything you are working on.`
                : 'Stay close to the goals that compound your growth.'}
            </p>
          </div>
          <div className="space-y-4">
            {focusGoals.length === 0 ? (
              <div
                className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center ${
                  isDarkMode ? 'border-gray-700 bg-gray-800/70 text-gray-300' : 'border-gray-200 bg-gray-50 text-gray-600'
                }`}
              >
                <Target size={28} className="text-primary" />
                <h3 className="mt-3 text-base font-semibold">No goals yet</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Add a goal to see it tracked here and across your dashboard.
                </p>
                <Button onClick={handleAddGoal} className="mt-4 inline-flex items-center gap-2">
                  <Plus size={14} />
                  Add goal
                </Button>
              </div>
            ) : (
              focusGoals.map((goal, index) => {
                const progress = Math.min(Math.max(Math.round(goal.progress), 0), 100);
                const deadlineLabel = formatDateShort(goal.deadline);
                const dueCopy = describeDueDate(goal.deadline);
                const isCompleted = goal.status === 'completed';
                const updatedCopy = formatUpdatedAt(goal.updatedAt);
                const description =
                  goal.description && goal.description.length > 110
                    ? `${goal.description.slice(0, 110)}...`
                    : goal.description;
                const trailingCopy = isCompleted
                  ? 'Completed'
                  : updatedCopy
                  ? `Updated ${updatedCopy}`
                  : null;
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => onGoalClick(goal.id)}
                    className={`w-full rounded-2xl border px-4 py-4 text-left transition-all animate-slide-up ${
                      isDarkMode
                        ? 'border-gray-700 bg-gray-800 hover:bg-gray-700'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            {goal.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-muted">
                            <span>{deadlineLabel}</span>
                            <ChevronRight size={16} className="text-muted" />
                          </div>
                        </div>
                        {description && (
                          <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {description}
                          </p>
                        )}
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
                          <span
                            className={
                              isCompleted
                                ? 'font-medium text-green-600 dark:text-green-400'
                                : undefined
                            }
                          >
                            {isCompleted ? 'Completed' : dueCopy}
                          </span>
                          {goal.priority && (
                            <span
                              className={`rounded-full border px-2 py-1 capitalize ${getPriorityBadgeClass(goal.priority)}`}
                            >
                              Priority {goal.priority}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={`mt-3 h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="font-medium text-primary">{progress}% complete</span>
                      {trailingCopy && (
                        <span
                          className={`${
                            isCompleted ? 'text-green-600 dark:text-green-400' : 'text-muted'
                          }`}
                        >
                          {trailingCopy}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </Card>

        <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Target size={20} className="text-brand-600" />
              <h2 className="text-lg font-semibold">Opportunities for you</h2>
            </div>
            <Button variant="secondary" size="sm" onClick={onViewAllOpportunities}>
              View all
            </Button>
          </div>
          <div className="mt-4 space-y-4">
            {opportunities.map((opp, index) => (
              <div
                key={opp.id}
                className="rounded-2xl border border-subtle bg-surface-layer p-4 transition hover:border-brand-200 hover:shadow-elevated"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => onOpportunityClick(opp)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold">{opp.title}</h3>
                    <p className="text-sm text-soft">{opp.description.slice(0, 110)}...</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                      <span className="rounded-full bg-brand-600/10 px-3 py-1 text-brand-600">{opp.category}</span>
                      <span>Due {opp.deadline}</span>
                      <span>{opp.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-right text-sm font-semibold text-success">
                    {opp.match}% match
                    <ChevronRight size={18} className="text-muted" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <TrendingUp size={20} className="text-accent-500" />
              <h2 className="text-lg font-semibold">Recent wins</h2>
            </div>
            <Button variant="secondary" size="sm" onClick={handleViewMoreAchievements}>
              View more
            </Button>
          </div>
          <div className="mt-3 space-y-1">
            {recentAchievements.slice(0, 4).map((achievement, index) => (
              <div
                key={achievement.id}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-gray-100 dark:hover:bg-gray-700/60"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent-500/10 text-accent-500 opacity-70">
                  {achievement.icon}
                </div>
                <div className="flex flex-1 items-baseline justify-between">
                  <p className="text-xs font-medium text-soft opacity-80">{achievement.title}</p>
                  <span className="text-[0.65rem] text-muted opacity-70">{achievement.date}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <NotificationInbox isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
    </div>
  );
};

export default Dashboard;




