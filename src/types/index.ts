export type Platform = 'youtube' | 'instagram' | 'tiktok';

export interface SocialAccount {
  id: string;
  platform: Platform;
  url: string;
  username: string;
  category: string;
  subCategory?: string;
  metrics: {
    followers: number;
    engagement: number;
    views?: number;
    likes?: number;
    comments?: number;
  };
  lastUpdated: string;
}

export interface SearchFilters {
  keyword: string;
  platforms: Platform[];
  categories: string[];
  sortBy: 'followers' | 'engagement' | 'views';
  sortOrder: 'asc' | 'desc';
}