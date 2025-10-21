import React, { useCallback, useMemo, useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  Lightbulb,
  Loader2,
  Moon,
  RefreshCw,
  Shield,
  Trash2
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/ToastProvider';
import { useGoals } from '../../../hooks/useGoals';
import { useAnalytics } from '../../../hooks/useAnalytics';
import { useOpportunities } from '../../../hooks/useOpportunities';
import { clearOpportunitiesCache } from '../../../services/opportunities';
import { setAdminOverride } from '../../../hooks/useAdminCheck';

interface LocalSnapshot {
  darkMode: boolean;
  adminOverride: boolean;
  analyticsStored: number;
  analyticsLastActivity: string | null;
  analyticsActiveDays: number;
}

const analyticsStorageKey = 'edutu.analytics.v1';

const readLocalSnapshot = (): LocalSnapshot => {
  if (typeof window === 'undefined') {
    return {
      darkMode: false,
      adminOverride: false,
      analyticsStored: 0,
      analyticsLastActivity: null,
      analyticsActiveDays: 0
    };
  }

  const darkMode = window.localStorage.getItem('darkMode') === 'true';
  const adminOverride = window.localStorage.getItem('edutu.admin.override') === 'true';
  const analyticsRaw = window.localStorage.getItem(analyticsStorageKey);
  let analyticsLastActivity: string | null = null;
  let analyticsActiveDays = 0;

  if (analyticsRaw) {
    try {
      const parsed = JSON.parse(analyticsRaw) as { activeDates?: string[] };
      if (Array.isArray(parsed.activeDates) && parsed.activeDates.length > 0) {
        analyticsActiveDays = parsed.activeDates.length;
        const mostRecent = parsed.activeDates[parsed.activeDates.length - 1];
        if (typeof mostRecent === 'string') {
          const parsedDate = new Date(mostRecent);
          if (!Number.isNaN(parsedDate.getTime())) {
            analyticsLastActivity = parsedDate.toLocaleString();
          }
        }
      }
    } catch {
      analyticsLastActivity = null;
      analyticsActiveDays = 0;
    }
  }

  return {
    darkMode,
    adminOverride,
    analyticsStored: analyticsRaw ? analyticsRaw.length : 0,
    analyticsLastActivity,
    analyticsActiveDays
  };
};

const systemStatusLabels: Record<'ok' | 'warn' | 'error', { label: string; variant: 'success' | 'default' | 'danger' }> =
  {
    ok: { label: 'Healthy', variant: 'success' },
    warn: { label: 'Action suggested', variant: 'default' },
    error: { label: 'Attention needed', variant: 'danger' }
  };

interface ActionConfig {
  id: string;
  title: string;
  description: string;
  tone: 'danger' | 'neutral';
  icon: React.ReactNode;
  buttonLabel: string;
  confirm?: string;
  run: () => Promise<void> | void;
}

const SystemTools: React.FC = () => {
  const { toast } = useToast();
  const { goals, clearGoals } = useGoals();
  const { stats } = useAnalytics();
  const {
    data: opportunityData,
    loading: opportunitiesLoading,
    refresh: refreshOpportunities
  } = useOpportunities();
  const [localSnapshot, setLocalSnapshot] = useState<LocalSnapshot>(() => readLocalSnapshot());
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const refreshLocalSnapshot = useCallback(() => {
    setLocalSnapshot(readLocalSnapshot());
  }, []);

  useEffect(() => {
    refreshLocalSnapshot();
  }, [refreshLocalSnapshot, goals.length, stats.daysActive]);

  const firebaseConfigured =
    Boolean(import.meta.env.VITE_FIREBASE_API_KEY) && Boolean(import.meta.env.VITE_FIREBASE_PROJECT_ID);
  const aiKeyPresent = Boolean(import.meta.env.VITE_OPENROUTER_API_KEY);
  const opportunityEndpoint =
    typeof import.meta.env.VITE_OPPORTUNITIES_API_URL === 'string' &&
    import.meta.env.VITE_OPPORTUNITIES_API_URL.trim().length > 0
      ? import.meta.env.VITE_OPPORTUNITIES_API_URL.trim()
      : '/data/opportunities.json';

  const environmentCards = useMemo(
    () => [
      {
        id: 'firebase',
        title: 'Firebase',
        description: firebaseConfigured
          ? `Project ${import.meta.env.VITE_FIREBASE_PROJECT_ID}`
          : 'Add Firebase keys to .env to enable live admin data.',
        status: firebaseConfigured ? 'ok' : 'warn'
      },
      {
        id: 'ai',
        title: 'AI bridge',
        description: aiKeyPresent
          ? 'OpenRouter key detected. AI mentor ready for routing.'
          : 'Missing OpenRouter key. AI enhancements will use mock data.',
        status: aiKeyPresent ? 'ok' : 'warn'
      },
      {
        id: 'opportunities',
        title: 'Opportunities source',
        description: opportunityEndpoint === '/data/opportunities.json'
          ? 'Using bundled static opportunities dataset.'
          : `External feed: ${opportunityEndpoint}`,
        status: 'ok' as const
      },
      {
        id: 'analytics-cache',
        title: 'Analytics cache',
        description:
          localSnapshot.analyticsStored > 0
            ? `${localSnapshot.analyticsStored} characters stored in local snapshot.`
            : 'No cached analytics detected.',
        status: localSnapshot.analyticsStored > 0 ? 'ok' : 'warn'
      }
    ],
    [aiKeyPresent, firebaseConfigured, localSnapshot.analyticsStored, opportunityEndpoint]
  );

  const runtimeInsights = useMemo(
    () => [
      {
        icon: <Lightbulb size={18} />,
        label: 'Goals tracked',
        value: goals.length ? `${goals.length} active` : 'No goals stored yet'
      },
      {
        icon: <CheckCircle2 size={18} />,
        label: 'Analytics streak',
        value:
          localSnapshot.analyticsActiveDays > 0
            ? `${localSnapshot.analyticsActiveDays} recorded days`
            : 'No analytics activity'
      },
      {
        icon: <Shield size={18} />,
        label: 'Admin override',
        value: localSnapshot.adminOverride ? 'Enabled for this browser' : 'Not set'
      },
      {
        icon: <Database size={18} />,
        label: 'Opportunities cached',
        value: opportunitiesLoading ? 'Loading...' : `${opportunityData.length} records`
      }
    ],
    [
      goals.length,
      localSnapshot.adminOverride,
      localSnapshot.analyticsActiveDays,
      opportunitiesLoading,
      opportunityData.length
    ]
  );

  const handleAction = useCallback(
    async (config: ActionConfig) => {
      if (actionLoading) {
        return;
      }

      if (config.confirm && typeof window !== 'undefined') {
        const confirmed = window.confirm(config.confirm);
        if (!confirmed) {
          return;
        }
      }

      try {
        setActionLoading(config.id);
        await Promise.resolve(config.run());
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to complete that action.';
        toast({
          title: 'Action failed',
          description: message,
          variant: 'error'
        });
      } finally {
        setActionLoading(null);
        // Actions may update local storage or cached data; refresh snapshot.
        refreshLocalSnapshot();
      }
    },
    [actionLoading, refreshLocalSnapshot, toast]
  );

  const actions = useMemo<ActionConfig[]>(
    () => [
      {
        id: 'reset-goals',
        title: 'Reset goals',
        description: 'Clears all locally stored goals and templates for this browser profile.',
        tone: 'danger',
        icon: <Trash2 size={18} />,
        buttonLabel: 'Clear goals',
        confirm: 'This removes every locally stored goal for this browser. Continue?',
        run: () => {
          clearGoals();
          toast({
            title: 'Goals cleared',
            description: 'Goal list has been reset for this browser.',
            variant: 'success'
          });
        }
      },
      {
        id: 'reset-analytics',
        title: 'Reset analytics',
        description: 'Purges local analytics streaks, sessions, and opportunity explores. Page reload required.',
        tone: 'danger',
        icon: <RefreshCw size={18} />,
        buttonLabel: 'Reset analytics',
        confirm: 'This clears your local analytics cache and reloads the page. Proceed?',
        run: () => {
          if (typeof window !== 'undefined') {
            window.localStorage.removeItem(analyticsStorageKey);
            toast({
            title: 'Analytics cache cleared',
            description: 'Reloading to rehydrate analytics...',
              variant: 'success'
            });
            window.setTimeout(() => {
              window.location.reload();
            }, 600);
          }
        }
      },
      {
        id: 'purge-opportunities',
        title: 'Purge opportunities cache',
        description: 'Clears the memoised opportunities dataset and refreshes the feed.',
        tone: 'neutral',
        icon: <RefreshCw size={18} />,
        buttonLabel: 'Refresh opportunities',
        run: () => {
          clearOpportunitiesCache();
          refreshOpportunities();
          toast({
            title: 'Opportunities cache cleared',
            description: 'Latest opportunities will load on next request.',
            variant: 'success'
          });
        }
      },
      {
        id: 'clear-cv',
        title: 'Clear CV cache',
        description: 'Removes stored CV records generated through the admin tooling.',
        tone: 'neutral',
        icon: <Trash2 size={18} />,
        buttonLabel: 'Clear CV records',
        run: () => {
          if (typeof window !== 'undefined') {
            window.localStorage.removeItem('edutu.cv.records');
          }
          toast({
            title: 'CV cache cleared',
            description: 'Any locally stored CV data has been removed.',
            variant: 'success'
          });
        }
      },
      {
        id: 'toggle-admin-override',
        title: localSnapshot.adminOverride ? 'Disable admin override' : 'Enable admin override',
        description: localSnapshot.adminOverride
          ? 'Removes the local override that grants admin access without Firebase roles.'
          : 'Sets a local override so this browser always loads the admin portal.',
        tone: localSnapshot.adminOverride ? 'neutral' : 'danger',
        icon: <Shield size={18} />,
        buttonLabel: localSnapshot.adminOverride ? 'Disable override' : 'Enable override',
        run: () => {
          if (typeof window !== 'undefined') {
            setAdminOverride(!localSnapshot.adminOverride);
          }
          toast({
            title: localSnapshot.adminOverride ? 'Admin override disabled' : 'Admin override enabled',
            description: localSnapshot.adminOverride
              ? 'Refresh auth to respect Firebase roles again.'
              : 'This browser will bypass Firebase role checks.',
            variant: 'success'
          });
        }
      },
      {
        id: 'reset-theme',
        title: 'Reset dark mode preference',
        description: 'Clears the saved theme selection so the next visit uses the default theme.',
        tone: 'neutral',
        icon: <Moon size={18} />,
        buttonLabel: 'Clear theme preference',
        run: () => {
          if (typeof window !== 'undefined') {
            window.localStorage.removeItem('darkMode');
          }
          toast({
            title: 'Theme preference cleared',
            description: 'Light mode will load until a new preference is chosen.',
            variant: 'success'
          });
        }
      }
    ],
    [clearGoals, localSnapshot.adminOverride, refreshOpportunities, toast]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Badge variant="outline" className="w-max items-center gap-2">
          <Shield size={14} className="text-brand-600" />
          System control
        </Badge>
        <h1 className="text-2xl font-semibold text-strong">Platform system tools</h1>
        <p className="text-sm text-muted">
          Inspect environment health, flush preview caches, and manage local overrides for the admin demo.
        </p>
      </div>

      <Card className="space-y-5 border border-subtle/70 bg-surface-layer">
        <div className="flex items-start justify-between gap-3 border-b border-subtle/60 pb-4">
          <div>
            <h2 className="text-base font-semibold text-strong">Environment snapshot</h2>
            <p className="text-sm text-muted">
              Real-time view of the configuration powering this admin environment.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {environmentCards.map((card) => {
            const status = systemStatusLabels[card.status];
            return (
              <div key={card.id} className="rounded-2xl border border-subtle bg-surface-elevated/70 px-4 py-4 shadow-soft">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-strong">{card.title}</p>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted">{card.description}</p>
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl border border-dashed border-subtle px-4 py-3 text-sm text-soft">
          {localSnapshot.analyticsLastActivity
            ? `Last analytics event recorded ${localSnapshot.analyticsLastActivity}.`
            : 'Analytics has not recorded any activity for this profile yet.'}
        </div>
      </Card>

      <Card className="space-y-5 border border-subtle/70 bg-surface-layer">
        <div className="flex items-start justify-between gap-3 border-b border-subtle/60 pb-4">
          <div>
            <h2 className="text-base font-semibold text-strong">Runtime insights</h2>
            <p className="text-sm text-muted">Key stats about what is currently stored for this admin preview.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {runtimeInsights.map((insight) => (
            <div key={insight.label} className="flex items-center gap-3 rounded-2xl border border-subtle px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 shadow-soft">
                {insight.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-strong">{insight.label}</p>
                <p className="text-xs text-muted">{insight.value}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-6 border border-subtle/70 bg-surface-layer">
        <div className="flex items-start justify-between gap-3 border-b border-subtle/60 pb-4">
          <div>
            <h2 className="text-base font-semibold text-strong">Administrative actions</h2>
            <p className="text-sm text-muted">
              Actions apply to this browser profile only. Use them to reset demo data or diagnose local issues.
            </p>
          </div>
          <Badge variant="outline" className="gap-1 text-xs">
            <AlertTriangle size={14} className="text-amber-500" />
            Irreversible
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {actions.map((action) => (
            <div key={action.id} className="flex h-full flex-col justify-between rounded-2xl border border-subtle bg-surface-elevated/60 p-4 shadow-soft">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                      action.tone === 'danger'
                        ? 'border-red-200 bg-red-50 text-red-600'
                        : 'border-brand-200 bg-brand-50 text-brand-600'
                    }`}
                  >
                    {action.icon}
                  </div>
                  <p className="text-sm font-semibold text-strong">{action.title}</p>
                </div>
                <p className="text-sm text-muted">{action.description}</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className={`mt-4 w-full justify-center ${
                  action.tone === 'danger'
                    ? 'border-red-200 text-red-600 hover:bg-red-50 hover:text-red-600'
                    : 'border-brand-200 text-strong hover:border-brand-300'
                }`}
                disabled={actionLoading === action.id}
                onClick={() => void handleAction(action)}
              >
                {actionLoading === action.id ? (
                  <span className="flex items-center gap-2 text-sm">
                    <Loader2 size={16} className="animate-spin" />
                    Working...
                  </span>
                ) : (
                  action.buttonLabel
                )}
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SystemTools;
