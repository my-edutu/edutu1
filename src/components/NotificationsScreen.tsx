import React, { useState } from 'react';
import { ArrowLeft, Bell, BellOff, Smartphone, Mail, Calendar, Award, Target } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';
import { useDarkMode } from '../hooks/useDarkMode';
import { usePersistentState } from '../hooks/usePersistentState';

interface NotificationsScreenProps {
  onBack: () => void;
}

type NotificationSettings = {
  pushNotifications: boolean;
  emailNotifications: boolean;
  opportunityAlerts: boolean;
  deadlineReminders: boolean;
  goalReminders: boolean;
  achievementCelebrations: boolean;
  weeklyDigest: boolean;
  marketingEmails: boolean;
};

type QuietHours = {
  start: string;
  end: string;
};

const NOTIFICATION_DEFAULTS: NotificationSettings = {
  pushNotifications: true,
  emailNotifications: true,
  opportunityAlerts: true,
  deadlineReminders: true,
  goalReminders: true,
  achievementCelebrations: true,
  weeklyDigest: false,
  marketingEmails: false
};

const QUIET_HOURS_DEFAULTS: QuietHours = {
  start: '22:00',
  end: '08:00'
};

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ onBack }) => {
  const { isDarkMode } = useDarkMode();
  const [notifications, setNotifications] = usePersistentState<NotificationSettings>('settings.notifications', NOTIFICATION_DEFAULTS);
  const [quietHours, setQuietHours] = usePersistentState<QuietHours>('settings.quietHours', QUIET_HOURS_DEFAULTS);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSendingTest, setIsSendingTest] = useState(false);

  const handleToggle = (key: keyof NotificationSettings) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));

    setStatusMessage('Notification preferences updated.');
    setTimeout(() => setStatusMessage(null), 2500);
  };

  const handleQuietHoursChange = (key: keyof QuietHours) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuietHours((prev) => ({
      ...prev,
      [key]: value
    }));
    setStatusMessage('Quiet hours updated.');
    setTimeout(() => setStatusMessage(null), 2500);
  };

  const handleBack = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onBack();
  };

  const handleTestNotification = () => {
    setIsSendingTest(true);
    setTimeout(() => {
      setIsSendingTest(false);
      setStatusMessage('A test notification was sent to your active channels.');
      setTimeout(() => setStatusMessage(null), 3000);
    }, 800);
  };

  const notificationSettings = [
    {
      id: 'pushNotifications',
      title: 'Push Notifications',
      description: 'Receive notifications on your device',
      icon: <Smartphone size={20} className="text-primary" />,
      enabled: notifications.pushNotifications
    },
    {
      id: 'emailNotifications',
      title: 'Email Notifications',
      description: 'Receive notifications via email',
      icon: <Mail size={20} className="text-blue-600" />,
      enabled: notifications.emailNotifications
    },
    {
      id: 'opportunityAlerts',
      title: 'Opportunity Alerts',
      description: 'Get notified about new matching opportunities',
      icon: <Award size={20} className="text-green-600" />,
      enabled: notifications.opportunityAlerts
    },
    {
      id: 'deadlineReminders',
      title: 'Deadline Reminders',
      description: 'Reminders for application deadlines',
      icon: <Calendar size={20} className="text-red-600" />,
      enabled: notifications.deadlineReminders
    },
    {
      id: 'goalReminders',
      title: 'Goal Reminders',
      description: 'Stay on track with your goals',
      icon: <Target size={20} className="text-purple-600" />,
      enabled: notifications.goalReminders
    },
    {
      id: 'achievementCelebrations',
      title: 'Achievement Celebrations',
      description: 'Celebrate your milestones and achievements',
      icon: <Award size={20} className="text-yellow-600" />,
      enabled: notifications.achievementCelebrations
    }
  ] as const;

  const emailSettings = [
    {
      id: 'weeklyDigest',
      title: 'Weekly Digest',
      description: 'Summary of your progress and new opportunities',
      enabled: notifications.weeklyDigest
    },
    {
      id: 'marketingEmails',
      title: 'Marketing Emails',
      description: 'Updates about new features and tips',
      enabled: notifications.marketingEmails
    }
  ] as const;

  const canSendTest = notifications.pushNotifications || notifications.emailNotifications;

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
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">Notifications</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manage your notification preferences</p>
            </div>
            <Bell size={24} className="text-primary" />
          </div>
          {statusMessage && (
            <p className="mt-3 text-sm text-primary">{statusMessage}</p>
          )}
        </div>
      </div>

  <div className="p-4 space-y-6">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Notification Types</h3>
          <div className="space-y-4">
            {notificationSettings.map((setting, index) => (
              <div
                key={setting.id}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
                    {setting.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">{setting.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{setting.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(setting.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    setting.enabled ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                  aria-pressed={setting.enabled}
                  aria-label={`Toggle ${setting.title}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      setting.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Email Preferences</h3>
          <div className="space-y-4">
            {emailSettings.map((setting, index) => (
              <div
                key={setting.id}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all animate-slide-up"
                style={{ animationDelay: `${(notificationSettings.length + index) * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
                    <Mail size={20} className="text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">{setting.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{setting.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(setting.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    setting.enabled ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                  aria-pressed={setting.enabled}
                  aria-label={`Toggle ${setting.title}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      setting.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quiet Hours</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Set times when you prefer not to receive notifications. We&apos;ll still send urgent alerts.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Time
              </label>
              <input
                type="time"
                value={quietHours.start}
                onChange={handleQuietHoursChange('start')}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Time
              </label>
              <input
                type="time"
                value={quietHours.end}
                onChange={handleQuietHoursChange('end')}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Quiet hours active from <span className="font-medium text-gray-800 dark:text-gray-200">{quietHours.start}</span> to{' '}
            <span className="font-medium text-gray-800 dark:text-gray-200">{quietHours.end}</span>.
          </div>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Test Notifications</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Send a test notification to make sure everything is working
            </p>
            <Button
              onClick={handleTestNotification}
              disabled={!canSendTest || isSendingTest}
              className="inline-flex items-center gap-2"
            >
              {canSendTest ? <Bell size={16} /> : <BellOff size={16} />}
              {isSendingTest ? 'Sending...' : 'Send Test Notification'}
            </Button>
            {!canSendTest && (
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                Enable push or email notifications above to receive test alerts.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NotificationsScreen;

