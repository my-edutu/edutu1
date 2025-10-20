import React, { useState } from 'react';
import { ArrowLeft, Calendar, MapPin, Users, Clock, Star, Bell, ExternalLink, Target, BookOpen, Loader2 } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';
import { useDarkMode } from '../hooks/useDarkMode';

interface OpportunityDetailProps {
  opportunity: {
    id: string;
    title: string;
    organization: string;
    category: string;
    deadline: string;
    location: string;
    description: string;
    requirements: string[];
    benefits: string[];
    applicationProcess: string[];
    image: string;
    match: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    applicants: string;
    successRate: string;
  };
  onBack: () => void;
  onAddToGoals: (opportunity: any) => void;
}

const OpportunityDetail: React.FC<OpportunityDetailProps> = ({ 
  opportunity, 
  onBack, 
  onAddToGoals 
}) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isAddingToGoals, setIsAddingToGoals] = useState(false);
  const { isDarkMode } = useDarkMode();

  const handleApply = () => {
    window.open('#', '_blank');
  };

  const handleAddToGoals = async () => {
    setIsAddingToGoals(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsAddingToGoals(false);
    onAddToGoals(opportunity);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    scrollToTop();
    onBack();
  };

  return (
    <div className={`min-h-screen bg-white dark:bg-gray-900 animate-fade-in ${isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="p-4 lg:px-6">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="secondary"
              onClick={handleBack}
              className="p-2 lg:p-3"
            >
              <ArrowLeft size={20} />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg lg:text-xl font-bold text-gray-800 dark:text-white line-clamp-2">{opportunity.title}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{opportunity.organization}</p>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`p-2 lg:p-3 rounded-full transition-all ${
                notificationsEnabled 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Bell size={20} />
            </button>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-2 sm:gap-4 text-sm overflow-x-auto pb-2">
            <div className="flex items-center gap-1 whitespace-nowrap">
              <Star size={16} className="text-yellow-500" />
              <span className="font-medium text-green-600 dark:text-green-400">{opportunity.match}% match</span>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs border whitespace-nowrap ${getDifficultyColor(opportunity.difficulty)}`}>
              {opportunity.difficulty}
            </div>
            <div className="text-gray-500 dark:text-gray-400 whitespace-nowrap">
              {opportunity.applicants} applicants
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 lg:px-6 lg:max-w-4xl lg:mx-auto space-y-6 pb-24 lg:pb-6">
        {/* Hero Image */}
        <div className="relative h-48 sm:h-56 lg:h-64 rounded-2xl overflow-hidden">
          <img
            src={opportunity.image}
            alt={opportunity.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <div className="text-sm opacity-90">{opportunity.category}</div>
            <div className="text-lg lg:text-xl font-bold line-clamp-2">{opportunity.title}</div>
          </div>
        </div>

        {/* Key Information */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Key Information</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-primary flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-medium text-gray-800 dark:text-white">Application Deadline</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{opportunity.deadline}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-primary flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-medium text-gray-800 dark:text-white">Location</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{opportunity.location}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users size={20} className="text-primary flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-medium text-gray-800 dark:text-white">Success Rate</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{opportunity.successRate}</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Description */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">About This Opportunity</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{opportunity.description}</p>
        </Card>

        {/* Requirements */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Requirements</h2>
          <div className="space-y-2">
            {opportunity.requirements.map((req, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-600 dark:text-gray-300">{req}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Benefits */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">What You'll Get</h2>
          <div className="space-y-2">
            {opportunity.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-600 dark:text-gray-300">{benefit}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Application Process */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Application Process</h2>
          <div className="space-y-4">
            {opportunity.applicationProcess.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-gray-600 dark:text-gray-300">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <Button
            onClick={handleAddToGoals}
            variant="secondary"
            className="flex items-center justify-center gap-2 order-2 sm:order-1"
            disabled={isAddingToGoals}
          >
            {isAddingToGoals ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Adding to Goals...
              </>
            ) : (
              <>
                <Target size={16} />
                Add to Goals
              </>
            )}
          </Button>
          <Button
            onClick={handleApply}
            className="flex items-center justify-center gap-2 order-1 sm:order-2"
          >
            <ExternalLink size={16} />
            Apply Now
          </Button>
        </div>

        {/* Notification Banner */}
        {notificationsEnabled && (
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 animate-slide-up">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-blue-600 dark:text-blue-400" />
              <div className="flex-1">
                <p className="font-medium text-blue-800 dark:text-blue-300">Notifications Enabled</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">We'll remind you about important deadlines</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OpportunityDetail;