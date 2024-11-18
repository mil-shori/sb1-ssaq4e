import React from 'react';
import { Youtube, Instagram, Music2 } from 'lucide-react';
import { Platform } from '../types';
import { cn } from '../lib/utils';

interface PlatformFilterProps {
  selectedPlatforms: Platform[];
  onToggle: (platform: Platform) => void;
}

export function PlatformFilter({ selectedPlatforms, onToggle }: PlatformFilterProps) {
  const platforms: { id: Platform; icon: React.ReactNode; label: string }[] = [
    { id: 'youtube', icon: <Youtube className="h-5 w-5" />, label: 'YouTube' },
    { id: 'instagram', icon: <Instagram className="h-5 w-5" />, label: 'Instagram' },
    { id: 'tiktok', icon: <Music2 className="h-5 w-5" />, label: 'TikTok' },
  ];

  return (
    <div className="flex gap-2">
      {platforms.map(({ id, icon, label }) => (
        <button
          key={id}
          onClick={() => onToggle(id)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors',
            selectedPlatforms.includes(id)
              ? 'bg-blue-50 border-blue-200 text-blue-700'
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          )}
        >
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
}