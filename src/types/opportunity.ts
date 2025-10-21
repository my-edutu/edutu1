export type OpportunityDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  category: string;
  deadline?: string | null;
  location: string;
  description: string;
  requirements: string[];
  benefits: string[];
  applicationProcess: string[];
  image?: string | null;
  match: number;
  difficulty?: OpportunityDifficulty | null;
  applicants?: string;
  successRate?: string;
  applyUrl?: string;
  lastUpdated?: string;
}
