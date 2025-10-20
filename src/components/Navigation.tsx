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

  return (
    <nav className={`fixed bottom-0 left-0 right-0 bg-surface-layer border-t border-subtle shadow-soft z-50 transition-theme ${isDarkMode ? 'dark' : ''}`}>
      {/* Mobile & Tablet Navigation */}
      <div className="lg:hidden px-2 sm:px-4 py-2 safe-area-bottom">
        <div className="flex justify-around max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center py-2 px-3 sm:px-4 rounded-2xl transition-theme min-w-0 border ${
                  isActive 
                    ? 'text-brand-600 bg-surface-brand border-brand-100 shadow-soft' 
                    : 'border-transparent text-muted hover:text-strong'
                }`}
              >
                <Icon size={20} className={`${isActive ? 'animate-bounce-subtle' : ''} mb-1`} />
                <span className="text-xs font-medium truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Navigation - Hidden on mobile/tablet */}
      <div className="hidden lg:block px-6 py-3">
        <div className="flex justify-center max-w-2xl mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-3 py-3 px-6 rounded-2xl transition-theme mx-2 border ${
                  isActive 
                    ? 'text-brand-600 bg-surface-brand border-brand-100 shadow-soft' 
                    : 'border-transparent text-muted hover:text-strong'
                }`}
              >
                <Icon size={24} className={isActive ? 'animate-bounce-subtle' : ''} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
