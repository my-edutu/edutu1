import React from 'react';
import { Home, MessageCircle, User, Lightbulb } from 'lucide-react';
import { Screen } from '../App';
import { useDarkMode } from '../hooks/useDarkMode';

interface NavigationProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentScreen, onNavigate }) => {
  const { isDarkMode } = useDarkMode();
  
  const navItems = [
    { id: 'dashboard' as Screen, icon: Home, label: 'Home' },
    { id: 'all-opportunities' as Screen, icon: Lightbulb, label: 'Opportunities' },
    { id: 'chat' as Screen, icon: MessageCircle, label: 'Chat' },
    { id: 'profile' as Screen, icon: User, label: 'Profile' }
  ];

  const renderMobileNav = () => (
    <div className="flex justify-around gap-1 max-w-md mx-auto">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentScreen === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`group relative flex min-w-0 flex-col items-center gap-1 rounded-[18px] border border-transparent px-3 sm:px-4 py-2 text-xs font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 ${
              isActive
                ? 'gradient-accent text-white shadow-[0_18px_40px_-22px_rgba(66,105,255,0.75)]'
                : 'text-muted hover:text-primary hover:bg-white/5 dark:hover:bg-white/10'
            }`}
          >
            <Icon
              size={20}
              className={`transition-transform duration-200 ease-in-out ${
                isActive ? 'drop-shadow-[0_0_12px_rgba(99,102,241,0.6)]' : 'group-hover:-translate-y-[1px]'
              }`}
            />
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </div>
  );

  const renderDesktopNav = () => (
    <div className="hidden lg:flex justify-center gap-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentScreen === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`group relative flex items-center gap-3 rounded-[20px] border border-transparent px-6 py-3 text-sm font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 ${
              isActive
                ? 'gradient-accent text-white shadow-[0_20px_48px_-24px_rgba(66,105,255,0.7)]'
                : 'text-muted hover:text-primary hover:bg-white/5 dark:hover:bg-white/10'
            }`}
          >
            <Icon
              size={24}
              className={`transition-transform duration-200 ease-in-out ${
                isActive ? 'drop-shadow-[0_0_18px_rgba(99,102,241,0.5)]' : 'group-hover:-translate-y-[2px]'
              }`}
            />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-50 transition-theme ${isDarkMode ? 'dark' : ''}`}>
      <div
        className="mx-auto w-full max-w-5xl px-3 sm:px-4 lg:px-6 pt-2"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.75rem)' }}
      >
        <div className="glass-panel shadow-glow rounded-[24px] px-3 sm:px-4 py-2 lg:py-3">
          <div className="lg:hidden">{renderMobileNav()}</div>
          {renderDesktopNav()}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
