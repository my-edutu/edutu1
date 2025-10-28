import React, { useEffect, useState } from 'react';
import LandingPage from './components/LandingPage';
import AuthScreen from './components/AuthScreen';
import ChatInterface from './components/ChatInterface';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Navigation from './components/Navigation';
import OpportunityDetail from './components/OpportunityDetail';
import AllOpportunities from './components/AllOpportunities';
import PersonalizedRoadmap from './components/PersonalizedRoadmap';
import OpportunityRoadmap from './components/OpportunityRoadmap';
import SettingsMenu from './components/SettingsMenu';
import EditProfileScreen from './components/EditProfileScreen';
import NotificationsScreen from './components/NotificationsScreen';
import PrivacyScreen from './components/PrivacyScreen';
import HelpScreen from './components/HelpScreen';
import CVManagement from './components/CVManagement';
import AddGoalScreen from './components/AddGoalScreen';
import CommunityMarketplace from './components/CommunityMarketplace';
import IntroductionPopup from './components/IntroductionPopup';
import AllGoals from './components/AllGoals';
import { useDarkMode } from './hooks/useDarkMode';
import { Goal, useGoals } from './hooks/useGoals';
import { authService, getProfileFromUser } from './lib/auth';
import { useAnalytics } from './hooks/useAnalytics';
import type { Opportunity } from './types/opportunity';
import type { AppUser } from './types/user';

export type Screen = 'landing' | 'auth' | 'chat' | 'dashboard' | 'all-goals' | 'profile' | 'opportunity-detail' | 'all-opportunities' | 'roadmap' | 'opportunity-roadmap' | 'settings' | 'profile-edit' | 'notifications' | 'privacy' | 'help' | 'cv-management' | 'add-goal' | 'community-marketplace';

