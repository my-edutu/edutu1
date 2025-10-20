export type OpportunityDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  category: string;
  deadline?: string;
  location: string;
  description: string;
  requirements: string[];
  benefits: string[];
  applicationProcess: string[];
  image: string;
  match: number;
  difficulty: OpportunityDifficulty;
  applicants?: string;
  successRate?: string;
}
