import React, { useState } from 'react';
import { ArrowLeft, Search, Filter, Star, Calendar, MapPin } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';
import { useDarkMode } from '../hooks/useDarkMode';

interface Opportunity {
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
}

interface AllOpportunitiesProps {
  onBack: () => void;
  onSelectOpportunity: (opportunity: Opportunity) => void;
}

const AllOpportunities: React.FC<AllOpportunitiesProps> = ({ onBack, onSelectOpportunity }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { isDarkMode } = useDarkMode();

  const categories = ['All', 'Scholarships', 'Leadership', 'Tech', 'Entrepreneurship', 'Global Programs'];

  const opportunities: Opportunity[] = [
    {
      id: '1',
      title: 'Mastercard Foundation Scholars Program',
      organization: 'Mastercard Foundation',
      category: 'Scholarships',
      deadline: 'March 15, 2024',
      location: 'Various Universities',
      description: 'A comprehensive scholarship program for academically talented yet economically disadvantaged young people from Africa.',
      requirements: [
        'African citizenship',
        'Demonstrated academic excellence',
        'Financial need',
        'Leadership potential',
        'Commitment to giving back to Africa'
      ],
      benefits: [
        'Full tuition coverage',
        'Living expenses',
        'Books and supplies',
        'Leadership development',
        'Mentorship program'
      ],
      applicationProcess: [
        'Complete online application',
        'Submit academic transcripts',
        'Provide financial documentation',
        'Write personal essays',
        'Attend interview if selected'
      ],
      image: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg',
      match: 95,
      difficulty: 'Hard',
      applicants: '10,000+',
      successRate: '5%'
    },
    {
      id: '2',
      title: 'One Young World Summit 2024',
      organization: 'One Young World',
      category: 'Leadership',
      location: 'Montreal, Canada',
      description: 'The premier global forum for young leaders, bringing together the brightest young minds from around the world.',
      requirements: [
        'Age 18-30',
        'Demonstrated leadership experience',
        'Commitment to positive change',
        'English proficiency',
        'Available for full summit duration'
      ],
      benefits: [
        'Summit attendance',
        'Networking opportunities',
        'Leadership workshops',
        'Mentorship access',
        'Global recognition'
      ],
      applicationProcess: [
        'Submit online application',
        'Provide leadership examples',
        'Record video pitch',
        'Get endorsement letter',
        'Attend selection interview'
      ],
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
      match: 88,
      difficulty: 'Medium',
      applicants: '5,000+',
      successRate: '15%'
    },
    {
      id: '3',
      title: 'Google Developer Student Clubs Lead',
      organization: 'Google',
      category: 'Tech',
      deadline: 'May 15, 2024',
      location: 'Your University',
      description: 'Lead a community of student developers at your university and help them learn and grow.',
      requirements: [
        'Currently enrolled student',
        'Programming experience',
        'Leadership skills',
        'Community building passion',
        'Available for 1-year commitment'
      ],
      benefits: [
        'Google swag and resources',
        'Training and workshops',
        'Networking with Googlers',
        'Certificate of completion',
        'Resume enhancement'
      ],
      applicationProcess: [
        'Complete application form',
        'Submit project portfolio',
        'Record introduction video',
        'Provide university endorsement',
        'Participate in interview'
      ],
      image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
      match: 82,
      difficulty: 'Medium',
      applicants: '2,000+',
      successRate: '25%'
    },
    {
      id: '4',
      title: 'Tony Elumelu Foundation Entrepreneurship Programme',
      organization: 'Tony Elumelu Foundation',
      category: 'Entrepreneurship',
      deadline: 'January 1, 2024',
      location: 'Africa',
      description: '10-year, $100 million commitment to identify, train, mentor and fund 10,000 African entrepreneurs.',
      requirements: [
        'African citizen or resident',
        'Business idea or early-stage business',
        'Age 18 and above',
        'Commitment to Africa',
        'Scalable business model'
      ],
      benefits: [
        '$5,000 seed funding',
        '12-week training program',
        'Mentorship support',
        'Networking opportunities',
        'Alumni network access'
      ],
      applicationProcess: [
        'Submit business plan',
        'Complete online application',
        'Participate in virtual training',
        'Present to selection panel',
        'Receive funding decision'
      ],
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
      match: 90,
      difficulty: 'Medium',
      applicants: '300,000+',
      successRate: '3%'
    },
    {
      id: '5',
      title: 'YALI Regional Leadership Center',
      organization: 'U.S. State Department',
      category: 'Leadership',
      deadline: 'February 28, 2024',
      location: 'Various African Cities',
      description: 'Intensive leadership training for young African leaders in business, civic leadership, and public management.',
      requirements: [
        'African citizen',
        'Age 25-35',
        'Leadership experience',
        'English proficiency',
        'Commitment to Africa'
      ],
      benefits: [
        'Leadership training',
        'Networking opportunities',
        'Certificate program',
        'Alumni network',
        'Follow-up support'
      ],
      applicationProcess: [
        'Online application',
        'Essay submissions',
        'Reference letters',
        'Interview process',
        'Final selection'
      ],
      image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg',
      match: 85,
      difficulty: 'Medium',
      applicants: '8,000+',
      successRate: '10%'
    },
    {
      id: '6',
      title: 'Chevening Scholarships',
      organization: 'UK Government',
      category: 'Scholarships',
      deadline: 'November 2, 2024',
      location: 'United Kingdom',
      description: 'UK government global scholarship programme, funded by the Foreign and Commonwealth Office.',
      requirements: [
        'Undergraduate degree',
        '2+ years work experience',
        'English language requirement',
        'Leadership potential',
        'Return to home country'
      ],
      benefits: [
        'Full tuition fees',
        'Monthly stipend',
        'Travel costs',
        'Visa application',
        'Exclusive events'
      ],
      applicationProcess: [
        'Online application',
        'University applications',
        'Interview process',
        'Medical checks',
        'Visa application'
      ],
      image: 'https://images.pexels.com/photos/5212700/pexels-photo-5212700.jpeg',
      match: 78,
      difficulty: 'Hard',
      applicants: '65,000+',
      successRate: '2%'
    },
    {
      id: '7',
      title: 'African Union Youth Volunteer Corps',
      organization: 'African Union',
      category: 'Global Programs',
      deadline: 'March 31, 2024',
      location: 'Various African Countries',
      description: 'Continental volunteer program promoting youth engagement in Africa\'s development.',
      requirements: [
        'African citizenship',
        'Age 18-35',
        'Relevant qualifications',
        'Language skills',
        '6-12 month availability'
      ],
      benefits: [
        'Monthly allowance',
        'Accommodation',
        'Training programs',
        'Certificate',
        'Network building'
      ],
      applicationProcess: [
        'Online registration',
        'Document submission',
        'Skills assessment',
        'Interview',
        'Placement matching'
      ],
      image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg',
      match: 87,
      difficulty: 'Easy',
      applicants: '15,000+',
      successRate: '20%'
    },
    {
      id: '8',
      title: 'Microsoft Student Partner Program',
      organization: 'Microsoft',
      category: 'Tech',
      deadline: 'Rolling Basis',
      location: 'Global',
      description: 'Student leadership program for those passionate about technology and helping their peers.',
      requirements: [
        'Currently enrolled student',
        'Technical skills',
        'Community involvement',
        'Communication skills',
        'Event organization experience'
      ],
      benefits: [
        'Microsoft certification',
        'Azure credits',
        'Exclusive events',
        'Mentorship',
        'Career opportunities'
      ],
      applicationProcess: [
        'Online application',
        'Technical assessment',
        'Community project',
        'Interview round',
        'Final selection'
      ],
      image: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg',
      match: 80,
      difficulty: 'Medium',
      applicants: '10,000+',
      successRate: '15%'
    },
    {
      id: '9',
      title: 'Commonwealth Youth Programme',
      organization: 'Commonwealth Secretariat',
      category: 'Global Programs',
      deadline: 'June 15, 2024',
      location: 'Commonwealth Countries',
      description: 'Empowering young people to contribute to sustainable development in Commonwealth countries.',
      requirements: [
        'Commonwealth citizen',
        'Age 15-29',
        'Development interest',
        'Leadership potential',
        'Project proposal'
      ],
      benefits: [
        'Project funding',
        'Training workshops',
        'Networking',
        'Mentorship',
        'Recognition awards'
      ],
      applicationProcess: [
        'Project proposal',
        'Application form',
        'Reference letters',
        'Selection review',
        'Implementation support'
      ],
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg',
      match: 83,
      difficulty: 'Medium',
      applicants: '5,000+',
      successRate: '18%'
    },
    {
      id: '10',
      title: 'Acumen Academy Fellowship',
      organization: 'Acumen Academy',
      category: 'Leadership',
      deadline: 'April 15, 2024',
      location: 'Various Locations',
      description: 'Year-long leadership development program for social change leaders.',
      requirements: [
        'Social impact experience',
        'Leadership role',
        'Commitment to change',
        'English proficiency',
        'Full program participation'
      ],
      benefits: [
        'Leadership training',
        'Global network',
        'Mentorship',
        'Project funding',
        'Certificate'
      ],
      applicationProcess: [
        'Online application',
        'Essay questions',
        'Video submission',
        'Reference checks',
        'Interview process'
      ],
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
      match: 86,
      difficulty: 'Hard',
      applicants: '3,000+',
      successRate: '12%'
    },
    {
      id: '11',
      title: 'Ashoka U Changemaker Campus',
      organization: 'Ashoka U',
      category: 'Entrepreneurship',
      deadline: 'September 30, 2024',
      location: 'Your Campus',
      description: 'Transform your campus into a hub for social innovation and changemaking.',
      requirements: [
        'University student/staff',
        'Social innovation interest',
        'Campus engagement',
        'Project leadership',
        'Sustainability focus'
      ],
      benefits: [
        'Campus recognition',
        'Funding opportunities',
        'Training programs',
        'Global network',
        'Impact measurement'
      ],
      applicationProcess: [
        'Campus assessment',
        'Application submission',
        'Stakeholder engagement',
        'Review process',
        'Implementation plan'
      ],
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
      match: 75,
      difficulty: 'Medium',
      applicants: '500+',
      successRate: '30%'
    },
    {
      id: '12',
      title: 'UN Youth Climate Summit',
      organization: 'United Nations',
      category: 'Global Programs',
      deadline: 'May 31, 2024',
      location: 'New York, USA',
      description: 'Platform for young climate leaders to showcase solutions and engage with world leaders.',
      requirements: [
        'Age 18-29',
        'Climate action experience',
        'Innovative solutions',
        'English proficiency',
        'Travel availability'
      ],
      benefits: [
        'UN platform access',
        'Global networking',
        'Media exposure',
        'Policy influence',
        'Certificate'
      ],
      applicationProcess: [
        'Solution submission',
        'Application form',
        'Video pitch',
        'Selection review',
        'Final presentation'
      ],
      image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg',
      match: 79,
      difficulty: 'Hard',
      applicants: '20,000+',
      successRate: '1%'
    },
    {
      id: '13',
      title: 'Facebook Community Leadership Program',
      organization: 'Meta',
      category: 'Tech',
      deadline: 'July 1, 2024',
      location: 'Online/Global',
      description: 'Supporting community leaders who use Facebook tools to build stronger communities.',
      requirements: [
        'Community leadership',
        'Facebook group admin',
        'Positive impact focus',
        'Growth mindset',
        'Time commitment'
      ],
      benefits: [
        'Training resources',
        'Funding opportunities',
        'Exclusive tools',
        'Networking events',
        'Recognition'
      ],
      applicationProcess: [
        'Community showcase',
        'Application form',
        'Impact metrics',
        'Interview process',
        'Program onboarding'
      ],
      image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
      match: 77,
      difficulty: 'Easy',
      applicants: '8,000+',
      successRate: '25%'
    },
    {
      id: '14',
      title: 'World Bank Youth Summit',
      organization: 'World Bank Group',
      category: 'Global Programs',
      deadline: 'August 15, 2024',
      location: 'Washington DC, USA',
      description: 'Annual gathering of young leaders to discuss global development challenges.',
      requirements: [
        'Age 18-35',
        'Development interest',
        'Leadership experience',
        'English proficiency',
        'Policy engagement'
      ],
      benefits: [
        'Summit participation',
        'World Bank access',
        'Networking',
        'Policy discussions',
        'Career opportunities'
      ],
      applicationProcess: [
        'Online application',
        'Essay submissions',
        'Reference letters',
        'Selection process',
        'Travel arrangements'
      ],
      image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg',
      match: 81,
      difficulty: 'Medium',
      applicants: '12,000+',
      successRate: '8%'
    },
    {
      id: '15',
      title: 'Global Shapers Community',
      organization: 'World Economic Forum',
      category: 'Leadership',
      deadline: 'October 31, 2024',
      location: 'Global Hubs',
      description: 'Network of young leaders working together to address local, regional and global challenges.',
      requirements: [
        'Age 20-30',
        'Leadership potential',
        'Community commitment',
        'Professional achievement',
        'Global mindset'
      ],
      benefits: [
        'Global network',
        'WEF events access',
        'Project funding',
        'Leadership development',
        'Impact platform'
      ],
      applicationProcess: [
        'Hub application',
        'Achievement portfolio',
        'Interview process',
        'Community vote',
        'Final selection'
      ],
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
      match: 84,
      difficulty: 'Hard',
      applicants: '25,000+',
      successRate: '5%'
    },
    {
      id: '16',
      title: 'African Development Bank Young Professionals Program',
      organization: 'African Development Bank',
      category: 'Scholarships',
      deadline: 'December 15, 2024',
      location: 'Various African Countries',
      description: 'Two-year program for young professionals to gain experience in development finance.',
      requirements: [
        'African nationality',
        'Masters degree',
        'Age under 32',
        'Relevant experience',
        'Language skills'
      ],
      benefits: [
        'Competitive salary',
        'Professional development',
        'Mentorship',
        'Career advancement',
        'Continental exposure'
      ],
      applicationProcess: [
        'Online application',
        'Document submission',
        'Written assessment',
        'Interview rounds',
        'Final selection'
      ],
      image: 'https://images.pexels.com/photos/5212700/pexels-photo-5212700.jpeg',
      match: 89,
      difficulty: 'Hard',
      applicants: '15,000+',
      successRate: '3%'
    },
    {
      id: '17',
      title: 'TechStars Startup Weekend',
      organization: 'TechStars',
      category: 'Entrepreneurship',
      deadline: 'Rolling Basis',
      location: 'Various Cities',
      description: '54-hour weekend event where entrepreneurs pitch ideas, form teams, and launch startups.',
      requirements: [
        'Entrepreneurial interest',
        'Weekend availability',
        'Team collaboration',
        'Pitch preparation',
        'Implementation readiness'
      ],
      benefits: [
        'Startup experience',
        'Mentorship access',
        'Networking',
        'Potential funding',
        'Skill development'
      ],
      applicationProcess: [
        'Event registration',
        'Idea pitch',
        'Team formation',
        'Weekend participation',
        'Final presentation'
      ],
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
      match: 76,
      difficulty: 'Easy',
      applicants: '1,000+',
      successRate: '60%'
    },
    {
      id: '18',
      title: 'UNESCO Youth Forum',
      organization: 'UNESCO',
      category: 'Global Programs',
      deadline: 'June 30, 2024',
      location: 'Paris, France',
      description: 'Biennial forum bringing together young people to discuss education, science, culture and communication.',
      requirements: [
        'Age 18-35',
        'UNESCO field interest',
        'Youth organization involvement',
        'Language skills',
        'Travel availability'
      ],
      benefits: [
        'UNESCO access',
        'Policy influence',
        'Global networking',
        'Cultural exchange',
        'Certificate'
      ],
      applicationProcess: [
        'National selection',
        'Application submission',
        'Document review',
        'Interview process',
        'Final delegation'
      ],
      image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg',
      match: 82,
      difficulty: 'Medium',
      applicants: '5,000+',
      successRate: '15%'
    },
    {
      id: '19',
      title: 'Amazon Future Engineer Scholarship',
      organization: 'Amazon',
      category: 'Tech',
      deadline: 'January 31, 2024',
      location: 'Various Countries',
      description: 'Scholarship program for underrepresented students pursuing computer science education.',
      requirements: [
        'Computer science major',
        'Underrepresented background',
        'Academic excellence',
        'Financial need',
        'Career commitment'
      ],
      benefits: [
        'Scholarship funding',
        'Internship opportunity',
        'Mentorship program',
        'Career support',
        'Amazon network'
      ],
      applicationProcess: [
        'Online application',
        'Academic transcripts',
        'Essay submissions',
        'Reference letters',
        'Selection review'
      ],
      image: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg',
      match: 78,
      difficulty: 'Medium',
      applicants: '20,000+',
      successRate: '5%'
    },
    {
      id: '20',
      title: 'Peace Corps Volunteer Program',
      organization: 'U.S. Peace Corps',
      category: 'Global Programs',
      deadline: 'Rolling Applications',
      location: 'Developing Countries',
      description: '27-month volunteer program promoting world peace and friendship through community service.',
      requirements: [
        'U.S. citizenship',
        'Age 18+',
        'Relevant skills',
        'Cultural adaptability',
        'Service commitment'
      ],
      benefits: [
        'Living allowance',
        'Health coverage',
        'Student loan benefits',
        'Career advantages',
        'Global experience'
      ],
      applicationProcess: [
        'Online application',
        'Interview process',
        'Medical clearance',
        'Legal clearance',
        'Training program'
      ],
      image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg',
      match: 73,
      difficulty: 'Medium',
      applicants: '30,000+',
      successRate: '25%'
    }
  ];

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || opp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="secondary"
              onClick={handleBack}
              className="p-2"
            >
              <ArrowLeft size={20} />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">All Opportunities</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">{filteredOpportunities.length} opportunities available</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search opportunities..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="p-4 space-y-4">
        {filteredOpportunities.map((opportunity, index) => (
          <Card
            key={opportunity.id}
            className="cursor-pointer hover:shadow-lg transition-all transform hover:scale-[1.02] animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => onSelectOpportunity(opportunity)}
          >
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0">
                <img
                  src={opportunity.image}
                  alt={opportunity.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 dark:text-white line-clamp-2 mb-1">
                      {opportunity.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{opportunity.organization}</p>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <Star size={14} className="text-yellow-500" />
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">{opportunity.match}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{opportunity.deadline}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={12} />
                    <span>{opportunity.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs border ${getDifficultyColor(opportunity.difficulty)}`}>
                      {opportunity.difficulty}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{opportunity.applicants} applicants</span>
                  </div>
                  <span className="text-xs text-primary font-medium">{opportunity.category}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {filteredOpportunities.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">No opportunities found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllOpportunities;
