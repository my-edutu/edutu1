import React, { useEffect, useMemo, useState } from 'react';
import { 
  ArrowLeft, 
  Target, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  ChevronDown, 
  ChevronRight,
  Star,
  Clock,
  TrendingUp,
  Bell,
  Users
} from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';
import { useDarkMode } from '../hooks/useDarkMode';
import { useGoals } from '../hooks/useGoals';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface Week {
  id: string;
  title: string;
  tasks: Task[];
}

interface Month {
  id: string;
  title: string;
  description: string;
  weeks: Week[];
  isExpanded: boolean;
}

interface PersonalizedRoadmapProps {
  onBack: () => void;
  goalId?: string;
}

const PersonalizedRoadmap: React.FC<PersonalizedRoadmapProps> = ({ 
  onBack, 
  goalId
}) => {
  const { goals, updateGoal } = useGoals();
  const activeGoal = useMemo(
    () => {
      if (goalId) {
        const match = goals.find((goal) => goal.id === goalId);
        if (match) {
          return match;
        }
      }
      return goals.length > 0 ? goals[0] : null;
    },
    [goals, goalId]
  );
  const goalTitle = activeGoal?.title ?? 'Complete Python Course';
  const [roadmapData, setRoadmapData] = useState<Month[]>([
    {
      id: 'month1',
      title: 'Month 1: Foundation Building',
      description: 'Establish strong fundamentals and create your learning environment',
      isExpanded: true,
      weeks: [
        {
          id: 'week1',
          title: 'Week 1: Getting Started',
          tasks: [
            { id: 't1', title: 'Set up Python development environment', completed: true, priority: 'high' },
            { id: 't2', title: 'Complete Python basics tutorial', completed: true, priority: 'high' },
            { id: 't3', title: 'Join Python community forums', completed: false, priority: 'medium' },
            { id: 't4', title: 'Create GitHub account and first repository', completed: false, priority: 'medium' }
          ]
        },
        {
          id: 'week2',
          title: 'Week 2: Core Concepts',
          tasks: [
            { id: 't5', title: 'Master variables and data types', completed: false, priority: 'high' },
            { id: 't6', title: 'Practice control structures (if/else, loops)', completed: false, priority: 'high' },
            { id: 't7', title: 'Build 3 simple calculator programs', completed: false, priority: 'medium' },
            { id: 't8', title: 'Read "Automate the Boring Stuff" chapters 1-3', completed: false, priority: 'low' }
          ]
        },
        {
          id: 'week3',
          title: 'Week 3: Functions & Modules',
          tasks: [
            { id: 't9', title: 'Learn function definition and calling', completed: false, priority: 'high' },
            { id: 't10', title: 'Understand scope and parameters', completed: false, priority: 'high' },
            { id: 't11', title: 'Explore built-in modules', completed: false, priority: 'medium' },
            { id: 't12', title: 'Create your first custom module', completed: false, priority: 'medium' }
          ]
        },
        {
          id: 'week4',
          title: 'Week 4: Data Structures',
          tasks: [
            { id: 't13', title: 'Master lists, tuples, and dictionaries', completed: false, priority: 'high' },
            { id: 't14', title: 'Practice list comprehensions', completed: false, priority: 'medium' },
            { id: 't15', title: 'Build a contact book application', completed: false, priority: 'medium' },
            { id: 't16', title: 'Complete month 1 assessment quiz', completed: false, priority: 'high' }
          ]
        }
      ]
    },
    {
      id: 'month2',
      title: 'Month 2: Intermediate Skills',
      description: 'Dive deeper into Python with object-oriented programming and file handling',
      isExpanded: false,
      weeks: [
        {
          id: 'week5',
          title: 'Week 5: Object-Oriented Programming',
          tasks: [
            { id: 't17', title: 'Learn classes and objects', completed: false, priority: 'high' },
            { id: 't18', title: 'Understand inheritance and polymorphism', completed: false, priority: 'high' },
            { id: 't19', title: 'Build a simple game using OOP', completed: false, priority: 'medium' },
            { id: 't20', title: 'Practice encapsulation concepts', completed: false, priority: 'medium' }
          ]
        },
        {
          id: 'week6',
          title: 'Week 6: File Handling & APIs',
          tasks: [
            { id: 't21', title: 'Master file reading and writing', completed: false, priority: 'high' },
            { id: 't22', title: 'Learn JSON data handling', completed: false, priority: 'high' },
            { id: 't23', title: 'Make your first API request', completed: false, priority: 'medium' },
            { id: 't24', title: 'Build a weather app using APIs', completed: false, priority: 'low' }
          ]
        },
        {
          id: 'week7',
          title: 'Week 7: Error Handling & Testing',
          tasks: [
            { id: 't25', title: 'Learn try/except blocks', completed: false, priority: 'high' },
            { id: 't26', title: 'Understand different exception types', completed: false, priority: 'medium' },
            { id: 't27', title: 'Write your first unit tests', completed: false, priority: 'medium' },
            { id: 't28', title: 'Debug existing code projects', completed: false, priority: 'low' }
          ]
        },
        {
          id: 'week8',
          title: 'Week 8: Libraries & Frameworks',
          tasks: [
            { id: 't29', title: 'Explore popular Python libraries', completed: false, priority: 'high' },
            { id: 't30', title: 'Learn basic web scraping with BeautifulSoup', completed: false, priority: 'medium' },
            { id: 't31', title: 'Try data analysis with pandas', completed: false, priority: 'medium' },
            { id: 't32', title: 'Complete month 2 project', completed: false, priority: 'high' }
          ]
        }
      ]
    },
    {
      id: 'month3',
      title: 'Month 3: Advanced Applications',
      description: 'Build real-world projects and prepare for certification',
      isExpanded: false,
      weeks: [
        {
          id: 'week9',
          title: 'Week 9: Web Development',
          tasks: [
            { id: 't33', title: 'Learn Flask framework basics', completed: false, priority: 'high' },
            { id: 't34', title: 'Build a simple web application', completed: false, priority: 'high' },
            { id: 't35', title: 'Understand HTML templates', completed: false, priority: 'medium' },
            { id: 't36', title: 'Deploy your app to Heroku', completed: false, priority: 'low' }
          ]
        },
        {
          id: 'week10',
          title: 'Week 10: Database Integration',
          tasks: [
            { id: 't37', title: 'Learn SQLite basics', completed: false, priority: 'high' },
            { id: 't38', title: 'Connect Python to database', completed: false, priority: 'high' },
            { id: 't39', title: 'Build CRUD operations', completed: false, priority: 'medium' },
            { id: 't40', title: 'Create a task management app', completed: false, priority: 'medium' }
          ]
        },
        {
          id: 'week11',
          title: 'Week 11: Final Project',
          tasks: [
            { id: 't41', title: 'Plan your capstone project', completed: false, priority: 'high' },
            { id: 't42', title: 'Implement core functionality', completed: false, priority: 'high' },
            { id: 't43', title: 'Add user interface and styling', completed: false, priority: 'medium' },
            { id: 't44', title: 'Write project documentation', completed: false, priority: 'medium' }
          ]
        },
        {
          id: 'week12',
          title: 'Week 12: Certification & Next Steps',
          tasks: [
            { id: 't45', title: 'Complete final assessment', completed: false, priority: 'high' },
            { id: 't46', title: 'Apply for Python certification', completed: false, priority: 'high' },
            { id: 't47', title: 'Update LinkedIn and resume', completed: false, priority: 'medium' },
            { id: 't48', title: 'Plan advanced learning path', completed: false, priority: 'low' }
          ]
        }
      ]
    }
  ]);
  useEffect(() => {
    if (!activeGoal) {
      return;
    }
    setRoadmapData((prev) => {
      const allTasks = prev.flatMap((month) =>
        month.weeks.flatMap((week) => week.tasks)
      );
      const totalTasks = allTasks.length;
      if (totalTasks === 0) {
        return prev;
      }
      const targetCompleted = Math.round((activeGoal.progress / 100) * totalTasks);
      const currentCompleted = allTasks.filter((task) => task.completed).length;
      if (currentCompleted === targetCompleted) {
        return prev;
      }
      let completedSoFar = 0;
      return prev.map((month) => ({
        ...month,
        weeks: month.weeks.map((week) => ({
          ...week,
          tasks: week.tasks.map((task) => {
            const shouldComplete = completedSoFar < targetCompleted;
            const updatedTask = { ...task, completed: shouldComplete };
            if (shouldComplete) {
              completedSoFar += 1;
            }
            return updatedTask;
          })
        }))
      }));
    });
  }, [activeGoal?.id, activeGoal?.progress]);

  const allTasks = useMemo(
    () => roadmapData.flatMap((month) => month.weeks.flatMap((week) => week.tasks)),
    [roadmapData]
  );
  const completedTasksCount = useMemo(
    () => allTasks.filter((task) => task.completed).length,
    [allTasks]
  );

  const [showNotification, setShowNotification] = useState(false);
  const { isDarkMode } = useDarkMode();

  const motivationalQuotes = [
    "Every expert was once a beginner. Keep going! 💪",
    "Code is poetry written in logic. Create your masterpiece! ✨",
    "The best time to plant a tree was 20 years ago. The second best time is now. 🌱",
    "Progress, not perfection. Every line of code counts! 🚀"
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    scrollToTop();
    onBack();
  };

  const toggleMonth = (monthId: string) => {
    setRoadmapData(prev => 
      prev.map(month => 
        month.id === monthId 
          ? { ...month, isExpanded: !month.isExpanded }
          : month
      )
    );
  };

  const toggleTask = (monthId: string, weekId: string, taskId: string) => {
    setRoadmapData((prev) => {
      const next = prev.map((month) =>
        month.id === monthId
          ? {
              ...month,
              weeks: month.weeks.map((week) =>
                week.id === weekId
                  ? {
                      ...week,
                      tasks: week.tasks.map((task) =>
                        task.id === taskId
                          ? { ...task, completed: !task.completed }
                          : task
                      )
                    }
                  : week
              )
            }
          : month
      );

      if (activeGoal) {
        const allTasks = next.flatMap((month) =>
          month.weeks.flatMap((week) => week.tasks)
        );
        const completedTasks = allTasks.filter((task) => task.completed).length;
        const totalTasks = allTasks.length || 1;
        const newProgress = Math.round((completedTasks / totalTasks) * 100);
        updateGoal(activeGoal.id, {
          progress: newProgress,
          status: newProgress >= 100 ? 'completed' : 'active',
          completedAt: newProgress >= 100 ? new Date().toISOString() : null
        });
      }

      return next;
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
      case 'low': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  };

  const handleSetReminders = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleJoinCommunity = () => {
    scrollToTop();
    // Navigate to community page
  };

  const totalTasks = allTasks.length;
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasksCount / totalTasks) * 100);
  const formattedDeadline = activeGoal?.deadline
    ? new Date(activeGoal.deadline).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'No deadline';
  const daysRemaining = activeGoal?.deadline
    ? Math.ceil(
        (new Date(activeGoal.deadline).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      )
    : null;
  const deadlineCopy =
    activeGoal?.deadline && daysRemaining !== null
      ? daysRemaining > 0
        ? `${formattedDeadline} (${daysRemaining} day${daysRemaining === 1 ? '' : 's'} left)`
        : daysRemaining === 0
        ? `${formattedDeadline} (deadline today)`
        : `${formattedDeadline} (deadline passed)`
      : formattedDeadline;
  const priorityLabel = activeGoal?.priority
    ? `${activeGoal.priority.charAt(0).toUpperCase()}${activeGoal.priority.slice(1)}`
    : 'Not set';
  const statusLabel = activeGoal
    ? activeGoal.status === 'completed'
      ? 'Completed'
      : 'In progress'
    : 'Not started';

  return (
    <div className={`min-h-screen bg-white dark:bg-gray-900 animate-fade-in ${isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="secondary"
              onClick={handleBack}
              className="p-2 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              <ArrowLeft size={20} />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">Your Success Roadmap 🎯</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">{goalTitle}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Progress</span>
              <span className="text-sm font-bold text-primary">{progress}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-500 relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">
                {completedTasksCount}/{totalTasks}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Tasks complete</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-accent">{deadlineCopy}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Target date</div>
            </div>
            <div className="text-center">
              <div
                className={`text-lg font-bold ${
                  activeGoal?.status === 'completed' ? 'text-green-600' : 'text-primary'
                }`}
              >
                {statusLabel}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Priority: {priorityLabel}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {showNotification && (
        <div className="fixed top-20 left-4 right-4 z-50 animate-slide-up">
          <div className="bg-green-500 text-white p-4 rounded-2xl shadow-lg">
            <div className="flex items-center gap-2">
              <Bell size={20} />
              <span className="font-medium">Reminders Set!</span>
            </div>
            <p className="text-sm mt-1">You'll be notified about important milestones and deadlines.</p>
          </div>
        </div>
      )}

      {/* Roadmap Content */}
      <div className="p-4 space-y-6">
        {roadmapData.map((month, monthIndex) => (
          <Card key={month.id} className="overflow-hidden animate-slide-up dark:bg-gray-800 dark:border-gray-700" style={{ animationDelay: `${monthIndex * 100}ms` }}>
            {/* Month Header */}
            <button
              onClick={() => toggleMonth(month.id)}
              className="w-full flex items-center justify-between p-2 -m-2 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  {monthIndex + 1}
                </div>
                <div className="text-left">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{month.title}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{month.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {month.weeks.flatMap(w => w.tasks).filter(t => t.completed).length}/
                  {month.weeks.flatMap(w => w.tasks).length}
                </div>
                {month.isExpanded ? (
                  <ChevronDown size={20} className="text-gray-400" />
                ) : (
                  <ChevronRight size={20} className="text-gray-400" />
                )}
              </div>
            </button>

            {/* Month Content */}
            {month.isExpanded && (
              <div className="mt-6 space-y-4 animate-slide-up">
                {month.weeks.map((week, weekIndex) => (
                  <div key={week.id} className="relative">
                    {/* Timeline Dot */}
                    <div className="absolute left-4 top-6 w-3 h-3 bg-primary rounded-full border-2 border-white dark:border-gray-800 shadow-md"></div>
                    <div className="absolute left-5 top-12 w-0.5 h-full bg-gray-200 dark:bg-gray-600"></div>

                    {/* Week Card */}
                    <div className="ml-12 bg-gray-50 dark:bg-gray-700 rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar size={16} className="text-primary" />
                        <h3 className="font-medium text-gray-800 dark:text-white">{week.title}</h3>
                        <div className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                          {week.tasks.filter(t => t.completed).length}/{week.tasks.length} done
                        </div>
                      </div>

                      {/* Tasks */}
                      <div className="space-y-2">
                        {week.tasks.map((task, taskIndex) => (
                          <div
                            key={task.id}
                            className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer hover:bg-white dark:hover:bg-gray-600 ${
                              task.completed ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500'
                            } animate-slide-up`}
                            style={{ animationDelay: `${taskIndex * 50}ms` }}
                            onClick={() => toggleTask(month.id, week.id, task.id)}
                          >
                            <button className="flex-shrink-0">
                              {task.completed ? (
                                <CheckCircle2 size={20} className="text-green-600" />
                              ) : (
                                <Circle size={20} className="text-gray-400 hover:text-primary transition-colors" />
                              )}
                            </button>
                            <div className="flex-1">
                              <p className={`text-sm ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-white'}`}>
                                {task.title}
                              </p>
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Motivational Quote for Completed Weeks */}
                      {week.tasks.filter(t => !t.completed).length === 0 && (
                        <div className="mt-4 p-3 bg-accent/10 dark:bg-accent/20 rounded-xl border border-accent/20 dark:border-accent/30">
                          <div className="flex items-center gap-2 text-accent">
                            <Star size={16} />
                            <p className="text-sm font-medium">
                              {motivationalQuotes[weekIndex % motivationalQuotes.length]}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}

        {/* Completion Celebration */}
        {progress === 100 && (
          <Card className="text-center bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 dark:from-primary/20 dark:to-accent/20 dark:border-primary/30 dark:bg-gray-800 animate-bounce-subtle">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Congratulations!</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You've completed your Python learning journey! Time to celebrate and plan your next adventure.
            </p>
            <Button className="inline-flex items-center gap-2">
              <TrendingUp size={16} />
              Plan Next Goal
            </Button>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <Button 
            variant="secondary" 
            className="flex items-center justify-center gap-2 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            onClick={handleSetReminders}
          >
            <Bell size={16} />
            Set Reminders
          </Button>
          <Button 
            className="flex items-center justify-center gap-2"
            onClick={handleJoinCommunity}
          >
            <Users size={16} />
            Join Community
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedRoadmap;
