import { useQuery } from 'react-query';
import { fetchAccounts } from '../lib/api';
import type { SearchFilters, SocialAccount } from '../types';

export function useAccounts(filters: SearchFilters) {
  return useQuery<SocialAccount[], Error>(
    ['accounts', filters],
    () => fetchAccounts(filters),
    {
      keepPreviousData: true,
      suspense: false,
    }
  );
}