import React from 'react';
import { Heart, Clock, Users, DollarSign, MapPin, TrendingUp } from 'lucide-react';
import type { Opportunity } from '../../types/opportunity';

interface OpportunityCardProps {
  opportunity: Opportunity;
  variant?: 'compact' | 'hero' | 'featured';
  onSelect: (opportunity: Opportunity) => void;
  onSave?: (opportunity: Opportunity) => void;
  isSaved?: boolean;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  variant = 'compact',
  onSelect,
  onSave,
  isSaved = false,
}) => {
  const getCategoryIcon = () => {
    switch (opportunity.category) {
      case 'scholarship':
        return '🎓';
      case 'job':
        return '💼';
      case 'fellowship':
        return '🌟';
      default:
        return '📚';
    }
  };

  const getCategoryColor = () => {
    switch (opportunity.category) {
      case 'scholarship':
        return 'brand';
      case 'job':
        return 'accent';
      case 'fellowship':
        return 'success';
      default:
        return 'info';
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSave) {
      onSave(opportunity);
    }
  };

  // Calculate match score (mock for now)
  const matchScore = Math.floor(75 + Math.random() * 25);

  // Calculate days left (mock for now)
  const daysLeft = Math.floor(Math.random() * 30) + 1;

  if (variant === 'compact') {
    return (
      <div
        onClick={() => onSelect(opportunity)}
        className="flex items-center gap-3 p-4 bg-surface-layer border border-subtle rounded-2xl hover:shadow-soft hover-lift active-press cursor-pointer transition-theme min-w-[280px]"
      >
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-brand rounded-xl flex items-center justify-center text-2xl shadow-soft">
          {getCategoryIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-strong text-sm line-clamp-1">
            {opportunity.title}
          </h3>
          <div className="flex items-center gap-3 mt-1">
            <span className={`text-xs font-medium text-${getCategoryColor()}-600 capitalize`}>
              {opportunity.category}
            </span>
            <div className="flex items-center gap-1 text-xs text-muted">
              <Clock className="w-3 h-3" />
              {daysLeft}d
            </div>
            <div className="flex items-center gap-1 text-xs text-success-600 font-medium">
              <TrendingUp className="w-3 h-3" />
              {matchScore}%
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex-shrink-0 p-2 hover:bg-surface-elevated rounded-lg transition-colors"
        >
          <Heart
            className={`w-5 h-5 ${isSaved ? 'fill-accent-500 text-accent-500' : 'text-muted'}`}
          />
        </button>
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div
        onClick={() => onSelect(opportunity)}
        className="relative overflow-hidden rounded-3xl cursor-pointer hover-scale active-press transition-all min-w-[320px] md:min-w-[400px]"
      >
        {/* Gradient background */}
        <div className="absolute inset-0 gradient-accent opacity-90" />

        {/* Pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Content */}
        <div className="relative p-6 md:p-8 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl">{getCategoryIcon()}</span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white capitalize">
                  {opportunity.category}
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold font-display text-white line-clamp-2">
                {opportunity.title}
              </h3>
            </div>
            <button
              onClick={handleSave}
              className="p-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-colors"
            >
              <Heart
                className={`w-6 h-6 ${isSaved ? 'fill-white text-white' : 'text-white'}`}
              />
            </button>
          </div>

          {/* Description */}
          <p className="text-white/90 text-sm md:text-base line-clamp-2">
            {opportunity.description}
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
              <div className="flex items-center gap-2 text-white/80 text-xs mb-1">
                <DollarSign className="w-4 h-4" />
                <span>Funding</span>
              </div>
              <p className="text-white font-semibold">Full Coverage</p>
            </div>

            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
              <div className="flex items-center gap-2 text-white/80 text-xs mb-1">
                <Clock className="w-4 h-4" />
                <span>Deadline</span>
              </div>
              <p className="text-white font-semibold">{daysLeft} days left</p>
            </div>

            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
              <div className="flex items-center gap-2 text-white/80 text-xs mb-1">
                <MapPin className="w-4 h-4" />
                <span>Location</span>
              </div>
              <p className="text-white font-semibold">International</p>
            </div>

            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
              <div className="flex items-center gap-2 text-white/80 text-xs mb-1">
                <TrendingUp className="w-4 h-4" />
                <span>Match Score</span>
              </div>
              <p className="text-white font-semibold">{matchScore}%</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button className="flex-1 bg-white text-brand-600 font-semibold py-3 rounded-xl hover:bg-white/90 transition-colors active-press">
              Apply Now
            </button>
            <button className="px-6 bg-white/20 backdrop-blur-sm text-white font-semibold py-3 rounded-xl hover:bg-white/30 transition-colors active-press">
              Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Featured variant
  return (
    <div
      onClick={() => onSelect(opportunity)}
      className="bg-surface-layer border border-subtle rounded-2xl overflow-hidden hover:shadow-elevated hover-lift active-press cursor-pointer transition-all min-w-[280px] md:min-w-[320px]"
    >
      {/* Image placeholder with gradient */}
      <div className="relative h-40 gradient-brand flex items-center justify-center">
        <span className="text-6xl">{getCategoryIcon()}</span>
        {/* Match score badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-soft">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-success-600" />
            <span className="text-sm font-bold text-success-600">{matchScore}%</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Title and category */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2.5 py-1 bg-${getCategoryColor()}-50 text-${getCategoryColor()}-600 rounded-lg text-xs font-medium capitalize`}>
              {opportunity.category}
            </span>
            <button
              onClick={handleSave}
              className="ml-auto p-1.5 hover:bg-surface-elevated rounded-lg transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${isSaved ? 'fill-accent-500 text-accent-500' : 'text-muted'}`}
              />
            </button>
          </div>
          <h3 className="font-semibold text-strong text-base line-clamp-2">
            {opportunity.title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-sm text-soft line-clamp-2">
          {opportunity.description}
        </p>

        {/* Meta info */}
        <div className="flex items-center gap-4 pt-2 border-t border-subtle">
          <div className="flex items-center gap-1.5 text-xs text-soft">
            <DollarSign className="w-4 h-4" />
            <span>Funded</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-soft">
            <Clock className="w-4 h-4" />
            <span>{daysLeft} days left</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-soft ml-auto">
            <Users className="w-4 h-4" />
            <span>874 applied</span>
          </div>
        </div>

        {/* Action button */}
        <button className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-xl transition-colors active-press">
          View Details
        </button>
      </div>
    </div>
  );
};

export default OpportunityCard;
