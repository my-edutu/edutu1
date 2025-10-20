import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer
} from 'react';

export type GoalStatus = 'active' | 'completed' | 'archived';

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category?: string;
  deadline?: string;
  progress: number;
  status: GoalStatus;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
  priority?: 'low' | 'medium' | 'high';
  source?: 'template' | 'custom' | 'imported';
  templateId?: string;
}

export interface GoalInput {
  title: string;
  description?: string;
  category?: string;
  deadline?: string;
  progress?: number;
  priority?: 'low' | 'medium' | 'high';
  source?: 'template' | 'custom' | 'imported';
  templateId?: string;
}

export interface GoalUpdate extends Partial<Omit<Goal, 'id' | 'createdAt'>> {}

interface GoalsContextValue {
  goals: Goal[];
  createGoal: (goal: GoalInput) => Goal;
  updateGoal: (id: string, updates: GoalUpdate) => void;
  deleteGoal: (id: string) => void;
  clearGoals: () => void;
}

type GoalsAction =
  | { type: 'hydrate'; payload: Goal[] }
  | { type: 'create'; payload: Goal }
  | { type: 'update'; payload: { id: string; updates: GoalUpdate } }
  | { type: 'delete'; payload: { id: string } }
  | { type: 'clear' };

const GOALS_STORAGE_KEY = 'edutu_goals_v1';

const defaultGoals: Goal[] = [
  {
    id: 'goal-default-python-course',
    title: 'Complete Python Course',
    description: 'Lock in your Python fundamentals so you can ship scripts faster.',
    category: 'Skill sprint',
    deadline: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
    progress: 75,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    priority: 'medium',
    source: 'template',
    templateId: 'python-course'
  },
  {
    id: 'goal-default-scholarships',
    title: 'Apply to 5 Scholarships',
    description: 'Position yourself for fully funded programs with a consistent pipeline.',
    category: 'Funding push',
    deadline: new Date(new Date().setDate(new Date().getDate() + 21)).toISOString(),
    progress: 40,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    priority: 'high',
    source: 'template',
    templateId: 'scholarship-applications'
  },
  {
    id: 'goal-default-portfolio',
    title: 'Build Portfolio Website',
    description: 'Craft a live portfolio that proves your skills to mentors and recruiters.',
    category: 'Brand lab',
    deadline: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
    progress: 20,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    priority: 'medium',
    source: 'template',
    templateId: 'portfolio-website'
  }
];

const GoalsContext = createContext<GoalsContextValue | undefined>(undefined);

function goalsReducer(state: Goal[], action: GoalsAction): Goal[] {
  switch (action.type) {
    case 'hydrate':
      return action.payload;
    case 'create':
      return [action.payload, ...state];
    case 'update':
      return state.map((goal) => {
        if (goal.id !== action.payload.id) {
          return goal;
        }

        const nextStatus = action.payload.updates.status ?? goal.status;
        let nextCompletedAt: string | null = goal.completedAt ?? null;

        if (action.payload.updates.completedAt !== undefined) {
          nextCompletedAt = action.payload.updates.completedAt;
        } else if (nextStatus === 'completed' && !goal.completedAt) {
          nextCompletedAt = new Date().toISOString();
        } else if (nextStatus !== 'completed') {
          nextCompletedAt = null;
        }

        return {
          ...goal,
          ...action.payload.updates,
          status: nextStatus,
          updatedAt: new Date().toISOString(),
          completedAt: nextCompletedAt
        };
      });
    case 'delete':
      return state.filter((goal) => goal.id !== action.payload.id);
    case 'clear':
      return [];
    default:
      return state;
  }
}

const safeParseGoals = (raw: string | null): Goal[] => {
  if (!raw) {
    return defaultGoals;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return defaultGoals;
    }
    return parsed
      .filter((item) => item && typeof item === 'object')
      .map((item) => {
        const fallbackDate = new Date().toISOString();
        return {
          id: typeof item.id === 'string' ? item.id : createGoalId(),
          title: typeof item.title === 'string' ? item.title : 'Untitled goal',
          description: typeof item.description === 'string' ? item.description : undefined,
          category: typeof item.category === 'string' ? item.category : undefined,
          deadline: typeof item.deadline === 'string' ? item.deadline : undefined,
          progress:
            typeof item.progress === 'number' && Number.isFinite(item.progress)
              ? Math.min(Math.max(item.progress, 0), 100)
              : 0,
          status: item.status === 'completed' || item.status === 'archived' ? item.status : 'active',
          createdAt: typeof item.createdAt === 'string' ? item.createdAt : fallbackDate,
          updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : fallbackDate,
          completedAt: typeof item.completedAt === 'string' ? item.completedAt : null,
          priority:
            item.priority === 'high' || item.priority === 'medium' || item.priority === 'low'
              ? item.priority
              : undefined,
          source:
            item.source === 'template' || item.source === 'custom' || item.source === 'imported'
              ? item.source
              : undefined,
          templateId: typeof item.templateId === 'string' ? item.templateId : undefined
        } as Goal;
      });
  } catch (error) {
    console.warn('Failed to parse stored goals, falling back to defaults', error);
    return defaultGoals;
  }
};

function createGoalId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `goal-${Math.random().toString(36).slice(2, 11)}`;
}

export const GoalsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [goals, dispatch] = useReducer(
    goalsReducer,
    [],
    () => {
      if (typeof window === 'undefined') {
        return defaultGoals;
      }
      return safeParseGoals(window.localStorage.getItem(GOALS_STORAGE_KEY));
    }
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
    } catch (error) {
      console.warn('Unable to persist goals to localStorage', error);
    }
  }, [goals]);

  const createGoal = useCallback(
    (input: GoalInput) => {
      const now = new Date().toISOString();
      const newGoal: Goal = {
        id: createGoalId(),
        title: input.title.trim(),
        description: input.description?.trim() || undefined,
        category: input.category || undefined,
        deadline: input.deadline || undefined,
        progress: Math.min(Math.max(input.progress ?? 0, 0), 100),
        status: input.progress && input.progress >= 100 ? 'completed' : 'active',
        createdAt: now,
        updatedAt: now,
        completedAt: input.progress && input.progress >= 100 ? now : null,
        priority: input.priority,
        source: input.source,
        templateId: input.templateId
      };
      dispatch({ type: 'create', payload: newGoal });
      return newGoal;
    },
    [dispatch]
  );

  const updateGoal = useCallback(
    (id: string, updates: GoalUpdate) => {
      dispatch({ type: 'update', payload: { id, updates } });
    },
    [dispatch]
  );

  const deleteGoal = useCallback(
    (id: string) => {
      dispatch({ type: 'delete', payload: { id } });
    },
    [dispatch]
  );

  const clearGoals = useCallback(() => {
    dispatch({ type: 'clear' });
  }, [dispatch]);

  const contextValue = useMemo<GoalsContextValue>(
    () => ({
      goals,
      createGoal,
      updateGoal,
      deleteGoal,
      clearGoals
    }),
    [goals, createGoal, updateGoal, deleteGoal, clearGoals]
  );

  return <GoalsContext.Provider value={contextValue}>{children}</GoalsContext.Provider>;
};

export function useGoals() {
  const context = useContext(GoalsContext);
  if (!context) {
    throw new Error('useGoals must be used within a GoalsProvider');
  }
  return context;
}
