export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary_range?: {
    min: number;
    max: number;
    currency: string;
  };
  employment_type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  remote_type: 'REMOTE' | 'HYBRID' | 'ON_SITE';
  posted_date: string;
  application_url: string;
  match_score?: number;
  skills_match?: {
    matching: string[];
    missing: string[];
  };
}

export interface JobSearchFilters {
  query?: string;
  location?: string;
  employmentType?: Job['employment_type'][];
  remoteType?: Job['remote_type'][];
  minSalary?: number;
  maxDistance?: number;
  postedWithin?: number; // days
  sortBy?: 'relevance' | 'date' | 'salary';
}

export interface JobSearchResponse {
  jobs: Job[];
  total: number;
  page: number;
  totalPages: number;
}
