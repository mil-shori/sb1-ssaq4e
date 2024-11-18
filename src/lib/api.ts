import axios from 'axios';
import type { SearchFilters, SocialAccount } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

export async function fetchAccounts(filters: SearchFilters): Promise<SocialAccount[]> {
  const params = new URLSearchParams();
  
  if (filters.keyword) {
    params.append('keyword', filters.keyword);
  }
  
  if (filters.platforms.length > 0) {
    params.append('platforms', filters.platforms.join(','));
  }
  
  if (filters.categories.length > 0) {
    params.append('categories', filters.categories.join(','));
  }
  
  params.append('sortBy', filters.sortBy);
  params.append('sortOrder', filters.sortOrder);

  const response = await axios.get(`${API_BASE_URL}/accounts`, { params });
  return response.data;
}

export async function exportAccounts(): Promise<void> {
  const response = await axios.get(`${API_BASE_URL}/export`, {
    responseType: 'blob'
  });
  
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'social_media_accounts.csv');
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}