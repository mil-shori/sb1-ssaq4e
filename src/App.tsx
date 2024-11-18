import React, { useState } from 'react';
import { Download, SlidersHorizontal } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { PlatformFilter } from './components/PlatformFilter';
import { AccountCard } from './components/AccountCard';
import { useAccounts } from './hooks/useAccounts';
import { exportAccounts } from './lib/api';
import type { Platform, SearchFilters } from './types';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    keyword: '',
    platforms: [],
    categories: [],
    sortBy: 'followers',
    sortOrder: 'desc'
  });

  const { data: accounts, isLoading, error } = useAccounts(filters);

  const handlePlatformToggle = (platform: Platform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      keyword: searchTerm,
      platforms: selectedPlatforms
    }));
  };

  const handleExport = async () => {
    try {
      await exportAccounts();
    } catch (error) {
      console.error('エクスポート中にエラーが発生しました:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                ソーシャルメディア分析ツール
              </h1>
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Download className="h-4 w-4" />
                データ出力
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                onSearch={handleSearch}
              />
              <button
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                title="詳細検索"
              >
                <SlidersHorizontal className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <PlatformFilter
              selectedPlatforms={selectedPlatforms}
              onToggle={handlePlatformToggle}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600">
            データの取得中にエラーが発生しました
          </div>
        ) : accounts?.length === 0 ? (
          <div className="text-center text-gray-500">
            該当するアカウントが見つかりませんでした
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts?.map(account => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;