export function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [user, setUser] = useState<AppUser | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [showIntroPopup, setShowIntroPopup] = useState(false);
  const { goals, createGoal } = useGoals();
  const { isDarkMode } = useDarkMode();
  const { recordOpportunityExplored } = useAnalytics();

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const session = await authService.getSession();
        if (!isMounted || !session?.user) {
          return;
        }

        const profile = getProfileFromUser(session.user);
        if (profile) {
          setUser(profile);
          setCurrentScreen((previous) => (previous === 'landing' ? 'dashboard' : previous));
        }
      } catch (error) {
        console.error('Failed to restore Supabase session', error);
      }
    };

    restoreSession();

    const { data: { subscription } } = authService.onAuthStateChange((_event, session) => {
      if (!isMounted) {
        return;
      }

      if (session?.user) {
        const profile = getProfileFromUser(session.user);
        if (profile) {
          setUser(profile);
        }

        setCurrentScreen((previous) => (previous === 'auth' || previous === 'landing' ? 'dashboard' : previous));
      } else {
        setUser(null);
        setSelectedGoalId(null);
        setShowIntroPopup(false);
        setCurrentScreen('landing');
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGetStarted = (userData?: AppUser) => {
    scrollToTop();
    if (userData) {
      setUser(userData);
      setShowIntroPopup(true);
    } else {
      setCurrentScreen('auth');
    }
  };

  const handleAuthSuccess = (userData: AppUser) => {
    scrollToTop();
    setUser(userData);
    setShowIntroPopup(true);
  };

  const handleIntroComplete = (_profileData?: unknown) => {
    setShowIntroPopup(false);
    setCurrentScreen('dashboard');
  };

  const handleOpportunitySelect = (opportunity: Opportunity) => {
    scrollToTop();
    void recordOpportunityExplored({
      id: opportunity.id,
      title: opportunity.title,
      category: opportunity.category
    });
    setSelectedOpportunity(opportunity);
    setCurrentScreen('opportunity-detail');
  };

  const handleAddToGoals = (opportunity: Opportunity) => {
    scrollToTop();
    setSelectedOpportunity(opportunity);
    setCurrentScreen('opportunity-roadmap');
  };

  const handleGoalClick = (goalId: string) => {
    scrollToTop();
    setSelectedGoalId(goalId);
    setCurrentScreen('roadmap');
  };

  const handleLogout = async () => {
    scrollToTop();
    try {
      await authService.signOut();
    } catch (error) {
      console.error('Failed to sign out from Supabase', error);
    } finally {
      setUser(null);
      setSelectedGoalId(null);
      setSelectedOpportunity(null);
      setShowIntroPopup(false);
      setCurrentScreen('landing');
    }
  };

  const handleNavigate = (screen: Screen | string) => {
    scrollToTop();
    setCurrentScreen(screen as Screen);
  };

  const handleBack = (targetScreen: Screen) => {
    scrollToTop();
    setCurrentScreen(targetScreen);
  };

  const handleAddGoal = () => {
    scrollToTop();
    setCurrentScreen('add-goal');
  };

  const handleViewAllGoals = () => {
    scrollToTop();
    setCurrentScreen('all-goals');
  };

  const handleGoalCreated = (goal: Goal) => {
    scrollToTop();
    setSelectedGoalId(goal.id);
    if (goal.source === 'template') {
      setCurrentScreen('roadmap');
      return;
    }
    setCurrentScreen('dashboard');
  };

  const handleCommunityRoadmapSelect = (roadmap: any) => {
    scrollToTop();
    const existingGoal = goals.find((goal) => goal.templateId === roadmap.id);
    const goal =
      existingGoal ||
      createGoal({
        title: roadmap.title,
        description: roadmap.description,
        category: roadmap.category,
        source: 'template',
        templateId: roadmap.id,
        progress: 0
      });
    setSelectedGoalId(goal.id);
    setCurrentScreen('roadmap');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return <LandingPage onGetStarted={() => handleGetStarted()} />;
      case 'auth':
        return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
      case 'chat':
        return <ChatInterface user={user} />;
      case 'dashboard':
        return (
          <Dashboard 
            user={user} 
            onOpportunityClick={handleOpportunitySelect}
            onViewAllOpportunities={() => handleNavigate('all-opportunities')}
            onGoalClick={handleGoalClick}
            onNavigate={handleNavigate}
            onAddGoal={handleAddGoal}
            onViewAllGoals={handleViewAllGoals}
          />
        );
      case 'profile':
        return (
          <Profile 
            user={user} 
            setUser={setUser}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
      case 'opportunity-detail':
        if (!selectedOpportunity) {
          return (
            <AllOpportunities
              onBack={() => handleBack('dashboard')}
              onSelectOpportunity={handleOpportunitySelect}
            />
          );
        }
        return (
          <OpportunityDetail
            opportunity={selectedOpportunity}
            onBack={() => handleBack('dashboard')}
            onAddToGoals={handleAddToGoals}
          />
        );
      case 'all-goals':
        return (
          <AllGoals
            onBack={() => handleBack('dashboard')}
            onSelectGoal={handleGoalClick}
            onAddGoal={handleAddGoal}
          />
        );
      case 'all-opportunities':
        return (
          <AllOpportunities
            onBack={() => handleBack('dashboard')}
            onSelectOpportunity={handleOpportunitySelect}
          />
        );
      case 'roadmap':
        return (
          <PersonalizedRoadmap 
            onBack={() => handleBack('dashboard')}
            goalId={selectedGoalId ?? undefined}
          />
        );
      case 'opportunity-roadmap':
        if (!selectedOpportunity) {
          return (
            <AllOpportunities
              onBack={() => handleBack('dashboard')}
              onSelectOpportunity={handleOpportunitySelect}
            />
          );
        }
        return (
          <OpportunityRoadmap
            onBack={() => handleBack('dashboard')}
            opportunity={selectedOpportunity}
          />
        );
      case 'settings':
        return (
          <SettingsMenu
            onBack={() => handleBack('profile')}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
      case 'profile-edit':
        return (
          <EditProfileScreen
            user={user}
            setUser={setUser}
            onBack={() => handleBack('settings')}
          />
        );
      case 'notifications':
        return (
          <NotificationsScreen
            onBack={() => handleBack('settings')}
          />
        );
      case 'privacy':
        return (
          <PrivacyScreen
            onBack={() => handleBack('settings')}
          />
        );
      case 'help':
        return (
          <HelpScreen
            onBack={() => handleBack('settings')}
            user={user}
          />
        );
      case 'cv-management':
        return (
          <CVManagement
            onBack={() => handleBack('profile')}
          />
        );
      case 'add-goal':
        return (
          <AddGoalScreen
            onBack={() => handleBack('dashboard')}
            onGoalCreated={handleGoalCreated}
            onNavigate={handleNavigate}
            user={user}
          />
        );
      case 'community-marketplace':
        return (
          <CommunityMarketplace
            onBack={() => handleBack('dashboard')}
            onRoadmapSelect={handleCommunityRoadmapSelect}
            user={user}
          />
        );
      default:
        return <LandingPage onGetStarted={() => handleGetStarted()} />;
    }
  };

  const showNavigation = currentScreen !== 'landing' && 
                        currentScreen !== 'auth' && 
                        !['opportunity-detail', 'roadmap', 'opportunity-roadmap', 'settings', 'profile-edit', 'notifications', 'privacy', 'help', 'cv-management', 'add-goal', 'community-marketplace'].includes(currentScreen);

  return (
    <div className={`min-h-screen bg-surface-body text-strong transition-theme ${isDarkMode ? 'dark' : ''}`}>
      {showNavigation && (
        <Navigation currentScreen={currentScreen} onNavigate={handleNavigate} />
      )}
      <main className={`${showNavigation ? 'pb-20 lg:pb-24' : ''} transition-theme`}>
        {renderScreen()}
      </main>
      
      {/* Introduction Popup */}
      {showIntroPopup && user && (
        <IntroductionPopup
          isOpen={showIntroPopup}
          onComplete={handleIntroComplete}
          userName={user.name}
        />
      )}
    </div>
  );
}

export { App as default };
