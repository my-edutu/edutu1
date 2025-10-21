import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  Brain,
  Briefcase,
  Loader2,
  MessageSquare,
  ShieldAlert,
  Users
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/ui/ToastProvider';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useOpportunities } from '../../hooks/useOpportunities';
import useAnalyticsData from '../../hooks/useAnalyticsData';
import useSupportTickets from '../../hooks/useSupportTickets';

const formatNumber = (value: number) => value.toLocaleString();

const AdminDashboard: React.FC = () => {
  const { toast } = useToast();
  const { stats } = useAnalytics();
  const {
    data: opportunityData,
    loading: opportunitiesLoading,
    error: opportunitiesError,
    refresh: refreshOpportunities
  } = useOpportunities();
  const {
    data: analyticsData,
    loading: analyticsLoading,
    error: analyticsError,
    timeframe,
    setTimeframe,
    refresh: refreshAnalytics
  } = useAnalyticsData();
  const {
    tickets,
    loading: ticketsLoading,
    error: ticketsError,
    openTickets,
    refresh: refreshTickets
  } = useSupportTickets();
  const [refreshing, setRefreshing] = useState(false);
  const errorStateRef = useRef({
    analyticsError,
    opportunitiesError,
    ticketsError
  });

  useEffect(() => {
    errorStateRef.current = {
      analyticsError,
      opportunitiesError,
      ticketsError
    };
  }, [analyticsError, opportunitiesError, ticketsError]);

  const timeframeMeta = useMemo(() => {
    switch (timeframe) {
      case '7d':
        return { label: 'Last 7 days', scale: 0.35 };
      case '30d':
        return { label: 'Last 30 days', scale: 0.75 };
      default:
        return { label: 'All time', scale: 1 };
    }
  }, [timeframe]);

  const scaledAnalytics = useMemo(() => {
    const scaleValue = (value: number, { preserveTotal = false }: { preserveTotal?: boolean } = {}) => {
      if (timeframeMeta.scale === 1 || preserveTotal) {
        return value;
      }
      const scaled = Math.round(value * timeframeMeta.scale);
      if (scaled === 0 && value > 0) {
        return 1;
      }
      return Math.max(0, scaled);
    };

    return {
      users: {
        totalUsers: analyticsData.users.totalUsers,
        activeUsers: scaleValue(analyticsData.users.activeUsers),
        averageGoalsCompleted: Number(
          Math.max(0, analyticsData.users.averageGoalsCompleted * timeframeMeta.scale).toFixed(1)
        ),
        updatedAt: analyticsData.users.updatedAt
      },
      opportunities: {
        totalOpportunities: analyticsData.opportunities.totalOpportunities,
        topCategories: analyticsData.opportunities.topCategories.map((category) => ({
          name: category.name,
          count: scaleValue(category.count)
        })),
        clicksPerOpportunity: analyticsData.opportunities.clicksPerOpportunity.map((item) => ({
          name: item.name,
          value: scaleValue(item.value)
        })),
        updatedAt: analyticsData.opportunities.updatedAt
      },
      ai: {
        totalInteractions: scaleValue(analyticsData.ai.totalInteractions),
        averageSessionsPerUser: Number(
          Math.max(0.2, analyticsData.ai.averageSessionsPerUser * timeframeMeta.scale).toFixed(1)
        ),
        topQueries: analyticsData.ai.topQueries.map((query) => ({
          label: query.label,
          count: scaleValue(query.count)
        })),
        updatedAt: analyticsData.ai.updatedAt
      }
    };
  }, [analyticsData, timeframeMeta.scale]);

  const handleRefresh = async () => {
    if (refreshing) {
      return;
    }
    setRefreshing(true);
    let caughtError: string | null = null;

    try {
      refreshOpportunities();
      await Promise.all([refreshAnalytics(), refreshTickets()]);
    } catch (error) {
      caughtError = error instanceof Error ? error.message : 'Refresh failed.';
    } finally {
      window.setTimeout(() => {
        const { analyticsError: latestAnalyticsError, opportunitiesError: latestOppError, ticketsError: latestTicketsError } =
          errorStateRef.current;

        if (caughtError || latestAnalyticsError || latestOppError || latestTicketsError) {
          toast({
            title: 'Refresh encountered issues',
            description:
              caughtError ??
              latestAnalyticsError ??
              latestOppError ??
              latestTicketsError ??
              'Some admin data sources did not refresh. Try again shortly.',
            variant: 'error'
          });
        } else {
          toast({
            title: 'Admin data refreshed',
            description: 'Metrics and live feeds updated successfully.',
            variant: 'success'
          });
        }
        setRefreshing(false);
      }, 250);
    }
  };

  const opportunityCount = opportunityData.length;
  const topCategory = scaledAnalytics.opportunities.topCategories[0]?.name ?? 'General';
  const summaryCards = useMemo(
    () => [
      {
        title: 'Total Users',
        value: formatNumber(scaledAnalytics.users.totalUsers),
        helper: `${timeframeMeta.label}: ${formatNumber(scaledAnalytics.users.activeUsers)} active`,
        icon: Users,
        accent: 'bg-brand-50 text-brand-600'
      },
      {
        title: 'Active Opportunities',
        value: formatNumber(opportunityCount),
        helper: `Top interest: ${topCategory}`,
        icon: Briefcase,
        accent: 'bg-accent-50 text-accent-600'
      },
      {
        title: 'AI Interactions',
        value: formatNumber(scaledAnalytics.ai.totalInteractions),
        helper: `Avg sessions: ${scaledAnalytics.ai.averageSessionsPerUser}`,
        icon: Brain,
        accent: 'bg-neutral-100 text-strong'
      },
      {
        title: 'Open Support Tickets',
        value: formatNumber(openTickets),
        helper: `${tickets.slice(0, 1)[0]?.subject ?? 'No escalations in queue'}`,
        icon: MessageSquare,
        accent: 'bg-danger/10 text-danger'
      }
    ],
    [
      scaledAnalytics.ai.averageSessionsPerUser,
      scaledAnalytics.ai.totalInteractions,
      scaledAnalytics.users.activeUsers,
      scaledAnalytics.users.totalUsers,
      scaledAnalytics.opportunities.topCategories,
      opportunityCount,
      openTickets,
      tickets,
      timeframeMeta.label,
      topCategory
    ]
  );

  const opportunityCategoryChart = useMemo(
    () =>
      scaledAnalytics.opportunities.topCategories.map((category) => ({
        name: category.name,
        count: category.count
      })),
    [scaledAnalytics.opportunities.topCategories]
  );

  const aiQueryChart = useMemo(
    () =>
      scaledAnalytics.ai.topQueries.map((query) => ({
        name: query.label,
        value: query.count
      })),
    [scaledAnalytics.ai.topQueries]
  );

  const recentTickets = useMemo(
    () => tickets.slice(0, 4),
    [tickets]
  );

  const refreshDisabled = analyticsLoading || opportunitiesLoading || ticketsLoading || refreshing;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Badge variant="outline" className="inline-flex items-center gap-2 text-xs">
            <Activity size={14} className="text-brand-600" />
            Live admin snapshot
          </Badge>
          <h2 className="mt-2 text-2xl font-semibold text-strong">Platform health overview</h2>
          <p className="mt-1 text-sm text-muted">
            Track core product metrics, AI engagement, and community signals across Edutu.
          </p>
        </div>
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          <div className="flex rounded-xl border border-subtle bg-surface-layer p-1 text-xs font-medium text-soft shadow-soft">
            {(['7d', '30d', 'all'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setTimeframe(option)}
                className={`rounded-lg px-3 py-1.5 transition ${timeframe === option ? 'bg-brand-500 text-white shadow-soft' : 'hover:bg-neutral-100/70 dark:hover:bg-neutral-800/40'}`}
              >
                {option === '7d' ? 'Last 7 days' : option === '30d' ? 'Last 30 days' : 'All time'}
              </button>
            ))}
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={refreshDisabled}
            onClick={() => void handleRefresh()}
            className="justify-center"
          >
            {refreshing ? (
              <span className="flex items-center gap-2 text-sm">
                <Loader2 size={16} className="animate-spin" />
                Updating...
              </span>
            ) : (
              'Refresh data'
            )}
          </Button>
        </div>
      </div>

      {(analyticsError || opportunitiesError || ticketsError) && (
        <div className="rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          <p className="font-medium">Some admin insights may be out of date.</p>
          <p>
            {analyticsError ?? opportunitiesError ?? ticketsError ??
              'We could not refresh all data sources. Try again shortly.'}
          </p>
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="h-full border border-subtle/70 bg-surface-layer">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">{card.title}</p>
                  <p className="mt-2 text-2xl font-semibold text-strong">{card.value}</p>
                  <p className="mt-1 text-xs text-soft">{card.helper}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.accent}`}>
                  <Icon size={22} strokeWidth={2} />
                </div>
              </div>
            </Card>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2 border border-subtle/70 bg-surface-layer">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-subtle/60 pb-4">
            <div>
              <h3 className="text-base font-semibold text-strong">Opportunity traction</h3>
              <p className="text-sm text-muted">
                Highlights the categories capturing the most traction from learners.
              </p>
            </div>
          </div>

          <div className="mt-5 h-72 w-full">
            {opportunityCategoryChart.length > 0 ? (
              <ResponsiveContainer>
                <BarChart data={opportunityCategoryChart}>
                  <defs>
                    <linearGradient id="categoryGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="rgba(79,70,229,0.85)" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="rgba(79,70,229,0.45)" stopOpacity={0.5} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'rgba(100,116,139,1)' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'rgba(100,116,139,1)' }}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(79,70,229,0.08)' }}
                    contentStyle={{ borderRadius: 16, border: '1px solid rgba(226,232,240,0.8)' }}
                  />
                  <Bar dataKey="count" fill="url(#categoryGradient)" radius={[14, 14, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-subtle/60 bg-surface-elevated text-sm text-muted">
                No opportunity data available yet.
              </div>
            )}
          </div>
        </Card>

        <Card className="border border-subtle/70 bg-surface-layer">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-subtle/60 pb-4">
            <div>
              <h3 className="text-base font-semibold text-strong">Daily activity momentum</h3>
              <p className="text-sm text-muted">Compound of opportunity explores and chat sessions.</p>
            </div>
            <Badge variant="success">Streak: {stats.daysActive} days</Badge>
          </div>
          <div className="mt-5 h-72">
            <ResponsiveContainer>
              <AreaChart
                data={[
                  { label: 'Opportunities', value: stats.opportunitiesExplored },
                  { label: 'Goals completed', value: stats.goalsAchieved },
                  { label: 'AI chats', value: stats.chatSessions }
                ]}
              >
                <defs>
                  <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgba(6,182,212,0.9)" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="rgba(6,182,212,0.3)" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'rgba(100,116,139,1)' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'rgba(100,116,139,1)' }}
                />
                <Tooltip
                  cursor={{ stroke: 'rgba(6,182,212,0.4)', strokeWidth: 1 }}
                  contentStyle={{ borderRadius: 16, border: '1px solid rgba(226,232,240,0.8)' }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="rgba(6,182,212,0.9)"
                  fill="url(#activityGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border border-subtle/70 bg-surface-layer">
          <div className="flex items-center justify-between border-b border-subtle/60 pb-4">
            <div>
              <h3 className="text-base font-semibold text-strong">AI query pulse</h3>
              <p className="text-sm text-muted">Common themes driving learners to Edutu's AI coach.</p>
            </div>
          </div>
          <div className="mt-4 space-y-4">
            {aiQueryChart.length === 0 && (
              <div className="rounded-2xl border border-dashed border-subtle/70 bg-surface-elevated px-4 py-6 text-sm text-muted">
                No AI interactions recorded for this timeframe.
              </div>
            )}
            {aiQueryChart.map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between text-sm font-medium text-soft">
                  <span>{item.name}</span>
                  <span>{formatNumber(item.value)}</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-neutral-100 dark:bg-neutral-800/60">
                  <div
                    className="h-full rounded-full bg-brand-500 transition-all"
                    style={{ width: `${Math.min((item.value / (aiQueryChart[0]?.value || 1)) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border border-subtle/70 bg-surface-layer">
          <div className="flex items-center justify-between border-b border-subtle/60 pb-4">
            <div>
              <h3 className="text-base font-semibold text-strong">Community alerts</h3>
              <p className="text-sm text-muted">
                Watchlist of open support tickets and moderation flags that need attention.
              </p>
            </div>
            <Badge variant={openTickets > 0 ? 'danger' : 'success'} className="flex items-center gap-1">
              <ShieldAlert size={14} />
              {openTickets > 0 ? `${openTickets} open` : 'All clear'}
            </Badge>
          </div>
          <div className="mt-4 space-y-3">
            {ticketsLoading && (
              <div className="rounded-2xl border border-dashed border-subtle/70 bg-surface-elevated px-4 py-6 text-sm text-muted">
                Loading community signals...
              </div>
            )}
            {!ticketsLoading && recentTickets.length === 0 && (
              <div className="rounded-2xl border border-dashed border-subtle/70 bg-surface-elevated px-4 py-6 text-sm text-muted">
                No outstanding tickets. The community looks healthy.
              </div>
            )}
            {recentTickets.map((ticket) => (
              <div key={ticket.id} className="rounded-2xl border border-subtle bg-surface-layer px-4 py-3 text-sm shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-strong">{ticket.subject}</p>
                    <p className="mt-1 text-xs text-muted">
                      {ticket.userEmail ?? ticket.userId} -{' '}
                      {ticket.lastUpdated ? ticket.lastUpdated.toLocaleString() : 'Awaiting response'}
                    </p>
                  </div>
                  <Badge variant={ticket.status === 'open' ? 'danger' : 'success'}>
                    {ticket.status === 'open' ? 'Open' : 'Resolved'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
};

export default AdminDashboard;
