import React from 'react';
import { ExternalLink, Users, Heart, MessageCircle, Play } from 'lucide-react';
import { SocialAccount } from '../types';
import { formatNumber } from '../lib/utils';

interface AccountCardProps {
  account: SocialAccount;
}

export function AccountCard({ account }: AccountCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{account.username}</h3>
          <p className="text-sm text-gray-500 mt-1">{account.category}</p>
        </div>
        <a
          href={account.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-gray-600"
          aria-label="外部リンクを開く"
        >
          <ExternalLink className="h-5 w-5" />
        </a>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
          <Users className="h-5 w-5 text-gray-400 mb-1" />
          <span className="text-sm font-medium text-gray-900">
            {formatNumber(account.metrics.followers)}
          </span>
          <span className="text-xs text-gray-500">フォロワー</span>
        </div>

        <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
          <Heart className="h-5 w-5 text-gray-400 mb-1" />
          <span className="text-sm font-medium text-gray-900">
            {formatNumber(account.metrics.likes || 0)}
          </span>
          <span className="text-xs text-gray-500">いいね</span>
        </div>

        <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
          {account.platform === 'youtube' ? (
            <>
              <Play className="h-5 w-5 text-gray-400 mb-1" />
              <span className="text-sm font-medium text-gray-900">
                {formatNumber(account.metrics.views || 0)}
              </span>
              <span className="text-xs text-gray-500">再生回数</span>
            </>
          ) : (
            <>
              <MessageCircle className="h-5 w-5 text-gray-400 mb-1" />
              <span className="text-sm font-medium text-gray-900">
                {formatNumber(account.metrics.comments || 0)}
              </span>
              <span className="text-xs text-gray-500">コメント</span>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          最終更新: {new Date(account.lastUpdated).toLocaleDateString('ja-JP')}
        </p>
      </div>
    </div>
  );
}