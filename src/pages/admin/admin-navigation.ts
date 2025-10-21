import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  Brain,
  Briefcase,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users
} from 'lucide-react';

export interface AdminNavItem {
  name: string;
  path: string;
  icon: LucideIcon;
  description?: string;
}

export const adminNavItems: AdminNavItem[] = [
  {
    name: 'Dashboard Overview',
    path: '/',
    icon: LayoutDashboard,
    description: 'Monitor the health of the Edutu platform at a glance.'
  },
  {
    name: 'Opportunities',
    path: '/opportunities',
    icon: Briefcase,
    description: 'Curate scholarships, programs, and opportunities for learners.'
  },
  {
    name: 'Users & Roles',
    path: '/users',
    icon: Users,
    description: 'Manage learner accounts, permissions, and moderators.'
  },
  {
    name: 'Analytics',
    path: '/analytics',
    icon: BarChart3,
    description: 'Track engagement, funnel performance, and growth trends.'
  },
  {
    name: 'AI Control',
    path: '/ai-control',
    icon: Brain,
    description: "Tune Edutu's AI assistants, guardrails, and content policies."
  },
  {
    name: 'Community',
    path: '/community',
    icon: MessageSquare,
    description: 'Oversee community health, announcements, and support.'
  },
  {
    name: 'System Tools',
    path: '/system',
    icon: Settings,
    description: 'Manage caches, overrides, and environment health checks.'
  }
];

export const adminRouteFallbacks: Record<string, { title: string; description?: string }> = {
  '/community-support': {
    title: 'Community Support',
    description: 'Coordinate support tickets, escalations, and announcements.'
  }
};
